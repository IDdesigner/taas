var mongoose = require("mongoose");
var Recipe = require("./models/recipe");
var Comment = require("./models/comment");

var data = [
    {
        name: "Tofu Taco",
        image: "https://farm4.staticflickr.com/3218/2425580619_3e5e9aebfe.jpg",
        ingredients: ["Tofu","Tomato","Lettuce","Peppers","Salsa"],
        directions: "This is a savory dish that is certain to delight anyone. Don't forget to grill the pepper to perfection. Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic."
    },
    {
        name: "Veggie Taco",
        image: "https://farm4.staticflickr.com/3416/3298959671_2263e70d9f.jpg",
        ingredients: ["Onions","Garli","Cilantro","Peppers","Salsa"],
        directions: "Grilled veggies are always a hit. Packed full of flavor and good nutrition, too. Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic."
    },
    {
        name: "Tempeh Taco",
        image: "https://farm4.staticflickr.com/3063/2813159060_4894fd6ea1.jpg",
        ingredients: ["Tempeh","Tomatoe","Lettuce","Peppers","Salsa"],
        directions: "Haven't tried tempeh?! Now it's time to start. Veggies es bonus vobis, proinde vos postulo essum magis kohlrabi welsh onion daikon amaranth tatsoi tomatillo melon azuki bean garlic."
    }
];

function seedDB() {
    Recipe.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Removed recipes');
            data.forEach(function(seed) {
                Recipe.create(seed, function(err, recipe) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Added a recipe");
                        Comment.create(
                            {
                                text: "This recipe was so yummy. Can't wait to make it again.",
                                author: "Homer"
                            }, function(err, comment) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    recipe.comments.push(comment);
                                    recipe.save();
                                    console.log("Created new comment.");
                                }
                            });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;
