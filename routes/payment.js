var express = require('express');
var router = express.Router();
var stripe = require('stripe')('sk_test_ARy8kmpOguTofYysso7KGjqk00AwEdavtp');
var mongoUtil = require('../mongoUtil');
var db = mongoUtil.getDb();
var transaction;
var minutes;

//Renders the home page
router.get('/', ensureAuthenticated, function(req, res, next) {
	console.log("This user has " + req.user.minutes + " minutes");
	res.render('payment')
});

//Makes a purchase
router.post('/', ensureAuthenticated, function(req, res, next) {
	var error = "Make sure you enter an amount to pay"
	var token = req.body.token;
	var userMinutes = req.user.minutes;
	console.log("The token is " + token.id);
	stripe.charges.create({
	    amount: transaction,
	    currency: 'usd',
	    description: 'Peersity Charge',
	    source: token.id,
		}, function(err, result) {
			if (err) {
				console.log("The error was " + err)
			} else {
				console.log("The result is " + result)
				userMinutes += minutes;
				db.collection('DefaultUser').update({_id: req.user._id}, {$set: {minutes: parseInt(userMinutes)}});
			}
		})
	res.render('payment')
});

//Add minutes to cart
router.post('/market', ensureAuthenticated, function(req, res, next) {
	console.log("Preparing to add " + req.body.time + " min(s) to the cart")
	minutes = parseInt(req.body.time) //store selected minutes
	transaction = req.body.transaction_price;
	db.collection('DefaultUser').update({_id: req.user._id}, {$set: {cart: parseInt(req.body.time)}});
	res.render('payment')
});

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect('/users/login');
}

module.exports = router;
