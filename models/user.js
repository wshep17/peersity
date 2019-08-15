//We utilize Mongoose to create schemas for our database(MongoDB), via Javascript

var mongoose = require('mongoose'); //implements mongoose
var bcrypt = require('bcryptjs');//implements encryption "interface"


mongoose.connect('mongodb://localhost/NoteLink');

var db = mongoose.connection;

//User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	profileimage: {
		type: String
	},
	isTutor : {
		type: Boolean
	},
	isAvailable: {
		type: Boolean
	}, isAdmin: {
		type: Boolean
	}, hasApplied: {
		type: Boolean
	}, room: {
		type: String
	}, isRequested: {
		type: Boolean
	}, 
},
{collection: 'DefaultUser'});

//1. User is the name of our object
//2. module.exports allows us to use this object outside of this file
//3. Pass in the model name, which is 'User'
//4. Pass in the UserSchema variable.

var User = module.exports = mongoose.model('User', UserSchema);

//for serialization -> deserialization & vice versa purposes
module.exports.getUserById = function(id, callback) {
	User.findById(id, callback);
}

//used when logging for authentication purposes
module.exports.getUserByUsername = function(username, callback) {
	var query = {username: username};
	User.findOne(query, callback);
}


module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	callback(null, isMatch);
	});
}

//1. Create a function that can be used anywhere, called
//2. Takes in a newUser as well as a callback
module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) { //Pass in newUser.password to be hashed
    	bcrypt.hash(newUser.password, salt, function(err, hash) {
   			newUser.password = hash; //1. Hash Password First
   			newUser.save(callback); //2. Then saved
    	});
	});
}
