var formidable = require('formidable') ;
var mongo = require('mongodb').MongoClient ;
var dotenv = require('dotenv').config() ;
var mongourl = 'mongodb://'+process.env.DBUS+":"+process.env.DWORD+"@ds153113.mlab.com:53113/"+process.env.DBNAME
// this function processes the form for creating new polls
module.exports.createPoll = function (req, res) {
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
        var collection = db.collection('pollscreated') ;
        var options = fields.options.split(';') ;
        console.log(options) ;
        let objectpoll = {} ;
        objectpoll["title"] = fields.title.trim() ;
        objectpoll["Username"] = req.session.username.trim() ;
        objectpoll["options"] = fields.options.trim() ;
        var string = "" ;
        for(var i = 0 ; i<options.length ; i++) {
          objectpoll[options[i].trim()] = 0 ;
        }
        collection.insert(objectpoll) ;
        res.render(__dirname+"/views/dashboard", {title: "created a new poll", message: 'A new poll created!', user: req.session.name}) ;
        db.close() ;
      })
    });

    form.parse(req);
}

module.exports.viewPoll = function(req, res, title) {
  mongo.connect(mongourl, function(err, db) {
    var collection = db.collection('pollscreated') ;
    collection.find({"title": title}).toArray(function(err, docs) {
      if(err) {
        console.log('error') ;
        res.end('error') ;
        db.close() ;
      }
      req.session.polltitle = title ;
      req.session.polloptions = docs[0]["options"].split(';') ;
      req.session.options = docs[0]["options"] ;
      console.log(title) ;
      console.log(req.session.polloptions) ;
      res.end()
      db.close() ;
    })
  })
}

module.exports.updatePollResults = function(req, res, results) {
  let title1 = results["title"] ;
  let result = results["result"]+"" ;
  let newv = results["new"] ; // if new option has been added
  console.log("result is "+result) ;
  console.log("newv is "+newv) ;
  console.log(typeof(result)) ;
  mongo.connect(mongourl, function(err, db) {
    let collection = db.collection('pollscreated') ;
    if(newv==="false") {
      collection.update({"title" : title1}, {$inc: {[result]: 1}}, function(err, docs) {
        if(err) {
          console.log(err) ;
        }
        db.close() ;
      })
    }
    else {
      result = result.substring(0,result.length) ;
      var option = req.session.options+";"+result ;
      console.log(option) ;
      console.log(result) ;
      collection.update({"title": title1}, {$set: {[result]: 1, "options": option}}, function(err, docs) {
        if(err) {
          console.log(err) ;
        }
        else {
          req.session.options = option; 
        }
        db.close() ;
      })
    }
    db.close() ;
  })
  res.send("done !") ; ////////////////////////
}
