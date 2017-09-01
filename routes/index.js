var express = require('express');
var router = express.Router();
var signuplogin = require('./testSignupLogin') ;
var parseurl = require('parseurl')
var session = require('express-session')
var poll = require('./poll') ;

router.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

router.use(function (req, res, next) {
  if (!req.session.name) {
    req.session.name = " " ;
    username = req.session.name;
  }
  next()
})
var username = "" ;
/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(__dirname+'/views/index.html') ;
});
router.get('/login', function(req, res, next) {
    res.sendFile(__dirname+'/views/login.html');
}) ;
router.get('/signup', function(req, res, next) {
    res.sendFile(__dirname+'/views/signup.html') ;
});
router.get('/main.css', function(req, res, next) {
    res.sendFile(__dirname+'/views/main.css') ;
})
router.get('/successSignup', function(req, res, next) {
    res.sendFile(__dirname+'/views/successSignup.html') ;
});
router.get('/logout', function(req, res, next) {
    req.session.destroy(function(err) {
      res.redirect('/') ;
    })
});
router.get('/createPoll', function(req, res, next) {
    res.render(__dirname+'/views/createpoll', {title: req.session.name ,user: req.session.name})
    //res.end(req.session.name) ;
})
router.post('/successSignup', function(req, res, next) {
  signuplogin.processSignupForm(req, res) ;
}) ;

router.post('/dashboard', function(req, res, next) {
   signuplogin.processLoginForm(req, res) ;
})
router.post('/createPoll', function(req,  res, next) {
  poll.createPoll(req, res)  ;
})

module.exports = router;
