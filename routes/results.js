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
	res.render('results')
});

router.post('/', ensureAuthenticated, (req,res,next) => {
	//After Sending request assign tutoree to tutor's room in database
	db.collection('DefaultUser').update({_id: req.user._id}, {$set : {room: req.body.room}});
	db.collection('DefaultUser').update({_id: req.user._id}, {$set : {sentRequest: true}});

	//Tutor request updated in datase
	db.collection('DefaultUser').update({username: req.body.tutorUserName}, {$set : {isRequested: true}});
	db.collection('DefaultUser').update({username: req.body.tutorUserName}, {$set : {pseudoAvailable: true}});
	
	//Used to Craft the Notification
	db.collection('DefaultUser').update({username: req.body.tutorUserName}, {$set : {mailFrom: req.user.name}});
	db.collection('DefaultUser').update({username: req.body.tutorUserName}, {$set : {description: req.body.description}});
	db.collection('DefaultUser').update({username: req.body.tutorUserName}, {$set : {courseHelpReqst: req.body.courseHelpReqst}});
})

router.post('/reserve', ensureAuthenticated, (req,res,next) => {
	db.collection('DefaultUser').update({username: req.body.tutorUserName}, {$set : {pseudoAvailable: false}});
})

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect('/users/login');
}

module.exports = router;
