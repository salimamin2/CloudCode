var express = require('express');
var myip = require('quick-local-ip');
var router = express.Router();

var path = require('path');
var mime = require('mime');

var fs = require('fs');
var url = require('url');
var util = require('util');
GLOBAL.underscore = require("underscore");
var spawn = require('child_process').spawn;
var session = require('express-session');
var exec = require('child_process').exec;

var exec = require('child_process').exec;

var bin, args, cspr;
var c_name;
global.param = '';
pay=[];
cnt=0;

var target = global.myData;


 
var ctnrpath = '';

var dirsJson = [];
var count=2;
var traverseFileSystem = function (currentPath, subpath) {
    //var filesJson = [];
    if(subpath == ""){
      count=2;
    }
    //dirsJson.push({"path":currentPath});
    currentPath = currentPath+subpath;
    //console.log(currentPath);
    var files = fs.readdirSync(currentPath);
    
    for (var i in files) {
        var currentFile = files[i];


        var stats = fs.statSync(currentPath + '/' + currentFile);
        //if (stats.isFile()) {
          //filesJson.push({"file":currentFile});
          //console.log("File -      "+currentFile);
        //}else if (stats.isDirectory()) {
          //traverseFileSystem(currentFile);
        if(currentFile.substr(0, 1) != "."){
      dirsJson.push({
        "id":(count++)+"", 
        "text":currentFile, 
        "state": stats.isFile()?"open":"closed", 
        "attributes":{
          "path":subpath
        }
      });
        }
    }

    if(subpath == ""){

      var arr = currentPath.split("/");
      //console.log(arr[arr.length - 1]);

    dirsJson = [{
        "id":1,
        "text":arr[arr.length - 1],
        "state":"open",
        "children": dirsJson, 
        "attributes":{
        "path":""
      }
      }]
    }
};

router.post('/ajax', function(req, res, next){

      global.param = req.param('username');
      c_name = global.param;
      //req.session.name = param;
      console.log(global.param);
      //alert(param);
      res.send(global.param);

});

router.post('/terminal', function(req, res, next){
var io = global.socketIO;
    //var cntr_IP;
    var terminal = require('child_process').spawn('bash');

      terminal.stdout.on('data', function (data) {
          console.log('stdout: ' + data);
          //console.log(data);
        var buff = new Buffer(data);
         pay.push({data:buff.toString('utf8')});
          var transform = buff.toString('utf8')
          var data_array = transform.split('::');
            if(data_array[0] == 'info'){
            global.cntr_IP = data_array[1];
            
            console.log(global.cntr_IP);
          }
         

          io.sockets.connected[req.body.socketid];
          io.sockets.emit('echo', { echo: global.cntr_IP});

          
      });

      terminal.on('exit', function (code) {
          console.log('child process exited with code ' + code);
      });

      setTimeout(function() {
         // console.log('Sending stdin to terminal');
          terminal.stdin.write('sudo ~/Desktop/Nodejs/project/myapp/bash.sh ' +c_name);
          // console.log('Ending terminal session');
          terminal.stdin.end();
      }, 1500);
      // var param = req.param('username');

      // // filter data by search param
      // console.log(JSON.stringify(param));
      // global.uname = JSON.stringify(param);
      // // res.send(JSON.stringify(param));

  res.send(global.cntr_IP);
  // if (buff == data) {
  //   return res.send("Transferred");
  // } else {
  //   return res.render('terminal.ejs');
  // };
    // res.render('terminal.ejs', {
    //     title: 'Express' , 'ip': myip.getLocalIP4()[0]});
});


router.get('/terminal', function(req, res, next){

    res.render('terminal.ejs');

});

router.get('/read', function(req, res, next) {
  //console.log(req.query);
  //res.writeHead(200, {"Content-Type": "text/plain"});
  console.log("path : "+ctnrpath+req.query.name);
  var content = fs.readFileSync(ctnrpath+"/"+req.query.name,'utf8')
  console.log("File "+req.query.name+ " Loaded ....");
  res.end(content);
});

router.post('/write', function(req, res, next) {
  //console.log(req.query);
  filename=req.body.name;
  data=req.body.data;
  res.writeHead(200, {"Content-Type": "text/plain"});
  //console.log("Starting..."); 
  var contents = fs.writeFileSync(ctnrpath+"/"+filename, data);
  console.log("File "+req.body.name+ " Saved ....");
  //console.log(contents);
  res.end("saved");  
});


router.post('/new', function(req, res, next) {
  //console.log(req.query);
  filename=req.body.name;
  data="void main() {}";
  res.writeHead(200, {"Content-Type": "text/plain"});
  //console.log("Starting..."); 
  var contents = fs.writeFileSync(ctnrpath+"/"+filename, data);
  console.log("File "+ filename + " Saved ....");
  //console.log(contents);
  res.end(contents);  
});

router.post('/clear', function(req, res, next) {
  //console.log(req.query);
  filename=req.body.name;
  data=req.body.data;
  res.writeHead(200, {"Content-Type": "text/plain"});
  //console.log("Starting..."); 
  var contents = fs.writeFileSync(ctnrpath+"/"+filename, " ")
  //var contents = fs.writeFileSync(ctnrpath+"/"+filename);
 
  console.log("File "+ filename + " Cleared ....");
  //console.log(contents);
  res.send(contents.clear());  
});


router.get('/download', function(req, res){ // this routes all types of file
  // data=req.body.data;
  // filename=req.body.name;
  // var query = url.parse(req.url, true).query;
     
  //   if (typeof query.file === 'undefined') {
  //       //specify Content will be an attachment
  //       res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  //       res.setHeader('Content-type', 'text/plain');
  //       res.end("Hello, here is a file for you!");
  //   } else {
  //       //read the image using fs and send the image content back in the response
  //       fs.readFile(ctnrpath + query.file, function (err, content) {
  //           if (err) {
  //               res.writeHead(400, {'Content-type':'text/html'})
  //               console.log(err);
  //               res.end("No such file");    
  //           } else {
  //               //specify Content will be an attachment
  //               res.setHeader('Content-disposition', 'attachment; filename='+query.file);
  //               res.end(content);
  //           }
  //       });
  //   }
  //var file = __dirname + '/upload-folder/dramaticpenguin.MOV';
  filename=req.body.name;
  data=req.body.data;
  res.writeHead(200, {"Content-Type": "text/plain"});
  //console.log("Starting..."); 
  var contents = fs.readFileSync(ctnrpath+"/"+filename, data)
  //var contents = fs.writeFileSync(ctnrpath+"/"+filename);
 
  console.log("File "+ req.body.name + " Cleared ....");

  // var path=require('path');

  // var file = req.params.filename;

  // var path = path.resolve(ctnrpath)+file;
  res.send(contents)
  res.download(contents); // magic of download fuction

  });

// router.post('/new', function(req, res, next) {
//   filename= "New File";
//   fs.writeFile(filename, 'Hello World!', function (err) {
//     if (err) return console.log(err);
//     console.log('Hello World > filename');
//   });
//   res.end("Done");
// });

/* GET home page. */
router.get('/files', function(req, res, next) {
  dirsJson = [];
  ctnrpath = '/var/lib/lxc/'+global.param+'/rootfs/home/ubuntu';
  //console.log(req.query.filename);
  traverseFileSystem(ctnrpath, req.query.filename)
  //console.log(dirsJson.length);
  res.json(dirsJson);
});

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' , 'ip': myip.getLocalIP4()[0]});
// });



// const ls = spawn('ls', ['-lh', '/usr']);

// ls.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`);
// });

// ls.stderr.on('data', (data) => {
//   console.log(`stderr: ${data}`);
// });

// ls.on('close', (code) => {
//   console.log(`child process exited with code ${code}`);
// });

// router.post('/', function(req, res){ 
//     myText = req.query.username; //mytext is the name of your input box
//     var fileText = fs.writeFile("./test", myText , function(err) {
//     if(err) {
//         return console.log(err);
//     }

//     console.log("The file was saved!");
// }); 
//     res.send('Your Text:' +myText); 
// // }); 
// router.get('/', function(req, res, next){
//         res.render('index.ejs');
          
//     });
      
  // child = exec('sudo ~/./samplebash.sh ubuntutest2', // command line argument directly in string
  //   function (error, stdout, stderr) {
  //     console.log('stdout:' + stdout);
  //      console.log('stderr: ' + stderr);
  //      if (error !== null) {
  //        //console.log('exec error: ' + error);
  //      }

      


  // var child = exec('sudo ~/./samplebash.sh ubuntutest4');
  //     child.stdout.on('data', function(data) {
  //       console.log('stdout: ' + data);
  //       res.render('terminal', {
  //         title: 'Express' , 'ip': myip.getLocalIP4()[0] , 
  //         IP_Address: data});
          
  //   });
      

  //   child.stderr.on('data', function(data) {
  //       console.log('stdout: ' + data);
  // //       res.render('index', {
  // //       title: 'Express' , 'ip': myip.getLocalIP4()[0] , 
  // //       IP_Address: data});
  //    });
  //   child.on('close', function(code) {
  //       console.log('closing code: ' + code);
  //   });
  // child = exec('sudo ~/./samplebash.sh ubuntutest2', // command line argument directly in string
  //   function (error, stdout, stderr) {
  //     console.log('stdout:' + stdout);
  //      console.log('stderr: ' + stderr);
  //      if (error !== null) {
  //        //console.log('exec error: ' + error);
  //      }

      
  
// });

module.exports = router;
