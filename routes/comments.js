var express = require("express");
var router = express.Router({mergeParams: true});

var Comment = require('../models/comment');
var Recipe = require('../models/recipe');

var middleware = require('../middleware');

// COMMENT Routes

router.get('/new', middleware.isLoggedIn, function(req, res) {
    Recipe.findById(req.params.id, function(err, recipe) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {recipe: recipe});
        }
    });
});

router.post('/', middleware.isLoggedIn, function(req, res) {
   Recipe.findById(req.params.id, function(err, recipe) {
       if (err) {
           console.log(err);
           res.redirect('/recipes');
       } else {
           Comment.create(req.body.comment, function(err, comment) {
               if (err) {
                   console.log(err);
               } else {
                   // add username and id to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   recipe.comments.push(comment);
                   recipe.save();
                   req.flash('success', 'Successfully added comment');
                   res.redirect('/recipes/' + recipe._id)
               }
           })
       }
   });
});

// Edit route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect('bakc');
        } else {
             res.render('comments/edit', {recipe_id: req.params.id, comment: foundComment});
        }
    });
})

// Update route
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
       if (err) {
           res.redirect('back');
       } else {
           req.flash('success', 'Comment successfully updated.');
           res.redirect('/recipes/' + req.params.id);
       }
   }) ;
});

// Delete route
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect('back');
        } else {
            req.flash('success', 'Comment successfully deleted.');
            res.redirect('/recipes/' + req.params.id);
        }
    });
});

module.exports = router;