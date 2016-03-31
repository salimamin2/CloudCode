var express = require('express');
var path = require('path');
var session  = require('express-session');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');

var routes = require('./routes/terminal');
var script = require('./routes/index');
var users = require('./routes/users');

var app = express();

var server = require('http').Server(app);

var io = require('socket.io').listen(server);

require('./config/passport')(passport);

// var util = require('util'),
//     exec = require('child_process').exec,
//     child;
// var ejs = require('ejs')
// child = exec('sudo ~/autoscript.sh ub2 c', // command line argument directly in string
//   function (error, stdout, stderr) {      // one easy function to capture data/errors
//     console.log('stdout: jan chordo' + stdout);
//     console.log('stderr: ' + stderr);
//     if (error !== null) {
//       console.log('exec error: ' + error);
//     }
// });

server.listen(9000);

global.socketIO = io;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.engine('html',require('ejs').renderfile);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());



app.use(session({
  secret: 'vidyapathaisalwaysrunning',
  resave: true,
  saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


function sendTime() {
    io.sockets.emit('time', { time: new Date().toJSON()});
    //io.sockets.emit('echo', { echo: 'Ready !!' });
}

// Send current time every 10 secs
// setInterval(sendTime, 1000);

// Emit welcome message on connection
io.sockets.on('connection', function(socket) {


    var cookie = socket.handshake.headers.cookie;
    var match = cookie.match(/\buser_id=([a-zA-Z0-9]{32})/);  //parse cookie header
    var userId = match ? match[1] : null;
    
    console.log("socketid : "+socket.id);
    socket.emit('welcome', { message: 'Connected!' , 'userId':userId});

    socket.on('i am client', console.log);

    //console.log("cookie : "+cookie);
    console.log("userId : "+userId);

});


app.use('/', routes);
app.use('/index', script);
app.use('/terminal', routes);
app.use('/users', users);

app.get('/terminal', function(req, res){
    res.render('terminal.ejs');
});

// catch 404 and forward to error handler
// app.get('/signin',function(req,res){
//   console.log("signinsigninsigninsignin")
//   res.render('signin', { title:'signin'});
// })

// app.get('/signup',function(req,res){
//   console.log("signup page rendered")
//   res.render('signup', { title:'signup'});
// })

// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
require('./routes/routes.js')(app, passport);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
