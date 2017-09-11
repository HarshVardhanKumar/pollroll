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
router.use(bodyParser.json()) ; // useful for parsing the ajax post data
router.use(function (req, res, next) {
  if (!req.session.name) {
    req.session.name = " " ; // used for rendering dashboard.pug
    req.session.username = " ";
    req.session.polltitle = "title" ; // used for rendering the viewpoll.pug
    req.session.polloptions = [] ;// used for rendering the viewpoll.pug
    req.session.options = " " ;
    req.session.pollcreater = " " ;// called in viewPoll.pug to show who created the poll.
    req.session.usertype = "unauthorized" ; // distinguishes between the requests of an authorized and unauthorized users.
  }
  next()
})
var username = "" ;
/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(__dirname+'/views/index.html') ;
});
router.get('/login', function(req, res, next) {
  req.session.destroy(function(err) {
    res.render(__dirname+'/views/login', {message: " "})
  })
}) ;
router.get('/signup', function(req, res, next) {
    res.render(__dirname+'/views/signup', {message: " "}) ;
});
router.get('/main.css', function(req, res, next) {
    res.sendFile(__dirname+'/views/main.css') ;
})
router.get('/successSignup', function(req, res, next) {
    res.sendFile(__dirname+'/views/successSignup.html') ;
});
router.get('/logout', function(req, res, next) {
    req.session.destroy(function(err) { // after logout, destroy session
      res.redirect('/') ;
    })
});
router.get('/createPoll', function(req, res, next) {
    res.render(__dirname+'/views/createpoll', {title: req.session.name ,user: req.session.name})
    // used to create a new poll by a loggedin user
})
router.get('/dashboard', function(req, res, next) {
  if(req.session.usertype==="authorized")
    res.render(__dirname+"/views/dashboard", {title: 'dashboard', message:" ", user: req.session.username}) ;
  else res.redirect('udashboard') ;
})
router.get('/poll/dashboard', function(req, res, next) {
  res.redirect(process.env.baseurl) ;
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
});
// this is called by front-end after posting the value of polltitle to poll.js
router.get('/viewPoll', function(req, res, next) {
  res.render(__dirname+"/views/viewpoll", {titlevalue: req.session.polltitle,user: req.session.username, docs: req.session.polloptions, pollcreater: req.session.pollcreater});
});
// provides the logo image
router.get('/logo.png', function(req, res, next) {
    res.sendFile(__dirname+'/views/logo.png') ;
})
router.get('/logo.jpg', function(req, res) {
    res.sendFile(__dirname+'/views/logo.jpg') ;
})
// provides an api for the front-end to get the list of available polls created by a user.
router.get('/myPolls', function(req, res, next) {
  mongo.connect(mongourl, function(err, db) {
    let collection = db.collection('pollscreated') ;
    collection.find({"Username":req.session.username}).toArray(function(err, docs) {
      res.jsonp(docs) ;
      db.close() ;
    })
  })
})
// this is used to get the results of a poll
router.get('/getResults/:titleofpoll', function(req, res, next) {
  let title = req.params.titleofpoll ;
  poll.getPollResultDetails(req,res,title) ;
})
router.get('/poll/getResults/:titleofpoll', function(req, res, next) {
  let title = req.params.titleofpoll ;
  poll.getPollResultDetails(req, res, title) ;
})
router.get('/showMyPolls', function(req, res, next) {
  res.render(__dirname+'/views/mypolls', {user: req.session.username, message: " "}) ;
})
// serves the dashboard for unauthorized
router.get('/udashboard', function(req, res) {
  res.render(__dirname+"/views/udashboard") ;
})
// for directly accessing the polls through a unique link
router.get('/poll/:polltitle', function(req, res) {
  var polltitle = req.params.polltitle ;
  while(polltitle.indexOf('_')!=-1) {
    polltitle = polltitle.replace("_", " ") ;
  }
  poll.processRequestForPolls(req,res,polltitle) ;
})
router.get('/svg/:svgname', function(req, res) {
  var name = req.params.svgname ;
  console.log(name) ;
  res.sendFile(__dirname+'/views/svg/'+name) ;
})
// called after the verification of signup form
router.post('/successSignup', function(req, res, next) {
  signuplogin.processSignupForm(req, res) ; // creates a new user in the database
}) ;

// called after the verification of login form. The method called verifies if the user exists or not.
router.post('/dashboard', function(req, res, next) {
   signuplogin.processLoginForm(req, res) ;
})

// called from dashboard. Used to process the poll information
router.post('/createPoll', function(req,  res, next) {
  poll.createPoll(req, res)  ;
});

// called from polllisthandler.js to show the viewpoll page.
router.post('/viewPoll', function(req, res, next) {
  console.log('received json is '+JSON.stringify(req.body)) ;
  var title1 = req.body["title"] ;
  poll.viewPoll(req, res, title1) ;
})

// called from viewpoll.pug after a user has voted. this is used to update the data on the polls.
router.post('/pollResult', function(req, res, next) {
  console.log('received json is '+JSON.stringify(req.body)) ;
});

router.post('/receiveResults', function(req, res, next) {
  console.log("received results is "+JSON.stringify(req.body)) ;
  poll.updatePollResults(req, res, req.body) ;
});
router.post('/poll/receiveResults', function(req, res, next) {
  res.redirect('/receiveResults') ;
})
router.post('/poll/poll/receiveResults',function(req,res){
  res.redirect('/poll/receiveResults');
  });
// for deleting the polls by verified user

router.post('/delete/:polltitle', function(req, res) {
  let polltitle = req.params.polltitle ;
  while(polltitle.indexOf('_')!=-1) {
    polltitle = polltitle.replace("_", " ") ;
  }
  poll.deletePoll(req, res, polltitle)  ;
})
module.exports = router;
