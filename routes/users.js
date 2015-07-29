require('dotenv').load();
var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var users = db.get('users');
var teams = db.get('teams');
var posts = db.get('posts');
var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport();



//WHEN A SESSION IS ACTIVE BE SURE TO HAVE REDIRECTS TO THE SHOW PAGE
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login',function(req,res,next) {
  res.render('login',{});
});

router.post('/login',function(req,res,next){
  users.findOne({email:req.body.email},function(err,user){
    if(err){
      return err;
    }
    else if(bcrypt.compareSync(req.body.password,user.password)){
      req.session.email = req.body.email;
      console.log(user._id);
      res.redirect('/users/'+user._id);
    }else{
      res.redirect('/');
    }
  })
})

router.get('/register',function(req,res,next){
  req.session = null;
  res.render('register',{});
})

router.post('/register',function(req,res,next){
  var errors = [];
  if(!req.body.email){
    errors.push("Email can't be blank")
  }
  if(!req.body.password){
    errors.push("Password can't be blank")
  }
  if(errors.length){
    res.render('/register',{errors:errors})
  }else{
    users.find({email: req.body.email}, function(err,file){
      if(file.length === 0){
        req.body.password = bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10))
        users.insert(req.body, function(err,file){
          if(err){
            return err
          }
          else{
            req.session.id = file._id
            res.redirect('/');
          }
        })
      }
    })
  }
});

router.get('/logout', function(req,res,next){
  req.session = null;
  res.redirect('/');
});

router.get('/:id/registerteams',function(req,res,next){
  if(req.session.email){
    users.findOne({_id:req.params.id},function(err,file){
      res.render('regteams',file)
    })
  }else{
    res.redirect('/');
  }
});

router.post('/:id/registerteams',function(req,res,next){
  if(req.session.email){
    req.body.team_emails = req.body.team_emails.split(',');
    teams.insert(req.body, function(err,team){
      if(err){
        return err
      }else{
        users.update({_id:req.params.id},{$push:{teams: team._id}},function(err,user){
          if(err){
            return err
          }else{
            res.redirect('/users/'+req.params.id)
          }
        })
      }
    })
  }else{
    res.redirect('/')
  }
});

router.get('/:id/new',function(req,res,next){
  if(req.session.email){
    users.findOne({_id:req.params.id},function(err,user){
      teams.find({_id: {$in: user.teams}}, function (err,teams){
        user.teams = teams;
        res.render('standupapp',user)
      })
    })
  }else{
    res.redirect('/')
  }
})

router.post('/:id/new',function(req,res,next){
  if(req.session.email){
    console.log(req.body.teams)
    teams.findOne({team_name: req.body.teams},function(err,team){
      console.log(team)
      transporter.sendMail({
          from: 'standupapp@standup.com',
          to: team.team_emails,
          subject: req.body.name,
          html: '<table><tr><th>Helps</th><th>Interesting</th><th>Events</th></tr><tr><td>'+req.body.help+'</td><td>'+req.body.interesting+'</td><td>'+req.body.events+'</td></tr></table>'
      });
      posts.insert({name: req.body.name, help: req.body.help, interesting: req.body.interesting, events: req.body.events}, function(err, post){
        if(err){
          return err
        }else{
          users.update({_id:req.params.id},{$push:{posts: post._id}},function(err,user){
            if(err){
              return err
            }else{
              res.redirect('/users/'+req.params.id)
            }
          })
        }
      })
    })
  }else{
    res.redirect('/')
  }
});

router.get('/:id',function(req,res,next){
  if(req.session.email){
    users.findOne({_id: req.params.id}, function a(err,user){
      teams.find({_id: {$in: user.teams}},function b(err,teams){
        user.teams = teams;
        posts.find({_id: {$in: user.posts}}, function c(err,posts){
          user.posts = posts;
          res.render('show', user)
        })
      })
    })
  }else{
    res.redirect('/')
  }
});




module.exports = router;
