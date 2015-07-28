require('dotenv').load();
var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var users = db.get('users');
var teams = db.get('teams');
var posts = db.get('posts');
var bcrypt = require('bcryptjs');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NLP Stand-UP' });
});

router.get('/about', function(req,res,next){
  res.render('about',{});
});

module.exports = router;
