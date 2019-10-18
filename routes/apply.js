/**
If the emailer still does not work, then one of us will have to do a COMPLETE rehaul
on the fiel structure so, that we can make it work.
*/

var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb')
var assert = require('assert')
var url = 'mongodb://localhost:27017/NoteLink'
var mongoUtil = require('../mongoUtil');
var db = mongoUtil.getDb();
var nodemailer = require('nodemailer');
var upload = require('express-fileupload');
router.use(upload())
var path = require('path');
var whichRoute;
/* GET home page. */
router.get('/', ensureAuthenticated, hasApplied, function (req, res, next) {
  //Andre, these commands might be of use, with the file path issue w/nodemailer
  //console.log(process.pwd()); //returns the directory that Node is executed from a
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  res.render('apply')
  //hello();
})


  //How to create your own functions
  function hello() {
    console.log('hello')
  }


router.post('/', ensureAuthenticated, function (req, res, next) {
  var file, filename;
  if (req.files) {

    file = req.files.transcript;
    filename = file.name;
    var ext = filename.substring(filename.length - 3, filename.length)
    var ext4 = filename.substring(filename.length - 4, filename.length)
    console.log(ext + " " + ext4)
    //file types we approved of..
    if( ext == "pdf" || ext == "doc" || ext4 == "docx") {


    var myPath = path.join(__dirname, '../upload/' + filename);
    file.mv(myPath, function(err) {
      if (err) {
        console.log(err)
      } else {
        console.log("Submitted")
      }
    })
    //Start of nodemailer
    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      secure: true,
      //auth is the sender
      auth: {
        user: 'notelinkverify@gmail.com',
        pass: 'dre&will'
      }
    });


    let mailOptions = {
      from: 'notelinkverify@gmail.com',
      to: 'notelinkverify@gmail.com',
      subject: 'Applying for Tutor',
      attachments: [{
        filename: filename,
        path: myPath
      }],
      text: 'Class request: ' + req.body.ApplyForClass + "\n"
            + 'Response: ' + req.body.Question + "\n"
            + 'Email: ' + req.body.Email + "\n"
    }
    console.log(mailOptions.attachments.path);
    console.log(__dirname);
    console.log(myPath)
    console.log()
      //To do #2: Create a function somewhere in this 'post'
      //that checks the validity of the email in the database, before sending it.
      //We do not want to receive emails from random people or people that are trolling.
      //If the reason why we need this feature is still unclear, call/text me.

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          return console.log(error);
        } else {
            console.log(info)
            db.collection('DefaultUser').update({_id: req.user._id}, {$set: {hasApplied: true}});
            res.redirect('/home')
        }

        // console.log('Message sent: %s', info.messageId);
        // console.log('file path? %s', req.body.transcript)
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      })
        // db.collection('DefaultUser').update({_id: req.user._id}, {$set: {hasApplied: true}});
    //END of nodemailer
    } else {
      res.render('apply', {message: "Incorrect File Type. Only submit pdf, doc, or docx."})
    }
  } else {
    res.render('apply', {message: "No file submitted. Please submit a pdf, doc, or docx file." })
  }


      req.flash('success', 'Tutor status: pending');


})

function ensureAuthenticated(req, res, next) {
//doing the checking on the client side works. Because everytime the page renders, it will run the ajax request and get the value
 if(req.isAuthenticated()){
  return next();
 }
 res.redirect('/users/login');
}

function hasApplied(req, res, next) {
//doing the checking on the client side works. Because everytime the page renders, it will run the ajax request and get the value
 if(req.user.hasApplied == false){
  return next();
 }
 res.redirect('/home');
}


module.exports = router;
