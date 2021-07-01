/*
Custom functions written for CVBE how-to session 03.03.2020
For help, contact justin.sulik@gmail.com
*/

function lengthInUtf8Bytes(str) {
  // https://stackoverflow.com/questions/23318037/size-of-json-object-in-kbs-mbs
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  var m = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (m ? m.length : 0);
}

function prepareData(trial_id, experiment_start_time){
  console.log(trial_id, '    Preparing data...');
  var data = {};
  var experiment_end_time = Date.now();
  var duration = experiment_end_time - experiment_start_time;
  var interactionData = jsPsych.data.getInteractionData().json();
  jsPsych.data.get().addToLast({duration: duration,
                                interactionData: interactionData,
                                trial_id: trial_id,
                                userAgent: navigator.userAgent
                              });
  data.responses = jsPsych.data.get().json();
  data.trial_id = trial_id;
  data.end_time = Date();
  dataJSON = JSON.stringify(data);
  return dataJSON;
}

var save_attempts = 0;
var paint_save_attempts = 0;
var save_timeout = 1000;

function save(dataJSON, dataUrl, trial_id){
  console.log(trial_id, '    About to post survey output data...', dataJSON);
  var max_attempts = 5;
  var message = '<p>Please wait a few seconds while we save your responses...</p><p>If you are not automatically redirected in a few seconds, please click <a href="/finish?token='+trial_id+'">here</a>.</p>';

  $.ajax({
     type: 'POST',
     url: dataUrl,
     data: dataJSON,
     contentType: "application/json",
     timeout: 3000,
     success: function(request, status, error){
       finish(trial_id);
     },
     error: function(request, status){
       $('#jspsych-content').html(message);
       console.log('    Error posting data...', request, status);
       if(save_attempts < max_attempts){
         save_attempts += 1;
         save_timeout += 500;
         console.log("Trying again, attempt ", save_attempts);
         setTimeout(function () {
            save(dataJSON, dataUrl, trial_id);
          }, save_timeout);
       } else {
         finish(trial_id);
       }
     }
   });
}

function finish(completionCode){
    console.log('    Rerouting to finish page...');
    window.location.href = "/finish?token="+completionCode;
}

function makeCode(len){
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYabcdefghijklmnopqrstuvwxy0123456789";
  for( var i=0; i < len; i++ ){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

var helper = {
  makeCode: makeCode,
  prepareData: prepareData,
  save: save
};

// Handles exports differently, depending whether this script is loaded by node
// or by client
if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = helper;
  }
  exports.helper = helper;
} else {
  window.helper = helper;
}
