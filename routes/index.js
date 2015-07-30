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
  if(req.session.email){ 
    res.render('index', { title: 'The Natural Language Stand-Up App', session: req.session.email, name: req.session.email});
  }else{
    res.render('index', { title: 'The Natural Language Stand-Up App' });
  }
});

router.get('/about', function(req,res,next){
  res.render('about',{ title: 'The Natural Language Stand-Up App' });
});

module.exports = router;
