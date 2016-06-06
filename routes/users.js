var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest:'./public/images/uploads'});
// var upload = multer({dest: './uploads'});
var path = require('path');
var app = express();
app.use(express.static(path.join(__dirname, 'public')));
var User = require('../models/user');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var FACEBOOK_APP_ID = '1696119543980589';
var FACEBOOK_APP_SECRET = 'a399cf505de81c1a958094455046e413';

/* router.get('/', function(request, response) {
  response.send('respond with a resource');
}); 

router.get('/contact', function(request, response, next) {
  response.render('contacts');
}); 

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/default', function(request, response) {
  response.render('login.jade');
}); 

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/success',
  failureRedirect: '/error'
}));

router.get('/register', function(req, res, next) {
  res.render('register.jade');
});

router.get('/logout', function(req, res){
  console.log('logging out');
  req.logout();
  res.redirect('/');
}); */


//
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/* router.get('/contact', function(req, res, next) {
  res.render('contacts');
}); */

/* router.get('/register', function(req, res, next) {
  res.render('register',{title:'Register'});
}); */

/* router.get('/login', function(req, res, next) {
  res.render('login', {title:'Login'});
}); */

/* router.post('/login',
  passport.authenticate('local',{failureRedirect:'/users/login', failureFlash: 'Invalid username or password'}),
  function(req, res) {
   req.flash('success', 'You are now logged in');
   res.redirect('/');
}); */

/* passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done){
  User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'Unknown User'});
    }

    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      } else {
        return done(null, false, {message:'Invalid Password'});
      }
    });
  });
})); */

/* router.post('/register', upload.single('profileimage') ,function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  if(req.file){
    console.log('Uploading File...');
    req.flash('Uploading File...');
    var profileimage = req.file.filename;
  } else {
    console.log('No File Uploaded...');
    req.flash('No File Uploaded...');
    var profileimage = 'noimage.jpg';
  }

  // Form Validator
  req.checkBody('name','Name field is required').notEmpty();
  req.checkBody('email','Email field is required').notEmpty();
  req.checkBody('email','Email is not valid').isEmail();
  req.checkBody('username','Username field is required').notEmpty();
  req.checkBody('password','Password field is required').notEmpty();
  req.checkBody('password2','Passwords do not match').equals(req.body.password);

  // Check Errors
  var errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors: errors
    });
  } else{
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileimage: profileimage
    });

    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);
    });

    req.flash('success', 'You are now registered and can login');

    res.location('/');
    res.redirect('/');
  }
}); */

/* router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/users/deflogin');
}); */




//



module.exports = router;
