/// DEPENDENCIES AND INITS
var express  = require("express"),
    passport = require("passport"),
    router   = express.Router(),
    User     = require("../models/user");

/// SHOW 'MAIN' PAGE
router.get("/", function(req, res){
    res.render("landing");
});

///////////////////////////////REGISTER///////////////////////////////

/// SHOW 'REGISTER' FORM
router.get("/register", function(req, res){
   res.render("register"); 
});

/// REGISTER LOGIC
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Your account has been created. Welcome to YelpCamp, " + req.body.username + "!");
           res.redirect("/campgrounds"); 
        });
    });
});

///////////////////////////////LOGIN///////////////////////////////

/// SHOW 'LOGIN' FORM
router.get("/login", function(req, res){
   res.render("login"); 
});

/// LOGIN LOGIC
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
        req.flash("success", "You have been successfully logged in!");
});

///////////////////////////////LOG-OUT///////////////////////////////

/// LOG-OUT LOGIC
router.get("/logout", function(req, res){
   req.logout();
   req.flash("error", "Logged you out");
   res.redirect("/campgrounds");
});

//RETURN DATA
module.exports = router;