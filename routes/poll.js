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

        var string = "" ;
        for(var i = 0 ; i<options.length ; i++) {
          string+=options[i]+": 0," ;
        }
        collection.insert({"Username": req.session.username,"title":fields.title, "options": fields.options, string}) ;
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
      req.session.polloptions = docs ;
      console.log(title) ;
      console.log(docs) ;
      res.end() ;
      db.close() ;
    })
  })
}
