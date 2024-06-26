var express = require('express');
var router = express.Router();
var mongoUtil = require('../mongoUtil');
var db = mongoUtil.getDb();
var socket = require('socket.io');
var cors = require('cors')
var re = require('request');
var header;
var stripe = require("stripe")("sk_test_KwJjUZ4JT3rUZNH4Z3xM8BNk00JWBD1N8C")



router.get('/', ensureAuthenticated, function(req, res, next) {
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	if(req.query != null) {
		if(req.query.code != null) {
			re.post({
			  url: 'https://connect.stripe.com/oauth/token',
			  formData: {
					code: req.query.code,
					grant_type: 'authorization_code'
			  },
				headers: {'Authorization': 'Bearer ' + process.env.STRIPE_API_SECRET}
			}, function(err, res, body) {
				console.log(body)
				var json = JSON.parse(body)
				console.log(json["stripe_user_id"])
				db.collection('DefaultUser').update({_id: req.user._id}, {$set: {accountId: json["stripe_user_id"]}})
			});
		}
	}
	res.render('home', { title: 'Home' });
} )



router.get('/test', ensureAuthenticated, function(req, res, next) {
	res.redirect('https://dashboard.stripe.com/express/oauth/authorize?response_type=code&client_id=ca_FdBNS4cY15CUcgYtW72ZJNlx011bISp5&scope=read_write&redirect_uri=http://localhost:6969/home');
});

router.post('/available', ensureAuthenticated, (req,res,next) => {
	//Give Tutor their own room
	var room = req.body.room
	db.collection('DefaultUser').update({_id: req.user._id}, {$set: {isAvailable:!req.user.isAvailable}});
	db.collection('DefaultUser').update({_id: req.user._id}, {$set: {tutorInUserState: !req.user.tutorInUserState}});
	db.collection('DefaultUser').update({_id: req.user._id}, {$set : {room: room}});
	res.redirect('../home');
})

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}

module.exports = router;
