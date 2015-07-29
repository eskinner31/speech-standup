require('dotenv').load();
var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var users = db.get('users');
var teams = db.get('teams');
var posts = db.get('posts');
var bcrypt = require('bcryptjs');





module.exports = router;
