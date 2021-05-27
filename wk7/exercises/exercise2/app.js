
// --- LOADING MODULES
const express = require('express'),
  url = require('url'),
  body_parser = require('body-parser'),
  ejs = require('ejs'),
  detect = require('browser-detect'),
  helper = require(__dirname+'/libraries/helper.js'),
  tasks = require(__dirname+'/controllers/tasks.js'),
  responses = require(__dirname+'/controllers/responses.js'),
  db = require(__dirname+'/controllers/db.js');

require('dotenv').config();

/*
INSTANTIATE THE APP
- process.env.PORT will retrieve the relevant port # from Heroku if deployed,
  otherwise use port 5000 locally, which you can visit by entering 'localhost:5000' in a browser IF the app is running
*/
const app = express();
const PORT = process.env.PORT || 5000;

var server = app.listen(PORT, function(){
  console.log("Listening on port %d", server.address().port);
});

/*
SET MIDDLEWARE/LIBRARIES/PARSING
- Basically, just tells the app how to handle certain info,
  Where to look for certain files,
  Or what file types to expect
*/
app.use(express.static(__dirname + '/public'));
app.use(body_parser.json());
app.use('/jspsych', express.static(__dirname + "/jspsych"));
app.use('/libraries', express.static(__dirname + "/libraries"));
app.use('/helper', express.static(__dirname + "/helper"));
app.set('views', __dirname + '/public/views');
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

/*
ROUTING
- Tells the app what to do if requests are made (e.g. someone tries to visit the app URL),
  or if the experiment script makes a request to save data
*/
app.get('/', (req, res) => {

  // Extract MTurk-specific data from the URL
  const worker_id = req.query.workerId || '';
  const assignment_id = req.query.assignmentId || '';
  const hit_id = req.query.hitId || '';

  // Generate anonymous code to identify this trial
  const trial_id = helper.makeCode(10);

  // What browser is the participant using?
  const browser = detect(req.headers['user-agent']);

  // Check device not mobile
  let browserOk = true;
  if (browser) {
    if (browser.mobile==true){
      browserOk = false;
    }
  }

  if(browserOk){
    // render the experiment script, along with some data (here, just the trial_id);
    res.render('experiment.ejs', {input_data: JSON.stringify({trial_id: trial_id})});
  } else {
    res.send('You seem to be viewing this on a mobile device. The instructions explicitly forbade this. Please just return the HIT.');
  }

});

app.get('/finish', (req, res) => {

  let code = req.query.token;
  if(code.length==0){
    // If, for whatever reason, the code has gone missing, generate a new one so that the participant can get paid
    code = helper.makeCode(10) + 'SZs';
  }
  res.render('finish.ejs', {
    completionCode: code,
  });
});

app.post('/data', (req, res) => {

  // Get the data from the body of the request
  const data = req.body;
  console.log(data);

  // Get the participant ID from the request query
  const trial_id = req.query.trial_id || 'none';
  console.log(trial_id, 'Preparing to save trial data...');

  // We'll add code here to save the data AFTER we've connected a database

  // Tell the client that everything is ok (the code for status=ok is 200) and that we're done
  res.status(200).end();
});
