var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Recipe = require('./models/recipe');
var seedDB = require('./seeds');
var Comment = require('./models/comment');
var User = require('./models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var expressSanitizer = require("express-sanitizer");

var commentRoutes = require('./routes/comments'),
    recipeRoutes = require('./routes/recipes'),
    indexRoutes = require('./routes/index');

mongoose.Promise = global.Promise;
var dataBase = process.env.DATABASEURL || "mongodb://localhost/taas_v12";
mongoose.connect(dataBase);

app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.set('view engine', 'ejs');
// app.use(express.static(__dirname + "/public"));
app.use(express['static'](__dirname+'/public', {maxAge: 86400000}));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// Passport Config
app.use(require('express-session')({
    secret: "I love coffee",
    resave: false,
    saveUninitialize: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/recipes/:id/comments",commentRoutes);
app.use("/recipes", recipeRoutes);


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Taco time..."); 
});