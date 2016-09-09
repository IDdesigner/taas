var express = require("express");
var router = express.Router();

var Recipe = require("../models/recipe");

var middleware = require('../middleware');


router.get('/', function(req, res) {
    Recipe.find({}, function(err, recipes) {
        if (err) {
            console.log(err);
        } else {
            res.render('recipes/index', {recipes: recipes, currentUser: req.user});
        }
    });
    // res.render('recipes', {recipes: recipes}); 
});

// Create new recipe
router.post('/', middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    
    // var origText = req.body.ingredients;
    // var textNoSpaces = origText.replace(/ /g, ' ');
    // var ingredients = textNoSpaces.split(",");
    var ingredients = middleware.isSplit(req.body.ingredients);
    
    var directions = req.body.directions;
    directions = req.sanitize(directions);
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    var newRecipe = {name: name, image: image, ingredients: ingredients, directions: directions, author: author};
    
    Recipe.create(newRecipe, function(err, newRecipe) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/recipes");
        }
    });
});

router.get('/new', middleware.isLoggedIn, function(req, res) {
    res.render('recipes/new');
});

router.get('/:id', function(req, res) {
    Recipe.findById(req.params.id).populate("comments").exec( function(err, foundRecipe) {
        if (err) {
            console.log(err);
        } else {
            // console.log(foundRecipe);
            res.render('recipes/show', {recipe: foundRecipe});
        }
    });
});

// Edit recipe
router.get('/:id/edit', middleware.checkRecipeOwnership, function(req, res) {
    Recipe.findById(req.params.id, function(err, foundRecipe) {
        if (err) {
            console.log(err)
        } else {
            res.render('recipes/edit', {recipe: foundRecipe});
        }
    });
});

// Update recipe
router.put('/:id', middleware.checkRecipeOwnership, function(req, res) {
    
    var ingredients = middleware.isSplit(req.body.ingredients);
    var directions = req.body.directions;
    directions = req.sanitize(directions);
    var updateRecipe = {
        name: req.body.name,
        image: req.body.image,
        ingredients: ingredients,
        directions: directions
    };
    
    Recipe.findByIdAndUpdate(req.params.id, updateRecipe, function(err, updatedRecipe) {
        if (err) {
            res.redirect('/recipes');
        } else {
            res.redirect(('/recipes/' + req.params.id));
        }
    });
});

// Delete recipe
router.delete('/:id', middleware.checkRecipeOwnership, function(req, res) {
   Recipe.findByIdAndRemove(req.params.id, function(err) {
       if (err) {
           res.redirect('/recipes');
       } else {
           res.redirect('/recipes');
       }
   }); 
});

module.exports = router;