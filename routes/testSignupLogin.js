var formidable = require('formidable') ;
var mongo = require('mongodb').MongoClient ;
var dotenv = require('dotenv').config() ;
var mongourl = 'mongodb://'+process.env.DBUS+":"+process.env.DWORD+"@ds153113.mlab.com:53113/"+process.env.DBNAME

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
        var collection = db.collection('userforvoting') ;
        collection.insert({"name":fields.Name, "Username": fields.Username, "_id":fields.email, "password":fields.password}) ;
        res.send("done") ;
        db.close() ;
      })
    });

    form.parse(req);
}

module.exports.processLoginForm = function(req, res) {
  let fields = {} ;
  var form = new formidable.IncomingForm() ;
  form.on('field', function(field, value) {
    fields[field] = value.trim() ;
  });
  form.on('end', function() {
    mongo.connect(mongourl, function(err, db) {
      var collection = db.collection('userforvoting') ;
      var found = false ;
      collection.find({"Username": fields.Username}).toArray(function(err, docs) {
        if(err) {
          res.end("Some error occurred") ;
          db.close() ;
        }
        var password = fields.password ;
        console.log(docs[0]["name"])
        if(docs[0]["password"] === password) {
          found = true ;
          db.close() ;
          res.render(__dirname+"/views/dashboard", {title: 'Hey', message: 'Hello'+docs[0]["name"]}) ;
        }
        else {
          res.end("not found") ;
          db.close() ;
        }
      })
    })
  });

  form.parse(req) ;
}
