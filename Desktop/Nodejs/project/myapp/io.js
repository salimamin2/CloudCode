var io = require('socket.io')();

io.on('connection', function (socket) {
    console.log(socket.request.session);
    console.log('New client connected!');
});

module.exports = io;