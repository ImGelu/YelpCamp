/// DEPENDENCIES AND INIT
var express    = require("express"),
    router     = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware/index.js");

/// SHOW ALL CAMPGROUNDS
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){ /// SEARCH ALL CAMPGROUNDS
       if(err) req.flash("error", "An unexpected error has occured. Try again!");
       else res.render("campgrounds/index", {campgrounds:allCampgrounds});
    });
});

/// SHOW 'NEW CAMPGROUND' FORM
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

/// 'NEW CAMPGROUND' LOGIC
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author, price: price};
    Campground.create(newCampground, function(err, newlyCreated){ /// CREATE NEW CAMPGROUND
        if(err) req.flash("error", "An unexpected error has occured. Try again!");
        else{
            req.flash("success", "The campground has been added!");
            res.redirect("/campgrounds");
        }
    });
});

/// SHOW 'ABOUT CAMPGROUND' PAGE
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){ /// FIND CAMPGROUND PROVIDED BY ID
        if(err) req.flash("error", "An unexpected error has occured. Try again!");
        else res.render("campgrounds/show", {campground: foundCampground});
    });
});

/// SHOW 'EDIT CAMPGROUND' PAGE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err) req.flash("error", "An unexpected error has occured. Try again!");
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

/// 'EDIT CAMPGROUND' LOGIC
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           req.flash("error", "An unexpected error has occured. Try again!");
           res.redirect("/campgrounds");
       }
       else{
           req.flash("success", "The campground has been edited");
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

/// DELETE CAMPGROUND
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "An unexpected error has occured. Try again!");
            res.redirect("/campgrounds");
        }
        else{
            req.flash("error", "The campground has been deleted");
            res.redirect("/campgrounds");
        }
    });
});

/// RETURN DATA
module.exports = router;

