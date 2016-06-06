var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var multer = require('multer');
var upload = multer({dest:'./public/images/uploads'});
// var upload = multer({dest: './uploads'});
var path = require('path');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var FACEBOOK_APP_ID = '1696119543980589';
var FACEBOOK_APP_SECRET = 'a399cf505de81c1a958094455046e413';

var User = require('../models/user');
var Painting = require('../models/painting');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUsersById(id, function(err, user) {
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
}));


/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  // console.log('after successful authentication');
  res.render('index', { title: 'Home Page' });
});   

/* router.get('/', function(req, res, next) {
  res.render('home', { title: 'Home Page' });
}); */ 

/* router.get('/errorProd', function(req, res, next) {
  res.render('errorProd');
}); */ 
/* router.get('/register', function(req, res, next) {
  res.render('register',{title:'Register'});
}); */ 

router.get('/contact', function(req, res, next) {
  res.render('contacts', { title: 'Contacts Page' });
});

router.post('/contact', function(req, res,next) {
  /* var transporter = nodemailer.createTransport(
      {service: 'Gmail',
       auth    : {
             user: 'anthonycool2k@gmail.com',
             pass: 'gmail2k15'
       }
      });  */
  /*  ********************************************** */
  var name = req.body.name;
  var email = req.body.email;
  var message = req.body.message
  
  // Form Validator
  req.checkBody('name','Name is required').notEmpty();
  req.checkBody('email','Email is required').notEmpty();
  req.checkBody('message','message is required').notEmpty(); 
   
  // Check Errors
  var errors = req.validationErrors();
  global.errors = errors;
  if(errors){
    console.log("******************* EMAIL FIELDS BLANK *****************");
    res.render('contacts', {
      user: req.user,
      errors: global.errors
    });
  } else {


    /*  ********************************************* */
    var transporter = nodemailer.createTransport(
      smtpTransport('smtps://anthonycool2k%40gmail.com:gmail2k15@smtp.gmail.com') 
    ); 

    var  mailOptions = {
          from: 'Anthony Cool',
          to   : 'sherod2k@yahoo.com',
          subject : 'website submission',
          text: 'You have a submission with the following details... Name: '+req.body.name+'Email: '+req.body.email+ 'Message: '+req.body.message,
          html: '<p>You have a submission with the following details...</p><ul><li>Name: '+req.body.name+'</li><li>Email: '+req.body.email+'</li><li>Message: '+req.body.message+'</li></ul>'

    };
    transporter.sendMail(mailOptions, function(error,info){
      if(error){
        res.render("error",{error: error});
        /* console.log("*******************GMAIL $$$ ERROR***************************");
        console.log(error);
        console.log("*******************GMAIL $$$ ERROR***************************");
        res.redirect('/'); */
      } else {
         console.log("*******************GMAIL1 $$$ SENT***************************");
         console.log('message sent: ' + info.response);
         console.log("*******************GMAIL1 $$$ SENT***************************");
         res.redirect('/');
      }
    });

    /* var  mailOptions = {
          from: 'Anthony Cool',
          to   : req.body.email,
          subject : 'TJArtzs Email Acknowledgement',
          text: 'Thank you ' + req.body.name + '. We have acknowledged receipt of your email.',
          html: '<p>Thank you ' + req.body.name + '. We have acknowledged receipt of your email.</p>'
    };

    transporter.sendMail(mailOptions, function(error,info){
        if(error){
          res.render("error",{error: error});
          console.log("*******************GMAIL2 $$$ ERROR***************************");
          console.log(error);
          console.log("*******************GMAIL2 $$$ ERROR***************************");
          res.redirect('/'); 
        } else {
           console.log("*******************GMAIL2 $$$ SENT***************************");
           console.log('message sent: ' + info.response);
           console.log("*******************GMAIL2 $$$ SENT***************************");
           req.flash('Email Sent');
           res.redirect('/');
        }
      });  */

 } // end if errors

});

/* router.get('/view', getAllPaintings, function(req, res, next) {
  res.render('paintings', { title: 'Paintings Listing', paintings: paintings});
}); */

// Works
/* router.get('/view', function(req, res, next) {
  Painting.find({}, function(err,paintings){
    // if (err) throw err;
    if (err) console.log('error in retreiving paintings');
    console.log('no error in retreiving paintings');
    console.log(paintings);
    res.render('paintings', { title: 'Paintings Listing', paintings: paintings});
  })
}); */

router.get('/view', function(req, res, next){
  Painting.getPaintingsAll({},function(err,paintings){
    if (err) {console.log('*** error in retreiving paintings ***');
     } else {
        console.log('*** no error in retreiving paintings ***');
        res.render('paintings', { title: 'Paintings-Listing', paintings: paintings});
    }
  })
});

function getAllPaintings(req, res, next){
  Painting.find({}, function(err,paintings){
    if (err) throw err;
    console.log(paintings);
    return next(); 
  })
}


router.get('/viewUsers', function(req, res, next){
  User.getUsersAll({},function(err,users){
    if (err) {console.log('*** error in retreiving users ***');
    } else {
       console.log('*** no error in retreiving users ***');
       res.render('users', { title: 'Users-Listing', users: users});
    }
  })
    
});



/*  module.exports.getPaintingsById = function(id, callback){
  Painting.findById(id, callback);
} */

router.get('/details/:id', function(req, res){
  var id = req.params.id;
  Painting.getPaintingsById(id, function(err,painting){
    if (err) {console.log('*** error in retreiving paintings ***');
     } else {
        console.log('*** no error in retreiving paintings ***');
        res.render('details', { title: 'Paintings-Listing', painting: painting, id:id});
     }
  })
});

router.get('/login', function(req, res, next) {
  res.render('login', {title:'Login'});
});

router.get('/register', function(req, res, next) {
  global.errors = null;
  res.render('register',{title:'Register'});
});

router.get('/addPainting', function(req, res, next) {
  res.render('addPainting',{title:'Add Painting'});
});

router.get('/editPainting/:id', function(req, res) {
  var id = req.params.id;
   Painting.getPaintingsById(id, function(err,painting){
    if (err){console.log('*** error in retreiving paintings ***');
     } else {
        console.log('*** no error in retreiving paintings ***');
        res.render('editPainting', { title: 'Painting-Edit', painting: painting, id:id});
     }
   })
  });

router.get('/editUser/:id', function(req, res) {
  var id = req.params.id;
   User.getUsersById(id, function(err,user){
    if (err) {console.log('*** error in retreiving user ***');
     } else {
        res.render('editUser', { title: 'User-Edit', user: user, id:id});
    }
   })
  });

/* module.exports.FindAndUpdate = function(id, updatedInfoObj, callback){
  Painting.findByIdAndUpdate(id,updatedInfoObj,callback);
} */

router.post('/editPainting/:id', upload.single('paintingimage'), function(req, res, next) {
  var id = req.params.id;
  // var albumRef = new Firebase('https://albumzs01.firebaseio.com/albums/'+id);
  if(req.file){
  var updObj = {name: req.body.name,
                description: req.body.description,
                type: req.body.type,
                size: req.body.size,
                price: req.body.price,
                paintingimage: req.file.filename
              };
  }else{
  var updObj = {name: req.body.name,
                description: req.body.description,
                type: req.body.type,
                size: req.body.size,
                price: req.body.price,
              };
  }
  Painting.findByIdAndUpdate(id,updObj, function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect('/details/'+id);
    }
  })
  
  });

  
router.post('/editUser/:id', upload.single('profileimage'), function(req, res, next) {
  var id = req.params.id;
  // var albumRef = new Firebase('https://albumzs01.firebaseio.com/albums/'+id);
  /* var name = req.body.name;
  var userType = req.body.userType;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2; */

  req.checkBody('name','Name field is required').notEmpty();
  if(req.user && global.userType == 'admin'){
    req.checkBody('userType','User type field is required').notEmpty();
  }
  req.checkBody('email','Email field is required').notEmpty();
  req.checkBody('email','Email is not valid').isEmail();
  req.checkBody('username','Username field is required').notEmpty();
   
  // Check Errors
  var errors = req.validationErrors();
  global.errors = errors;
  /* if(errors){
     console.log('********* Edit Errors **************');
     res.render('editUser/'+ id, {
      user: req.user,
      errors: global.errors
    }); 
   
  } else { */
  
    if(req.file){
    console.log('****************not empty****************');
    var updObj = {name: req.body.name,
                  userType: req.body.userType,
                  email: req.body.email,
                  username: req.body.username,
                  profileimage: req.file.filename
                };
    }else{
    console.log('**************empty****************');
    var updObj = {name: req.body.name,
                  userType: req.body.userType,
                  email: req.body.email,
                  username: req.body.username
                };
    }
    User.findByIdAndUpdate(id,updObj, function(err){
      if(err){
        console.log(err);
      }else{
        res.redirect('/viewUsers/');
      }
    })
  
  //} // end if errors

});

router.delete('/delete/:id', function(req, res, next) {
  var id = req.params.id;
  // var albumRef = new Firebase('https://albumzs01.firebaseio.com/albums/'+id);
  // albumRef.remove();
  Painting.DeletePainting(id, function(err){
    if(err){
      console.log(err);
     } else {
      console.log("********* painting deleted ********");
     }

    });
  req.flash('success_msg','Painting Deleted');
  res.send(200);
});

router.delete('/deleteUser/:id', function(req, res, next) {
  var id = req.params.id;
  // var albumRef = new Firebase('https://albumzs01.firebaseio.com/albums/'+id);
  // albumRef.remove();
  User.DeleteUser(id, function(err){
    if(err){
      console.log(err);
     } else {
      console.log("********* user deleted ********");
     }

    });
  req.flash('success_msg','User Deleted');
  res.send(200);
});

router.post('/login',
  passport.authenticate('local',{failureRedirect:'/login', failureFlash: 'Invalid username or password'}),
  function(req, res) {
   req.flash('success', 'You are now logged in');
   // res.locals.userType = req.user.userType || null;
   global.userType =  req.user.userType || null;
   res.redirect('/');
   // res.render('home')
});


router.post('/register', upload.single('profileimage'),function(req, res, next) {
  var name = req.body.name;
  if(req.user && global.userType == 'admin'){
    var userType = req.body.userType;
  } else {
    var userType = "regular";
  }

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
  if(req.user && global.userType == 'admin'){
    req.checkBody('userType','User type field is required').notEmpty();
  }
  req.checkBody('email','Email field is required').notEmpty();
  req.checkBody('email','Email is not valid').isEmail();
  req.checkBody('username','Username field is required').notEmpty();
  req.checkBody('password','Password field is required').notEmpty();
  req.checkBody('password2','Passwords do not match').equals(req.body.password);
   
  // Check Errors
  var errors = req.validationErrors();
  global.errors = errors;
  if(errors){
    res.render('register', {
      user: req.user,
      errors: global.errors
    });
  } else{
    var newUser = new User({
    name: name,
    userType: userType,
    email: email,
    username: username,
    password: password,
    profileimage: profileimage
    });
    
    User.createUser(newUser, function(err, user){
    if(err){ throw err;
        console.log(req.user);
     }
    });

    req.flash('success', 'You are now registered and can login');
    if(req.user && global.userType == 'admin'){
      res.location('/viewUsers');
      res.redirect('/viewUsers');
    }else
    {
      res.location('/');
      res.redirect('/');
    }
  }
});

//
router.post('/addPainting', upload.single('paintingimage'),function(req, res, next) {
  var name = req.body.name;
  var type = req.body.type;
  var price = req.body.price;
  var description = req.body.description;
  var size = req.body.size;

  if(req.file){
    console.log('Uploading painting File...');
    req.flash('Uploading File...');
    var paintingimage = req.file.filename;
  } else {
    console.log('No File Uploaded...');
    req.flash('No File Uploaded...');
    var paintingimage = 'noimage.jpg';
  }

  // Form Validator
  req.checkBody('name','Name field is required').notEmpty();
  req.checkBody('type','Type field is required').notEmpty();
  req.checkBody('price','Price field is required').notEmpty();
  req.checkBody('description','Description field is required').notEmpty();
  req.checkBody('size','Size field is required').notEmpty();

  // Check Errors
  var errors = req.validationErrors();
  global.errors = errors;
  if(errors){
    res.render('addPainting', {title:'Add Painting',
      errors: global.errors,
      user: req.user
    });
  } else{
    var newPainting = new Painting({
      name: name,
      type: type,
      price: price,
      description: description,
      size: size,
      paintingimage: paintingimage
    });
    // User.createUser(newPainting, function(err, painting){
    Painting.createPainting(newPainting, function(err, painting){
      if(err) throw err;
      console.log(painting);
    });

    req.flash('success_msg', 'Painting added');
    // res.location('/view');
    res.redirect('/view');
  }
});

//
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  // res.redirect('/users/login');
  // res.redirect('/home');
  res.render('index', { title: 'Home Page' });
}


router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/');
});


module.exports = router;