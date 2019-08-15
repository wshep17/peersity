var express = require('express');
var router = express.Router();
var mongoUtil = require('../mongoUtil');
var db = mongoUtil.getDb();
var userModel = require('../models/user');
var app = require('../app')
var socket_io = require('socket.io');
var client = socket_io(); //instance of socket.io
app.io = client; //Ask Andre what this assignment means?

/* GET root page for tutor results page */
router.get('/', ensureAuthenticated, function(req, res, next) {
	res.render('requests')
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}

module.exports = router;