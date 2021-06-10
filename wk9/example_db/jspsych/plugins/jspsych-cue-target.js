/*
 * Example plugin template
 */

jsPsych.plugins["cue-target"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "cue-target",
    parameters: {
      target: {
        type: jsPsych.plugins.parameterType.STRING, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: undefined
      },
      validate: {
        type: jsPsych.plugins.parameterType.BOOLEAN,
        default: true
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        default: 'Think of a one-word cue that would <b>help someone else</b> guess this word:'
      },
      qNo: {
        type: jsPsych.plugins.parameterType.BOOLEAN,
        default: undefined
      }
    }
  };

  plugin.trial = function(display_element, trial) {

    // data saving
    var trial_data = {
      target: trial.target,
      qNo: trial.qNo
    };

    // html + css

    var css = '<style>';
    css += '#preamble {font-size:20px}';
    css += '#target {font-size: 40px}';
    css += '#cue {font-size: 20px}';
    css += '#cue-container {font-size:35px}';
    css += '.spaced {padding-bottom:15px}';
    css += '</style>';

    var html = '<div id="preamble" class="spaced">'+trial.preamble+'</div>';
    html += '<div id="target" class="spaced">'+trial.target+'</div>';
    html += '<div id="cue-container" class="spaced"><input type="text" id="cue"></input></div></div>';
    html += '<div id="button-container" class="spaced"><button id="submit">Submit</button></div>';

    display_element.innerHTML = css+html;

    // responses

    function collectResponse(){
      var end_time = Date.now();
      var response = getResponse();
      var responseOk = validate(response);
      if(responseOk.allOk){
        trial_data.response = response;
        var rt = end_time - start_time;
        trial_data.rt = rt;
        endTrial();
      } else {
        var alertMsg = '';
        if(!responseOk.charOk){
          alertMsg += "Please answer using a single word. Check you don't have any spaces, numbers, symbols or punctuation (including at the end of your answer). ";
        }
        if(!responseOk.lengthOk){
          alertMsg += 'Please respond with a word that is at least 2 letters long.';
        }
        alert(alertMsg);
      }
    }

    $('#submit').click(function(e){
      // validate answers
      collectResponse();

    });

    $('#cue').keypress(function(e){
      if (e.which == 13 ) {
          collectResponse();
      }
    });


    function getResponse() {
      return($('#cue').val());
    }

    function validate(response) {
      var letters = /^[A-Za-z]+$/;
      var charOk = letters.test(response);
      var lengthOk = response.length>=2;
      var allOk = charOk & lengthOk;
      return({charOk: charOk,
        lengthOk: lengthOk,
        allOk: allOk});
    }

    function endTrial(){

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // clear screen
      display_element.innerHTML = '';

      jsPsych.finishTrial(trial_data);
      console.log(trial_data);

    }

    $( document ).ready(function() {
      start_time = Date.now();
      $('#cue').focus();

    });

  };

  return plugin;
})();
