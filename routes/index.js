var express = require('express');
const userModel = require("./users")
const passport = require('passport');
var router = express.Router();
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));


router.get('/',function(req,res){
  res.render("index");
})

router.get('/profile',isLoggedIn,function(req,res){
  res.send("welcome to profile!");
})

router.post('/register',function(req,res){
  var userData= new userModel({
    username:req.body.username,
    secret:req.body.secret
  });

  userModel.register(userData,req.body.password).then(function(registereduser){
    passport.authenticate("local")(req,res,function(){
      res.redirect('/profile');
    })
  })
})


router.post('/login',passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/"
}),function(req,res){});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/")
}

// app.get('/logout',function(req,res,next){
//   req.logout(function(err){
//     if(err){return next(err); }
//     res.redirect("/");
//   })
// });

module.exports = router;
