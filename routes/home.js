var express = require('express');
var router = express.Router();
var mongoUtil = require('../mongoUtil');
var db = mongoUtil.getDb();
var socket = require('socket.io');
var cors = require('cors')
var request = require('request');
var header;

/* GET root page for the home route. */
router.get('/', ensureAuthenticated, function(req, res, next) {
	header = req.param('code');
	if (header) {
	    var data = {
		  'client_secret': 'sk_test_Tfi92VcscIR3G8fqFWxxBsIu00Y7QAmHNW',
		  'code': header,
		  'grant_type': 'authorization_code'
		}
		request.post('https://connect.stripe.com/oauth/token', data=data, function(response) {
			console.log(response)
		})
	}
	
	res.render('home', { title: 'Home' });
});

router.post('/oauthComplete', ensureAuthenticated, function (req, res, next) {

	res.render('home');
})

router.get('/test', ensureAuthenticated, function(req, res, next) {
	res.redirect('https://dashboard.stripe.com/express/oauth/authorize?response_type=code&client_id=ca_Fd4RNlLyzXFDVNvZSmI5cSSRyZ4LDSuN&scope=read_write&redirect_uri=http://localhost:6969/oauthComplete');
});

router.post('/available', ensureAuthenticated, (req,res,next) => {
	//Give Tutor their own room
	var room = parseInt(req.body.room)
	db.collection('DefaultUser').update({_id: req.user._id}, {$set: {isAvailable: true}});
	db.collection('DefaultUser').update({_id: req.user._id}, {$set : {room: room}});
	res.redirect('../home');
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
