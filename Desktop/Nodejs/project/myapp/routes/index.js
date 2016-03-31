var express = require('express');
var myip = require('quick-local-ip');
var router = express.Router();

var path = require('path');
var mime = require('mime');

 var fs = require('fs');
 var url = require('url');
 var util = require('util');
 GLOBAL.underscore = require("underscore");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' , 'ip': myip.getLocalIP4()[0]});
});

router.get('/terminal', function(req, res, next){

    res.render('terminal.ejs');

});


// });

module.exports = router;
