var app = require('http').createServer(handler);

app.listen(3000);

var io = require('socket.io').listen(app);
var fs = require('fs');


//io.listen(app);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }

      res.writeHead(200);
      res.end(data);
    });
}


function handleIO(socket) {

  function disconnect() {
    var interval = 0;
    console.log('disconnected');
  }

  console.log('client connected');
  socket.on('disconnect', disconnect);

  socket.on("mensaje a servidor", function(msg) {
    socket.broadcast.emit("mensaje a muro de facebook", msg);
    //io.broadcast.emit("mensaje a muro de facebook", msg); //doesn't work
  });


  var interval = setInterval(function(){
    socket.emit('grito', Math.random());
  }, 5000);


}

io.on('connection', handleIO);


io.configure('production', function () {
  io.enable('browser client minification');
  io.enable('browser client etag');
  io.set('log level', 1);
  io.set('transports', ['websocket', 'xhr-polling', 'jsonp-polling']);
});