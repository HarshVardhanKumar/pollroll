var formidable = require('formidable') ;
var mongo = require('mongodb').MongoClient ;
var dotenv = require('dotenv').config() ;
var mongourl = 'mongodb://'+process.env.DBUS+":"+process.env.DWORD+"@ds153113.mlab.com:53113/"+process.env.DBNAME

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
        collection.insert({"title":fields.title, "options": fields.options}) ;
        res.render(__dirname+"/views/dashboard", {title: "created a new poll", message: 'A new poll created!', user: req.session.name}) ;
        db.close() ;
      })
    });

    form.parse(req);
}
