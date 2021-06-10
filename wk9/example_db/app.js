/*jshint esversion: 6 */

// Load libraries
const express = require('express'),
  url = require('url'),
  body_parser = require('body-parser'),
  ejs = require('ejs'),
  detect = require('browser-detect'),
  helper = require(__dirname+'/libraries/helper.js'),
  // Controllers are just our database scripts...
    // db.js just handles connecting
    db = require(__dirname+'/controllers/db.js'),
    // Then there is one file for each collection we're going to save...
    // tasks.js will store stuff like browser info each time someone clicks the link (i.e., before the survey)
    tasks = require(__dirname+'/controllers/tasks.js'),
    // responses.js will store the experiment data
    responses = require(__dirname+'/controllers/responses.js');

// allow the use of info from the local .env file
require('dotenv').config();

// app parameters
const study_name = 'pilot';
const app = express();
const PORT = process.env.PORT || 5000;

// app middleware (just tells it how to handle info/where to look for files/etc.)
// where are the public pages?
app.use(express.static(__dirname + '/public'));
// how to handle incoming data, e.g. the survey data?
app.use(body_parser.json());
// libraries needed both by this server and by the client experiment
app.use('/jspsych', express.static(__dirname + "/jspsych"));
app.use('/libraries', express.static(__dirname + "/libraries"));

// how to render pages
app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views');

// Connect to the database
// "process" refers to whatever is running the script
// ".env" is a file where we can store the connection credentials
// "MONGODB_URI" is a key in that file
db.connect(process.env.MONGODB_URI)
  .then(function(){
    var server = app.listen(PORT, function(){
        console.log("Listening on port %d", server.address().port);
    });
  });

app.get('/', (req, res, next) => {
    // MTurk-specific info
    // the OR syntax || means that if it can't find this info in the query string, it will treat it as 'none'
    const worker_id = req.query.workerId || 'none';
    const assignment_id = req.query.assignmentId || 'none';
    const hit_id = req.query.hitId || 'none';

    // generate random participant ID
    const trial_id = helper.makeCode(8);
    // what browser is the participant using?
    const browser = detect(req.headers['user-agent']);

    // use one of the controllers to save the initial data
    tasks.save({
        "worker_id": worker_id,
        "hit_id": hit_id,
        "assignment_id": assignment_id,
        "trial_id": trial_id,
        "study_name": study_name,
        "browser": browser,
    });

    // render the experiment, passing it the trial_id data
    res.render('experiment.ejs', {input_data: JSON.stringify({trial_id: trial_id})});
});

// What to do when the survey posts the survey data
app.post('/data', (req, res, next) => {
  // the data is stored in the request body
  const data = req.body;
  // keep track of the participant ID
  const trial_id = req.query.trial_id || 'none';
  console.log(trial_id, 'Preparing to save trial data...');
  // use one of the controllers to save the survey data
  responses.save({
    trial_id: trial_id,
    study_name: study_name,
    trial_data: data,
  })
  // signal back that everything's ok! 200=ok
  .then(res.status(200).end());
});



app.get('/finish', (req, res) => {
  let code = req.query.token;
  if(!code || code.length==0){
    code = helper.makeCode(10) + 'SZs';
  }
  res.render('finish.ejs', {completionCode: code});
});

// process events
process.on('unhandledRejection', err => {
  console.log(err);
});

process.on('SIGINT', ()=>{
  console.log("interrupt: cleanup...");
  db.close();
});
process.on('SIGTERM', ()=>{
  console.log("terminate: cleanup...");
  db.close();
});
