require('dotenv').load();
var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var users = db.get('users');
var teams = db.get('teams');
var posts = db.get('posts');
var bcrypt = require('bcryptjs');



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
  users.findOne({_id:req.params.id},function(err,file){
    res.render('regteams',file)
  })
});

router.post('/:id/registerteams',function(req,res,next){
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
});

router.get('/:id',function(req,res,next){
  users.findOne({_id: req.params.id}, function(err,user){
    if(user.teams){
      teams.find({_id: {$in: user.teams}},function(err,teams){
        console.log("this is the teams ",teams.team_name)
        res.render('show',{user: user, teams: teams})
      })
    }else{
      res.render('show',user)
    }
  })
})




module.exports = router;
