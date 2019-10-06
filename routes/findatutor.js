var express = require('express');
var router = express.Router();
var mongoUtil = require('../mongoUtil');
var db = mongoUtil.getDb();
var userModel = require('../models/user');

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('findatutor', { title: 'FindATutor' });
});

router.post('/', ensureAuthenticated, function(req, res, next) {
	db.collection('DefaultUser').update({_id: req.user._id}, {$set: {isAvailable: false}});
	var query = [
                   {
                     $match: {
                          $and: [
                              {isTutoring: {$in: [req.body.coursename]}},
                              {isTutor: true},
                              {isAvailable: true},
                              {isRequested: false}
                          ]
                     }
                   },
                  ]
	db.collection('DefaultUser').aggregate(query).toArray((err, results) => {
		if (err) {
			throw err;
		} else if (results.length > 0) {
			//console.log(results)
			res.render('results', {user: req.user, json: results, title: 'Results', count: results.length });
		} else {
			req.flash('error', 'Sorry, there are currently no available tutors for that class')
			//console.log(results)
			res.render('findatutor', {user: req.user, title: 'FindATutor'})
		}
	})
});



function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()){
    if(req.user.TutorInUserState == false) {
      res.redirect('/home')
    }
		return next();
	}
	res.redirect('/users/login');
}

module.exports = router;
