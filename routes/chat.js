var express = require('express');
var router = express.Router();
var socket = require('socket.io');
var mongoUtil = require('../mongoUtil');
var db = mongoUtil.getDb();
var userModel = require('../models/user');
require('dotenv').config();
var AccessToken = require('twilio').jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;
const stripe = require("stripe")("sk_test_KwJjUZ4JT3rUZNH4Z3xM8BNk00JWBD1N8C")

/* GET home page. */

//this is the chat page that shows history of all chats
router.get('/', ensureAuthenticated, function(req, res, next) {
  var io = res.locals['socketio']
 res.render('chat')
});

router.post('/', ensureAuthenticated, function(req, res) {
  console.log(req.body.minutes);
    if (!req.user.tutorInUserState) {
      var amount = Math.trunc(25 * .8 * (req.body.minutes));
      stripe.transfers.create({
    	  amount: amount,
    	  currency: "usd",
    	  destination: req.user.accountId,
    	  transfer_group: "tutor"
    	}, function(err, transfer) {
    	  // asynchronously called
    	});
    }
    if (!req.user.tutorInUserState) {
      db.collection('DefaultUser').update({_id : req.user._id}, {$set : {room: "", isRequested: false, isAvailable: false, pseudoAvailable: true}});
    } else {
      db.collection('DefaultUser').update({_id: req.user._id}, {$set: {minutes: req.user.minutes - req.body.minutes}})
      db.collection('DefaultUser').update({_id : req.user._id}, {$set : {room: "", sentRequest: false}});
    }
})

router.get('/token', function(request, response) {
  // Create an access token which we will sign and return to the client,
  // containing the grant we just created.
  var token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET
  );
  // Assign the generated identity to the token.
  token.identity = request.user.name;
  // Grant the access token Twilio Video capabilities.
  var grant = new VideoGrant();
  token.addGrant(grant);
  // Serialize the token to a JWT string and include it in a JSON response.

  response.send({
    identity: request.user.name,
    roomNumber: request.user.room,
    token: token.toJwt()
  });
});

router.get('/getUserInfo', function(req, res, next) {
  res.send({userInfo: req.user})
})

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}

module.exports = router;
