var express = require('express');
var router = express.Router();
var mongoUtil = require('../mongoUtil');
var db = mongoUtil.getDb();
var userModel = require('../models/user');

//BrainTree Environment Configuration
var braintree = require('braintree');
var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "2fwbt6k9rtbkjgyy",
  publicKey: "v3gtnw82bth7pv3d",
  privateKey: "b18a96ff55abbfa4b1cc9160763818b7"
});

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
	gateway.clientToken.generate({}, (err, response) => {
		res.render('checkout', { token: response.clientToken })
	})
});


router.post('/', ensureAuthenticated, function(req, res, next) {
	var nonceFromTheClient = req.body.payment_method_nonce
	console.log(req.body)
	gateway.transaction.sale({
		amount: '10.00',
		paymentMethodNonce: nonceFromTheClient,
		options: {
			submitForSettlement: true
		}
	}, function (err, result) {
		if (err) {
			return err;
		}
	});
	req.flash('success', 'You are now subscribed to Peersity!')
	res.redirect('/home');
});

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}

module.exports = router;
