/// DEPENDENCIES AND INITS
var express        = require("express"),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    flash          = require("connect-flash"),
    app            = express(),
    Campground     = require("./models/campground"),
    Comment        = require("./models/comment"),
    User           = require("./models/user");

/// ROUTES 
var indexRoutes      = require("./routes/index"),
    campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments");
    
/// DATABASE CONNECTION
//mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
mongoose.connect("mongodb://gelu:webdev123@ds225382.mlab.com:25382/gelu-yc", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));

//deprecation warnings
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

/// EJS INIT
app.set("view engine", "ejs");

/// USAGE OF PUBLIC DIRECTORIES FOR CSS/JS
app.use(express.static(__dirname + "/public"));

/// METHOD FOR PUT AND DELETE
app.use(methodOverride("_method"));

/// FOR ALERT MESSAGES
app.use(flash());

/// AUTHENTICATION (PASSPORT)
app.use(require("express-session")({
    secret: "hm1",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/// PASS USER DATA ON ALL PAGES; UNDEFINED IF NOT LOGGED IN
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

/// ROUTES SETUP
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

/// SERVER START UP
app.listen(3000, function(){
   console.log("The YelpCamp Server Has Started!");
});