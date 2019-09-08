var express = require('express');
var router = express.Router();
var mongoUtil = require('../mongoUtil');
var db = mongoUtil.getDb();
var socket = require('socket.io');
var cors = require('cors')

/* GET root page for the home route. */
router.get('/', ensureAuthenticated, function(req, res, next) {
	res.render('home', { title: 'Home' });
});

router.get('/test', ensureAuthenticated, function(req, res, next) {
	res.redirect('https://dashboard.stripe.com/express/oauth/authorize?response_type=code&client_id=ca_FdBNS4cY15CUcgYtW72ZJNlx011bISp5&scope=read_write&redirect_uri=http://localhost:6969/home');
});

router.post('/available', ensureAuthenticated, (req,res,next) => {
	//Give Tutor their own room
	var room = parseInt(req.body.room)
	db.collection('DefaultUser').update({_id: req.user._id}, {$set: {isAvailable: true}});
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
