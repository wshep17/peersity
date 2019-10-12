var express = require('express');
var router = express.Router();
var mongoUtil = require('../mongoUtil');
var db = mongoUtil.getDb();
var socket = require('socket.io');
var cors = require('cors')
var re = require('request');
var header;
var stripe = require("stripe")("sk_test_KwJjUZ4JT3rUZNH4Z3xM8BNk00JWBD1N8C")
/**
TODO: Figure out how to make a post request to the url, passing in the authorization code.
	  We should be able to obtain the account ID, but I wasn't able to retrieve it. Instead
	  I got some long json pertaining to the post request I made, but NOT the response.
	  Helpful Link: https://stripe.com/docs/connect/standard-accounts#token-request
*/

router.get('/', ensureAuthenticated, function(req, res, next) {
	res.render('home', { title: 'Home' });
})



router.get('/test', ensureAuthenticated, function(req, res, next) {
	res.redirect('https://dashboard.stripe.com/express/oauth/authorize?response_type=code&client_id=ca_Fd4RNlLyzXFDVNvZSmI5cSSRyZ4LDSuN&scope=read_write&redirect_uri=http://localhost:6969/home');
});

router.post('/available', ensureAuthenticated, (req,res,next) => {
	//Give Tutor their own room
	if(req.user.tutorInUserState == false) {
		var room = parseInt(req.body.room)
		db.collection('DefaultUser').update({_id: req.user._id}, {$set: {isAvailable:!req.user.isAvailable}});
		db.collection('DefaultUser').update({_id: req.user._id}, {$set : {room: room}});
	}

	res.redirect('../home');
})

router.post('/settingToUser', ensureAuthenticated, (req, res, next) => {
	if(req.user.isAvailable == false) {
		db.collection('DefaultUser').update({_id: req.user._id}, {$set: {tutorInUserState: true}});
	}
})
router.post('/settingToTutor', ensureAuthenticated, (req, res, next) => {
	if(req.user.sentRequest == false) {
		db.collection('DefaultUser').update({_id: req.user._id}, {$set: {tutorInUserState: false}});
	}

})
// router.post('/credentials', ensureAuthenticated, function(req, res, next) {

// })


function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}

module.exports = router;
