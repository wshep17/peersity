var express = require('express');
var router = express.Router();
/*var expressMongoDb = require('express-mongo-db');
router.use(expressMongoDb('mongodb://localhost:27017/NoteLink'));*/
var mongoUtil = require('../mongoUtil');
var db = mongoUtil.getDb();
var userModel = require('../models/user');

/*var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/NoteLink";
var db = require('../app.js');*/




//var db = require('../models/user');

/*var query = {course: 'CS 1331'};
db.collection('courses').find(query, function(err, result) {
	if (err) throw err;
	console.log(result);
})*/


/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
	res.render('search', {title: 'search'})
});

/*router.post('/', ensureAuthenticated, function(req,res,next) {
	var query = {course: 'CS 1301'}
	db.collection('courses').find(query).toArray((err, results) => {
		if (err) return console.log(err)
			console.log(results)
			res.render('search', {courses: results, title: 'search'})
		});
});*/

//Guaranteed Working post request.
/*router.post('/', ensureAuthenticated, function(req,res,next) {
	var query = {course: req.body.coursename};
	db.collection('courses').find(query).toArray((err, results) => {
		if (err) return console.log(err)
			res.render('search', {courses: results, title: 'search'})
			console.log(results);
		});
});*/

router.post('/', ensureAuthenticated, function(req,res,next) {
	var query = {course: req.body.coursename};
	db.collection('courses').find(query).count((err, results) => {
		if (err) {
			throw err;
		} 
		else {
			console.log(results)
			var cursor = db.collection('courses').find(query);
			//console.log(cursor);
			if (results === 0) {
				console.log('Class does not exist')
				res.render('search', {user: req.user, title: 'search'})
			} else if (results >= 0) {
				db.collection('DefaultUser').update({_id: req.user._id}, {
																$addToSet: {
																	classes: req.body.coursename
																}
															})
				res.render('search', {user: req.user, title: 'search'})
			}
		}
	})
});

/*router.get('/search', ensureAuthenticated, function(req, res) {
    var query = {$text: {$search: req.query.coursename, $language: 'en'}};
    console.log(query);
    var collection = db.collection(courses);
    collection.find({courses: "CS 1331"}).toArray(function(courses) {res.status(200).json(courses);})
    });*/


/*    Posts.find(query).toArray(function(err, posts) {
        if (err) return res.status(500).json({error: “Internal Server Error”});
        res.status(200).json(posts);
    });*/

/*router.post('/search', ensureAuthenticated, function(req, res, next) {
	var query = req.body.query;
	console.log(query);
	res.render('search', { title: 'search' });
});*/

/*search: function(req, res) {
	var query = {$text: {$search: req.query.course, $language: 'en'}};
	Course.find(query).toArray(function(err, course) {
})};*/

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}

module.exports = router;
