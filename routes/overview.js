var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('overview', { title: 'Overview Page' });
});


module.exports = router;
