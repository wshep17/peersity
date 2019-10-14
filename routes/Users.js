var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoUtil = require('../mongoUtil');
var db = mongoUtil.getDb();
var userModel = require('../models/user');
var refresh


var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/register', function(req, res, next) {
  res.render('register', {title: 'Register', refresh: true});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title:'Login'});
});

router.post('/login',
  passport.authenticate('local',{failureRedirect:'/users/login', failureFlash: 'Invalid username or password'}),
  function(req, res) {
   var user = req.user;
   console.log(user)
   //req.flash('success', 'You are now logged in');
   res.redirect('/home');
});

passport.serializeUser(function(user, done) {
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
}));

const duplicateUser = function(query_username) {
	db.collection('DefaultUser').findOne({username: query_username}, function(err, document) {
		if (document) {
			console.log("duplicate user found")
			return true;
		} else {
			return false;
		}
	});
}
router.post('/register', upload.single('profileimage'), async function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  var isTutor = false;
  var isAvailable = false;
  var isAdmin = false;
  var hasApplied = false;
  var room = "";
  var isRequested = false;
  var cart = 0;
  var minutes = 0;
  var tutorInUserState = false
  var accountId = "";
  var sentRequest = false;

  if(req.file){
  	console.log('Uploading File...');
  	var profileimage = req.file.filename;
  } else {
  	console.log('No File Uploaded...');
  	var profileimage = 'noimage.jpg';
  }

  // Form Validator
  req.checkBody('name').notEmpty();

  //Email Validation Checks
  req.checkBody('email').notEmpty();
  req.checkBody('email').isEmail().custom(async function(value) {
  	let emailCheck = await db.collection('DefaultUser').findOne({email: value});
  	if (emailCheck != null) {
  		return Promise.reject();
  	}
  });

  //Username Validation Checks
  req.checkBody('username').notEmpty();
  req.checkBody('username').custom(async function(value) {
  	let usernameCheck = await db.collection('DefaultUser').findOne({username: value});
  	if (usernameCheck != null) {
		return Promise.reject()
	}
  })

  //Password Validation Checks
  req.checkBody('password').notEmpty();
  req.checkBody('password2','Passwords do not match').equals(req.body.password);

  // Check Errors
  var errors = await req.getValidationResult();
  if (!errors.isEmpty()) {
  	//console.log(errors.mapped())
  	res.render('register', {errors: errors.mapped(), refresh: false});
  } else {
  	var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileimage: profileimage,
      isTutor: isTutor,
      isAvailable: isAvailable,
      isAdmin: isAdmin,
      hasApplied: hasApplied,
      room: room,
      isRequested: isRequested,
      cart: cart,
      minutes: minutes,
      tutorInUserState,
      accountId,
      sentRequest
    });

    User.createUser(newUser, function(err, user){
      if(err) {
      	throw err;
      } else {
  		console.log("User Successfully Created")
      	console.log(user);
      }
    });

    req.flash('success', 'You are now registered and can login');

    res.location('/');
    res.redirect('/');
  }
});

router.get('/logout', function(req, res) {
  db.collection('DefaultUser').update({_id: req.user._id}, {$set: {isAvailable: false}});
  req.logout();
  //req.flash('success', 'You are now logged out');
  res.redirect('/users/login');
  db.collection('DefaultUser').update({_id: req.user._id}, {$set: {room: ""}});
});

module.exports = router;
