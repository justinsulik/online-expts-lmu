/*
Description: jsPsych plugin for a Bias Against Disconfirmatory Evidence (BADE) task
Preferably load p5.min.js in the main experiment page (otherwise it will be downloaded from cdnjs.cloudflare.com)
Author: Justin Sulik
Contact:
 justin.sulik@gmail.com
 justinsulik.com,
 twitter.com/justinsulik
 github.com/justinsulik
*/

jsPsych.plugins['twofoursix'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'twofoursix',
    parameters: {
      example1: {
        type: jsPsych.plugins.parameterType.INT,
        default: [2,4,6],
        description: 'The first triplet given to participants'
      },
      testFunction: {
        type: jsPsych.plugins.parameterType.FUNCTION,
        default: function(triad){
          if( triad[1]>triad[0] & triad[2]>triad[1]){
            return true;
          } else {
            return false;
          }
        },
        description: 'A function that returns true/false depending whether the test triplet matches the rule'
      },
      ruleConf: {
        type: jsPsych.plugins.parameterType.BOOLEAN,
        default: false,
        description: 'If true, participants are asked how confident they are that they know the rule'
      },
      testConf: {
        type: jsPsych.plugins.parameterType.BOOLEAN,
        default: false,
        description: 'If true, participants are asked whether they think their test will get positive or negative feedback'
      },
    }
  };

  plugin.trial = function(display_element, trial) {

    var trialGraph = {
      /*
      Object that holds information about trial states and transitions
      Properties are strings representing what stage of the trial we're currently on
      Those stages in turn have properties describing:
        - instructions: what prompt to display on screen
        - button: what button to display
        - successor: what stage comes next
        - onClick: what to do when the trial is advanced
        - setup: what to do before this stage starts
      Transitioning around the graph and calling of functions is handled by trialControl
      */
      'start': {
        instructions: "Try think of what my rule might be. When you've thought of a hypothesis, press 'ready'.",
        button: '<button type="button" id="advanceButton">Ready</button>',
        successor: function(){
          if( trial.ruleConf ){
            return 'ruleConf';
          } else{
            return 'testTriplet';
          }
        },
        onClick: function(e){
          var click_time = Date.now() - start_time;
          trial_data.rts.push({stage: 'start', time: click_time});
          trialControl.advance();
        },
        setup: function(){

        }
      },
      'testTriplet': {
        instructions: function(){
          if( firstAttempt ){
              return "Propose a triplet to test (enter a number in each of the 3 slots below). Then click 'check' and I'll tell you if your triplet matches my rule or not.";
          } else {
              return "Propose a triplet to test. Then click 'check' and I'll tell you if your triplet matches my rule or not.";
          }
        },
        button: '<button type="button" id="advanceButton">Check</button>',
        successor: function(){
          if( trial.testConf ){
            return 'testConf';
          } else {
            return 'tripletFeedback';
          }

        },
        onClick: function(e){

          var input1 = $("#test1").val().replace(/\s+/g, '');
          var input2 = $("#test2").val().replace(/\s+/g, '');
          var input3 = $("#test3").val().replace(/\s+/g, '');
          if( validateTriplet(input1, input2, input3) ){
            testTriplet = [input1, input2, input3];
            firstAttempt = false;
            var click_time = Date.now() - start_time;
            trial_data.rts.push({stage: 'testTriplet', time: click_time});
            trialControl.advance();
          } else {
            alert("One of your 3 responses is blank or contains non-numeric characters. Double check and try again.");
          }
        },
        setup: function(){
          $('#input').html("<input type='text' id='test1' name='test1' size='3'> <input type='text' id='test2' name='test2' size='3'> <input type='text' id='test3' name='test3' size='3'><br>");
          $('#test1').focus();
        }
      },
      'ruleConf': {

        instructions: function(){
          if( firstAttempt ){
              return 'How confident are you that you know what my rule is already? Click/drag on the bar below';
          } else {
              return 'How confident are you at this point that you know what my rule is? Click/drag on the bar below';
          }
        },
        button: '<button type="button" id="advanceButton">Done!</button>',
        successor: function(){
          if( firstAttempt ){
            return 'testTriplet';
          } else if( responseGiven ) {
              return 'end';
          } else {
            return 'choice';
          }
        },
        onClick: function(e){

          if( confidenceInput.slider.thumbCreated ){
            var confRating;
            if( confidenceInput.slider.value()>=0 & confidenceInput.slider.value()<=1 ){
              confRating = confidenceInput.slider.value();
            } else {
              confRating = 'NA';
            }
            trial_data.ruleConf.push(confRating);
            var click_time = Date.now() - start_time;
            trial_data.rts.push({stage: 'ruleConf', time: click_time});
            trialControl.advance();
            confidenceInput.remove();
          } else {
            alert("Mouse over the grey bar. Ratings should appear. Click on the bar to make a rating, or drag to adjust.");
          }

        },
        setup: function(){

          confidenceInput = new p5(function( sketch ) {
            slider(sketch);
          }, 'input');

        }
      },
      'testConf': {
        instructions: "Do you think your proposed triplet matches my rule? Click/drag on the bar below.",
        button: '<button type="button" id="advanceButton">Done!</button>',
        successor: function(){
          return 'tripletFeedback';
        },
        onClick: function(e){

          if( confidenceInput.slider.thumbCreated ){
            var confRating;
            if( confidenceInput.slider.value()>=0 & confidenceInput.slider.value()<=1 ){
              confRating = confidenceInput.slider.value();
            } else {
              confRating = 'NA';
            }
            trial_data.testConf.push(confRating);
            var click_time = Date.now() - start_time;
            trial_data.rts.push({stage: 'testConf', time: click_time});
            trialControl.advance();
          } else {
            alert("Mouse over the grey bar. Ratings should appear. Click on the bar to make a rating, or drag to adjust.");
          }

        },
        setup: function(){

          confidenceInput = new p5(function( sketch ) {
            slider(sketch);
          }, 'input');

        }
      },
      'tripletFeedback': {
        instructions: 'Your feedback is below. Have a look whether your proposed triplet matched my rule or not, then press "Next".',
        button: '<button type="button" id="advanceButton">Next</button>',
        successor: function(){
          if( trial.ruleConf ){
            return 'ruleConf';
          } else {
            return 'choice';
          }
        },
        onClick: function(e){
          var click_time = Date.now() - start_time;
          trial_data.rts.push({stage: 'checkFeedback', time: click_time});
          trialControl.advance();
        },
        setup: function(){
          updateTests(testTriplet[0], testTriplet[1], testTriplet[2]);
          $('#input').html('');
        }
      },
      'choice': {
        instructions: "Decide if you'd like to <b>test</b> another triplet, or if you're ready to <b>guess</b> what my rule is "+
        "(remember, you only get one chance to guess, so only guess when you feel you've done enough testing!)",
        button: '<button type="button" id="testButton">Test</button> <button type="button" id="guessButton">Guess</button>',
        successor: function(){
          if( buttonChoice == 'testButton' ){
            return 'testTriplet';
          } else if( buttonChoice == 'guessButton' ){
            return 'response';
          }
        },
        onClick: function(e){
          buttonChoice = e.target.id;
          var click_time = Date.now() - start_time;
          trial_data.rts.push({stage: 'choice', time: click_time});
          trialControl.advance();
        },
        setup: function(){

        }
      },
      'response': {
        instructions: 'What do you think my rule is? Decribe it <b>clearly</b> and <b>succinctly</b>.',
        button: '<button type="button" id="submitGuess">Make a guess</button>',
        successor: function(){
          return 'end';
        },
        onClick: function(){

            var guess = $("#guess").val();
            guess = guess.replace(/[^\w\s]/gi, '');
            console.log(guess);
            // check the guess is over a minimum length (e.g. 'evens' = 5)
            if( guess.length >= 5 ) {

              // add data
              trial_data.guess = guess;
              var end_time = Date.now() - start_time;
              trial_data.rts.push({stage: 'response', time: end_time});

              trialControl.advance();

            } else {

              alert('Your guess is either too short or is missing. Try typing something more informative.');
              trial_data.failedGuesses.push(guess);

            }

        },
        setup: function(){

          $('#input').html("<input type='text' id='guess' name='guess' size='40'>");

        }
      },
      'end': {
        instructions: '',
        button: '',
        successor: function(){

        },
        onClick: function(e){

        },
        setup: function(){

          // end trial
          display_element.innerHTML = '';
          console.log(trial_data);
          jsPsych.finishTrial(trial_data);

        }
      }
    };

    var trialControl = {
      /*
      Object for handling transitions around trialGraph, and calling appropriate functions for setup and whatever stage we're on
      */

      stage: null,
      data: null,

      initialize: function(x){
        this.stage = x;
        this.populate();
        this.data.setup();
        this.updateInstructions();
        this.updateButtons();
      },
      populate: function(){
        this.data = trialGraph[this.stage];
      },
      advance: function() {
        var nextStage = this.data.successor();
        this.initialize(nextStage);
      },
      updateButtons: function() {
        $('#buttonContainer').html(this.data.button);
      },
      updateInstructions: function(){
        $('#currentInstructions').html(this.data.instructions);
      },

    };


/*
Set up and inject html
*/

    var css = '<style>td {padding: 0px}';
    css += '.triplet {width: 150px; text-align: right}';
    css += '.match {width: 50px; text-align: left}';
    css += '#inputsContainer {height: 120px}';
    css += '#buttonContainer {margin: 5px auto; width: 800px}';
    css += '#example {font-size: 20px; font-weight: bold}';
    css += '.test {width: 160px}';
    css += 'tr {padding-top: 50px;}';
    css += '</style>';

    var htmlTop = `<div id='instructionsContainer'>
                    <div id='startInstructions'>
                      <p>
                        I am thinking of a rule that generates triplets (sequences of 3 numbers).
                      </p>
                      <p>
                        To start you off, I can tell you that the following triplet matches my rule:<br>
                        <span id="example"></span>
                      </p>
                    </div>
                    <div id='currentInstructions'>
                    </div>
                   </div>`;
    var htmlMid = `<div id='inputsContainer'>
                    <div id='input'>
                    </div>
                    <div id='buttonContainer'>
                      <div id='buttonBox'>
                      </div>
                    </div>
                   </div>`;
    var htmlBottom = `<div id='tests'>
                        <table id='testTable'>
                          <tr id='row0'>
                            <td class='triplet' id='t0'>
                            </td>
                            <td class='match' id='m0'>
                            </td>
                            <td class='triplet' id='t1'>
                            </td>
                            <td class='match' id='m1'>
                            </td>
                          </tr>
                        </table>
                      </div>`;

    var feedbackYes = '<span style="color:green"> yes</span>';
    var feedbackNo = '<span style="color:red"> no</span>';

    display_element.innerHTML = css+'<div id="trialArea">'+htmlTop+htmlMid+htmlBottom+'</div>';

    // check if p5 script is loaded
    if (window.p5){
        console.log('p5 already loaded...');
    } else {
      $.ajax({
          url: "https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.16/p5.min.js",
          dataType: "script",
          success: function() {
            console.log("p5 loaded...");
          }
      });
    }

    // Add content to html
    $('#example').html(trial.example1[0]+', '+ trial.example1[1]+', '+trial.example1[2]);
    $('#t0').html(trial.example1[0]+', '+ trial.example1[1]+', '+trial.example1[2]+': ');
    $('#m0').html(feedbackYes);

    // initialize trialControl

    trialControl.initialize('start');

/*
Trial objects and functions
*/

    // trial variables

    var currentRow = 0;
    var currentColumn = 0;
    var currentTest = 1;
    var buttonChoice;
    var testTriplet;
    var responseGiven = false;
    var firstAttempt = true;

    // create object to hold data

    var trial_data = {
      tests: [],
      correct: [],
      failedGuesses: [],
      rts: [],
    };

    if( trial.testConf ){
      trial_data.testConf = [];
    }
    if( trial.ruleConf ){
      trial_data.ruleConf = [];
    }

    // trial functions

    var validateTriplet = function(input1, input2, input3){
      if( $.isNumeric(input1) & $.isNumeric(input2) & $.isNumeric(input3) ){
        return true;
      } else {
        return false;
      }
    };

    var updateTests = function(input1, input2, input3){
      input1 = parseInt(input1, 10);
      input2 = parseInt(input2, 10);
      input3 = parseInt(input3, 10);
      var testString = input1 + ', ' + input2 + ', ' + input3 + ': ';
      var correct = trial.testFunction([input1, input2, input3]);
      var feedbackString;

      if( correct ){
        feedbackString = feedbackYes;
        trial_data.correct.push(1);
      } else {
        feedbackString = feedbackNo;
        trial_data.correct.push(0);
      }

      // update tests
      $('#t'+currentTest).html(testString);
      $('#m'+currentTest).html(feedbackString);

      // update indexes
      currentTest += 1;
      if( currentColumn < 5) {
        currentColumn += 1;
      } else {
        currentColumn = 0;
        currentRow += 1;
        $('#testTable').append('<tr id="row'+currentRow+'"></tr>');
      }

      // update html
      $('#row'+currentRow).append("<td class='triplet' id='t"+currentTest+"'></td><td class='match' id='m"+currentTest+"'></td>");

      // add data
      trial_data.tests.push([input1, input2, input3]);
    };

/*
 p5 pseudo-classes
*/

    // A slider for giving a graded confidence estimate
    function Scrollbar(sketch, xPosition, yPosition, sliderWidth, sliderHeight){

      this.sketch = sketch;
      this.overThumb = false;
      this.overTrack = false;
      this.thumbCreated = false;
      this.thumbColor = 70;
      this.thumbX = 0;
      this.background = 200;
      this.sliderWidth = sliderWidth;
      this.offset = sketch.offset;

      if( trialControl.stage == 'testConf'){
        this.scale_labels = ['Definitely\nnot', 'Probably\nnot', 'Maybe\nnot', 'As likely\nas not', 'Maybe\nyes', 'Probably\nyes', 'Definitely\nyes'];
      } else if ( trialControl.stage == 'ruleConf' ){
        this.scale_labels = ['Extremely\nunsure', 'Quite\nunsure', 'Slightly\nunsure', 'As sure\nas not', 'Slightly\nsure', 'Quite\nsure', 'Extremely\nsure'];
      }

      sketch.tickInterval = sliderWidth/(this.scale_labels.length-1);

      this.display = function() {

        sketch.rectMode(sketch.RADIUS);

        // labels
        // if( sketch.over ){
        this.label();
        // }

        // track
        sketch.fill(this.background);
        sketch.stroke(200);
        sketch.rect(sketch.width*xPosition, sketch.height*yPosition, sliderWidth/2, sliderHeight/2);

        // thumb
        if( this.thumbCreated ){
          sketch.fill(this.thumbColor);
          sketch.stroke(40);
          sketch.rect(this.thumbX,sketch.height*yPosition, 5, 8, 3, 3, 3, 3);
        }

      };

      this.label = function() {
        this.scale_labels.forEach(function(e,i){
          var tickX = sketch.offset+i*sketch.tickInterval;
          var tickY = sketch.height*yPosition-sliderHeight/2;
          sketch.stroke(110);
          sketch.line(tickX,tickY,tickX,tickY-5);
          sketch.textSize(8);
          sketch.fill(40);
          sketch.strokeWeight(0);
          sketch.textAlign(sketch.CENTER);
          sketch.text(e, tickX, tickY-18);
          sketch.strokeWeight(1);
        });
      };

      this.updateThumb = function() {
          this.thumbX = sketch.mouseX;
      };

      this.overTrack = function(){
        if( sketch.mouseX > sketch.offset & sketch.mouseX < sketch.offset+sliderWidth ){
          return true;
        } else {
          return false;
        }
      };

      this.move = function() {
        if( sketch.over & this.overTrack() ){
          this.updateThumb();

          if( !this.thumbCreated  & sketch.mouseY > 20 & sketch.mouseY < 60){
            this.thumbCreated = true;
          }
        }
      };

      this.drag = function() {
        if( sketch.over & this.overTrack()){
          this.updateThumb();
        }
      };

      this.value = function(){
        var val = (this.thumbX-sketch.offset)/this.sliderWidth;
        return val;
      };
    }

/*
p5 sketches
*/


    function slider(sketch){

          var canvas;
          var backgroundColor;

          sketch.setup = function(){
            backgroundColor = 'white';
            sketch.offset = 27; //allow space on either end of slider track
            sketch.trackwidth = 400;
            sketch.trackheight = 8;
            sketch.over = false;
            canvas = sketch.createCanvas(sketch.trackwidth+sketch.offset*2, 50);
            sketch.background(backgroundColor);
            sketch.slider = new Scrollbar(sketch, 0.5, 0.7, sketch.trackwidth, sketch.trackheight);

          };

          sketch.draw = function(){


            sketch.focus();

            backgroundColor = function(){
              if( sketch.over ){
                return sketch.color('#EFF5FB');
              } else {
                return sketch.color('white');
              }
            };

            sketch.background(backgroundColor());

            if(trialControl.stage == 'testConf' | trialControl.stage == 'ruleConf'){
              sketch.slider.display();
            }
          };

          sketch.focus = function() {
            var over = $('#input').attr('over');
            if( over == 'true' & (trialControl.stage == 'testConf' | trialControl.stage == 'ruleConf')){
              sketch.over = true;
            } else {
              sketch.over = false;
            }
          };

          sketch.mouseDragged = function() {
                sketch.slider.drag();
          };

          sketch.mouseClicked = function() {
              sketch.slider.move();
          };

          sketch.mousePressed = function() {
              sketch.slider.move();
          };
        }



/*
Inputs
*/

    $("#buttonContainer").on("click", "button", function(e){
      $('#currentInstructions').css('display', 'none');
      trialControl.data.onClick(e);
      $('#currentInstructions').fadeIn(400);

    });

    $( '#input' ).mouseenter( function(){
        $( this ).attr('over', true);
      }).mouseleave( function(){
        $( this ).attr('over', false);
    });

    // start timer once trial is set up

    var start_time = Date.now();


  }
  return plugin;
})();
