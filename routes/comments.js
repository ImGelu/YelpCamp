/// DEPENDENCIES AND INIT
var express    = require("express"),
    router     = express.Router({mergeParams: true}), /// FOR PASSING :ID IN APP.JS
    Campground = require("../models/campground"),
    Comment    = require("../models/comment"),
    middleware = require("..//middleware/index.js");

/// SHOW NEW COMMENT FORM
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err) req.flash("error", "An unexpected error has occured. Try again!");
        else res.render("comments/new", {campground: campground});
    });
});

/// 'CREATE COMMENT' LOGIC
router.post("/", middleware.isLoggedIn, function(req, res){
   Campground.findById(req.params.id, function(err, campground){ /// SEARCH FOR CAMPGROUND
       if(err){
           req.flash("error", "An unexpected error has occured. Try again!");
           res.redirect("/campgrounds");
       } else {
            Comment.create(req.body.comment, function(err, comment){ /// CREATE COMMENT
            if(err) req.flash("error", "An unexpected error has occured. Try again!");
            else {
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               campground.comments.push(comment); /// CONNECT NEW COMMENT TO CAMPGROUND
               campground.save();
               req.flash("success", "Your comment has been added!");
               res.redirect('/campgrounds/' + campground._id);
            }
            });
         }
   });
});

/// SHOW 'EDIT COMMENT' FORM
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            req.flash("error", "An unexpected error has occured. Try again!");
            res.redirect("back");
        }
        else res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    });
});

/// 'EDIT COMMENT' LOGIC
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err) res.redirect("back"); 
       else{
           req.flash("success", "Your comment has been edited!");
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

/// DELETE COMMENT
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "An unexpected error has occured. Try again!");
            res.redirect("back");
        }
        else{
            req.flash("success", "The comment has been deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

/// RETURN DATA
module.exports = router;