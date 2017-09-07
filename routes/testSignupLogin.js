var formidable = require('formidable') ;
var mongo = require('mongodb').MongoClient ;
var dotenv = require('dotenv').config() ;
var mongourl = 'mongodb://'+process.env.DBUS+":"+process.env.DWORD+"@ds153113.mlab.com:53113/"+process.env.DBNAME
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

module.exports.processSignupForm = function (req, res) {
    //Store the data from the fields in your data store.
    //The data store could be a file or database or any other store based
    //on your application.
    let fields = {};
    var form = new formidable.IncomingForm();
    form.on('field', function (field, value) {
        fields[field] = value.trim() ;
    });

    form.on('end', function () {
      mongo.connect(mongourl, function(err, db) {
        let collection = db.collection('userforvoting') ;
        collection.find({"_id":fields.email}).toArray(function(err, docs) {
          if(docs.length<1) {
            collection.insert({"name":fields.Name, "Username": fields.Username, "_id":fields.email, "password":fields.password}) ;
            res.redirect('successSignup') ;
            db.close() ;
          }
          else {
            res.render(__dirname+'/views/signup', {message: "This email has already been used"})
            db.close() ;
          }
        })
      })
      //////////
    });
    form.parse(req);
}

function testIfUserExists(id) {
  mongo.connect(mongourl, function(err, db) {
    let collection = db.collection('userforvoting') ;
    collection.find({"_id": id}).toArray(function(err, docs) {
      if(err || docs.length>0) {
        console.log("called to test") ;
        return true ;
      }
      db.close() ;
    })
  })
  return false ;
}
module.exports.processLoginForm = function(req, res) {
  let fields = {} ;
  var form = new formidable.IncomingForm() ;
  form.on('field', function(field, value) {
    fields[field] = value.trim() ;
  });
  form.on('end', function() {
    mongo.connect(mongourl, function(err, db) {
      // for finding the user information for login
      collection = db.collection('userforvoting') ;
      // finding the user name exists or not
      collection.find({"Username": fields.Username}).toArray(function(err, docs) {
        if(err || docs[0]===undefined) {
          req.session.destroy(function(err) { // after logout, destroy session
            res.render(__dirname+'/views/login', {message: "The user does not exist"}) ;
          })
          db.close() ;
        }
        else {
          // matching the password
          var password = fields.password ;
          if(docs[0]["password"] === password) {
            req.session.name = docs[0]["name"] ;
            req.session.username = fields.Username ;
            db.close() ;
            req.session.usertype = "authorized" ;
            res.render(__dirname+"/views/dashboard", {title: docs[0]["name"], message:" ", user: docs[0]["name"]}) ;
          }
          else {
            res.render(__dirname+'/views/login', {message: "Wrong password "}) ;
            db.close() ;
          }
        }

      })
    })
  });

  form.parse(req) ;
}
