var express = require('express');
var router = express.Router();
var signuplogin = require('./testSignupLogin') ;

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
router.post('/successSignup', function(req, res, next) {
  signuplogin.processSignupForm(req, res) ;
}) ;

router.post('/dashboard', function(req, res, next) {
  signuplogin.processLoginForm(req, res) ;
})

module.exports = router;
