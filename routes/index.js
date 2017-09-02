var express = require('express');
var router = express.Router();
var signuplogin = require('./testSignupLogin') ;
var parseurl = require('parseurl')
var session = require('express-session')
var poll = require('./poll') ;
var mongo = require('mongodb').MongoClient ;
var dotenv = require('dotenv').config() ;
var mongourl = 'mongodb://'+process.env.DBUS+":"+process.env.DWORD+"@ds153113.mlab.com:53113/"+process.env.DBNAME
var bodyParser = require('body-parser') ;

router.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

router.use(function (req, res, next) {
  if (!req.session.name) {
    req.session.name = " " ;
    req.session.username = " ";
    req.session.polltitle = "title" ;
    req.session.polloptions = [] ;
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

// provides an api for the front end to get the list of available polls
router.get('/getPolls', function(req, res, next){
    mongo.connect(mongourl, function(err, db) {
      var collection = db.collection('pollscreated') ;
      collection.find().toArray(function(err, docs) {
        res.jsonp(docs) ;
        db.close() ;
      })
    }) ;
})

// this is called by front-end after posting the value of polltitle to poll.js
router.get('/viewPoll', function(req, res, next) {
  res.render(__dirname+"/views/viewpoll", {titlevalue: req.session.polltitle});
})
router.post('/successSignup', function(req, res, next) {
  signuplogin.processSignupForm(req, res) ;
}) ;

router.post('/dashboard', function(req, res, next) {
   signuplogin.processLoginForm(req, res) ;
})
// called from
router.post('/createPoll', function(req,  res, next) {
  poll.createPoll(req, res)  ;
});

// called from polllisthandler.js to show the viewpoll page.
router.post('/viewPoll', function(req, res, next) {
  console.log('received json is '+JSON.stringify(req.body)) ;
  var title1 = req.body["title"] ;
  poll.viewPoll(req, res, title1) ;
})

router.use(bodyParser.json()) ;
// called from viewpoll.pug after a user has voted. this is used to update the data on the polls.
router.post('/pollResult', function(req, res, next) {
  console.log('received json is '+JSON.stringify(req.body)) ;
})
module.exports = router;
