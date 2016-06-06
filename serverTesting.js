var express = require('express');
var path = require('path');
var app = express();

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var FACEBOOK_APP_ID = '1696119543980589';
var FACEBOOK_APP_SECRET = 'a399cf505de81c1a958094455046e413';

app.set('port', (process.env.PORT || 5003));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
// app.set('views', __dirname + '/');
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');


app.use(passport.initialize());
app.use(passport.session());

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

app.get('/', function(request, response) {
  // response.render('home.htm');
  response.sendFile(path.join(__dirname + '/homeTst.html'));
}); 

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/success',
  failureRedirect: '/error'
}));

app.get('/logout', function(req, res){
  console.log('logging out');
  req.logout();
  res.redirect('/');
});

app.listen(app.get('port'), function() {
  console.log('(fbpluginpug) Node app is running on port ***', app.get('port'));
});

