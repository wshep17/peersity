var express = require('express');
var router = express.Router();
var mongoUtil = require('../mongoUtil');
var util = require('util')
var db = mongoUtil.getDb();
var userModel = require('../models/user');


//Socket Functionality Setup
var socket_io = require('socket.io');
var io = socket_io(); //instance of socket.io
router.io = io; //Ask Andre what this assignment means?

/* GET root page for tutor results page */
router.get('/', ensureAuthenticated, function(req, res, next) {
	  var io = res.locals['socketio']
	res.render('results')
});

router.post('/', ensureAuthenticated, (req,res,next) => {
	var room = req.body.room
	//console.log("inside the serverside of ajax")
	console.log("Tutor Username is " + req.body.tutorUserName)
	db.collection('DefaultUser').update({_id: req.user._id}, {$set : {room: room}});
	db.collection('DefaultUser').update({username: req.body.tutorUserName}, {$set : {isRequested: true}});
	res.redirect('../chat')
})



function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}

module.exports = router;
