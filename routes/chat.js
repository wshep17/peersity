var express = require('express');
var router = express.Router();
var socket = require('socket.io');
var mongoUtil = require('../mongoUtil');
var db = mongoUtil.getDb();
var userModel = require('../models/user');
require('dotenv').config();
var AccessToken = require('twilio').jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;
/* GET home page. */

//this is the chat page that shows history of all chats
router.get('/', ensureAuthenticated, function(req, res, next) {
  var io = res.locals['socketio']
 res.render('chat')
});

router.post('/', ensureAuthenticated, function(req, res) {
    db.collection('DefaultUser').update({name : req.user.name}, {$set : {room: "", isRequested: false}});
    res.redirect('../home')
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


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}

module.exports = router;
