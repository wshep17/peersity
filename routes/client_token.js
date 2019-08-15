var express = require('express');
var router = express.Router();
var mongoUtil = require('../mongoUtil');
var db = mongoUtil.getDb();
var userModel = require('../models/user');

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('checkout', { title: 'CheckOut' });
});

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}

module.exports = router;
