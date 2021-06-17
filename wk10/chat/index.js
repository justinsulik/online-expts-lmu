// This demo from https://socket.io/get-started/chat
// For more info see https://socket.io/get-started/

// Packages
const express = require('express'),
  ejs = require('ejs'),
  http = require('http'),
  socketIO = require("socket.io");

// Initialize app and server
const app = express(); // express creates an app for us
const PORT = 5000; // where should it be listening?
const server = http.createServer(app);

// Tell app how to handle directories/files
app.set('views', __dirname + '/public');
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

// Tell socket.io to use this server for its pipelines
const io = new socketIO.Server(server)

io.on('connection', function(socket){
  // now you can use socket.on to track events sent from the client
    // socket.on = the client has done something
  // and io.emit to send events to the client
    // io.emit = the server responds by sending an event
  console.log('a user connected')

});

// Handle requests
app.get('/', (req, res) => {
  res.render('chat.ejs');
});

// Tell the app to run a server listening at a particular port
server.listen(PORT, function(){
  console.log("Listening on port", server.address().port);
});
