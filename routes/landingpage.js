var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landingpage', { title: 'Landing Page' });
});


module.exports = router;
