var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb')
var assert = require('assert')

var url = 'mongodb://localhost:27017/NoteLink'
var mongoUtil = require('../mongoUtil');
var db = mongoUtil.getDb();

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('admin', {title: 'Control Panel'})
});

//add class to tutor profile(search for user, then class
//and then update that user with that class)
router.post('/success', ensureAuthenticated, function(req, res, next) {
  var applicantQuery = {email: req.body.applicant};
  var query = {course: req.body.coursename};
  db.collection('DefaultUser').find(applicantQuery).toArray((err, results) => {
    if (err) {
      throw err;
    } else if (results.length === 0) {
      req.flash('error', 'Applicant Email not found')
      console.log('Applicant Email not found')
      res.redirect('/admin');
    } else if (results.length > 0) {
      console.log(results);
      db.collection('courses').find(query).count((err, results) => {
        if (err) {
          throw err;
        } 
        else {
          console.log(results)
          var cursor = db.collection('courses').find(query);
          if (results === 0) {
            req.flash('error', 'Class does not exist')
            console.log('Class does not exist')
            res.render('admin', {user: req.user})
          } else if (results > 0) {
            req.flash('success', 'User Updated Successfully')
            db.collection('DefaultUser').update({email: req.body.applicant}, {$addToSet: {isTutoring: req.body.coursename}, $set: {isTutor: true}});
            res.redirect('/admin');
          }
        }
      })
    }
  })
});

router.post('/decline', ensureAuthenticated, (req, res, next) => {
  var declineQuery = {email: req.body.DeclineApplicant};
  db.collection('DefaultUser').find(declineQuery).count((err,result) => {
    if (err) {
      throw err;
    } else if (result === 0) {
      req.flash('error', 'Email does not exist')
      console.log('Email does not exist')
      res.redirect('/admin');
    } else if (result > 0) {
      req.flash('success', 'User de-activated successfully')
      db.collection('DefaultUser').update(declineQuery, {$set: {isTutor: false}})
      res.redirect('/admin');
    }
  })
})


router.post('/reactivate', ensureAuthenticated, (req, res, next) => {
  var activateQuery = {email: req.body.ReactivateApplicant};
  db.collection('DefaultUser').find(activateQuery).count((err,result) => {
    if (err) {
      throw err;
    } else if (result === 0) {
      req.flash('error', 'Email does not exist')
      console.log('Emails does not exist')
      res.redirect('/admin');
    } else if (result > 0) {
      req.flash('success', 'User activated successfully')
      db.collection('DefaultUser').update(activateQuery, {$set: {isTutor: true}})
      res.redirect('/admin');
    }
  })
})


//Unique Authentication for the admin user
function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated() && req.user.isAdmin) {
		return next();
	}
	res.redirect('home');
}

module.exports = router;
