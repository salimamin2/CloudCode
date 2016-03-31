// vendor library
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

// custom library
// model
var Model = require('./model');

// index
var index = function(req, res, next) {
   if(!req.isAuthenticated()) {
      res.redirect('/signin');
   } else {

      var user = req.user;

      if(user !== undefined) {
         user = user.toJSON();
      }
      res.render('index', {title: 'Home', user: user});
   }
};

// sign in
// GET
var signIn = function(req, res, next) {
   if(req.isAuthenticated()) res.redirect('/');
   res.render('signin', {title: 'Sign In'});
};

// sign in
// POST
var signInPost = function(req, res, next) {
   passport.authenticate('local', { successRedirect: '/',
                          failureRedirect: '/signin'}, function(err, user, info) {
      if(err) {
         return res.render('signin', {title: 'Sign In', errorMessage: err.message});
      } 

      if(!user) {
         return res.render('signin', {title: 'Sign In', errorMessage: info.message});
      }
      return req.logIn(user, function(err) {
         if(err) {
            return res.render('signin', {title: 'Sign In', errorMessage: err.message});
         } else {
            return res.redirect('/');
         }
      });
   })(req, res, next);
};


// sign out
var signOut = function(req, res, next) {
   if(!req.isAuthenticated()) {
      notFound404(req, res, next);
   } else {
      req.logout();
      res.redirect('/signin');
   }
};

// 404 not found
var notFound404 = function(req, res, next) {
   res.status(404);
   res.render('404', {title: '404 Not Found'});
};

// export functions
/**************************************/
// index
module.exports.index = index;

// sigin in
// GET
module.exports.signIn = signIn;
// POST
module.exports.signInPost = signInPost;

// sign up
// GET
module.exports.signUp = signUp;
// POST
module.exports.signUpPost = signUpPost;

// sign out
module.exports.signOut = signOut;

// 404 not found
module.exports.notFound404 = notFound404;