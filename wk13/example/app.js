

// --- LOADING MODULES
const express = require('express'),
  url = require('url'),
  body_parser = require('body-parser'),
  session = require('express-session'),
  ejs = require('ejs'),
  _ = require('lodash');

// --- INSTANTIATE THE APP
const app = express();
const PORT = process.env.PORT || 5000;

// --- MONGOOSE SETUP
// db.connect(process.env.MONGODB_URI);

// --- STATIC MIDDLEWARE
app.use(express.static(__dirname + '/public'));
app.use('/jspsych', express.static(__dirname + "/jspsych"));
app.use('/libraries', express.static(__dirname + "/libraries"));

// --- BODY PARSING MIDDLEWARE
app.use(body_parser.json()); // to support JSON-encoded bodies

// --- VIEW LOCATION, SET UP SERVING STATIC HTML
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// --- ROUTING
app.get('/', (req, res) => {
    res.render('experiment.ejs');
});

app.get('/finish', (req, res) => {
  res.render('finish.ejs');
});

var server = app.listen(PORT, function(){
    console.log("Listening on port %d", server.address().port);
});
