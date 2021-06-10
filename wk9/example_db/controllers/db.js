/*
Connect to database
*/

// mongoose is a library for handling MongoDB connections/operations
const mongoose = require('mongoose');

// track which database we're connecting to
var state = {
  db: null,
};

// exports. just means that these functions can be called from the main app.js (if it loads this script)
exports.connect = function(uri){
  return new Promise((resolve, reject) => {
    // if already connected, stop here
    if (state.db) return done();
    // otherwise, connect to db
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }, (err, db) => {
      if(err){
        reject(err);
      } else {
        console.log('Connected to database...');
        state.db = db;
        resolve(db);
      }
    });
  });
};

exports.get = function() {
  return state.db;
};

exports.close = function() {
  if (state.db) {
    mongoose.disconnect().finally(() => {
      console.log('Disconnecting from database...');
      process.exit("...done");
    });
  }
};
