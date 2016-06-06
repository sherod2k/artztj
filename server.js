var express = require('express');
var router = express.Router();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var session = require('express-session');
// var multer = require('multer');
// var upload = multer({ dest: 'uploads/' })
var expressValidator = require('express-validator');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var flash = require('connect-flash');
var bcrypt = require('bcryptjs');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var FACEBOOK_APP_ID = '1696119543980589';
var FACEBOOK_APP_SECRET = 'a399cf505de81c1a958094455046e413';




app.set('port', (process.env.PORT || 5002));
// app.use(express.static(__dirname + '/public'));


// views is directory for all template files
// app.set('views', __dirname + '/');
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// Handle Sessions
app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  // res.locals.authdata = fbRef.getAuth();
  res.locals.page = req.url;
  // res.locals.messages = require('express-messages')(req, res);
  next();
});

// Get user info
app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  // res.locals.userType = req.user.userType;
  // console.log('^^^^^^^^^^^ res.locals.userType is ^^^^^^^^^^^' + res.locals.userType);
  // res.locals.errors = req.errors || null;
  next();
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log('****development*******');
    console.log(err);
    console.log('****development*******');  

    res.render('errorDevelop', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log('****PROD******');
  console.log(err);
  console.log('****PROD*******');
  res.render('errorProd', {
    message: err.message,
    error: {}
  });
});

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  // callbackURL: 'http://localhost:3000/auth/facebook/callback'
  callbackURL: 'https://fbplug.herokuapp.com/'
}, function(accessToken, refreshToken, profile, done) {
  process.nextTick(function() {
    //Assuming user exists
    done(null, profile);
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


/* app.get('/', function(request, response) {
  response.render('home.pug');
}); 

app.get('/contact', function(request, response, next) {
  response.render('contacts.pug');
}); 

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/defLogin', function(request, response, next) {
  response.render('login',{title:'Login'});
}); 

app.post('/defLogin', passport.authenticate('local',{failureRedirect:'/defLogin', failureFlash: 'Invalid username or password'}),
  function(req, res) {
   req.flash('success', 'You are now logged in');
   res.redirect('/');
});



 app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/success',
  failureRedirect: '/error'
}));

app.get('/register', function(req, res, next) {
  res.render('register',{title:'Register'});
});

app.get('/logout', function(req, res){
  console.log('logging out');
  req.logout();
  res.redirect('/');
}); */

// module.exports = app;

app.listen(app.get('port'), function() {
  console.log('($$$ tjarts $$$) Node app is running on port', app.get('port'));
}); 

