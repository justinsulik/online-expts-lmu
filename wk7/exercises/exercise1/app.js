const express = require('express');

const app = express(); // express creates an app for us
const PORT = 5000; // where should it be listening?

// tell the app to run a server listening at a particular port
const server = app.listen(PORT, function(){
  console.log("Listening on port", server.address().port);
});
