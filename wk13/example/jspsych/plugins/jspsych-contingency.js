/*
 * Contingency-discovering task, based on Blanco, Itxaso & Matute (2015) Individuals who believe in the paranormal expose themselves to biased information and develop more causal illusions than nonbelievers in the laboratory. PLoS One, 10(7), e0131378.
 to do
 */


jsPsych.plugins["contingency"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "contingency",
    parameters: {
      contingency: {
        type: jsPsych.plugins.parameterType.FLOAT, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: 0.7
      },
      trials: {
        type: jsPsych.plugins.parameterType.INT, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: 20
      }
    }
  };

  plugin.trial = function(display_element, trial) {

    // trial data

    var trial_data = {
      trial_number: trial.trials,
      contingency: trial.contingency,
      outcomes: {},
    };

    // css + html

    var css = '<style>';
    css += '#button-container {display: flex; justify-content: space-evenly; height: 60px;}';
    css += '#instructions-container {text-align: center; height: 40px;}';
    css += '.my-button {border: 1px solid black; width: 100px; margin: auto; font-size: 14px; padding: 2px; border-radius: 3px}';
    css += '</style>';

    var html = '<div id="instructions-container"></div>';
    html += '<div id="sketch-container"></div>';
    html += '<div id="button-container"></div>';

    display_element.innerHTML = css + html;

    // trial vars

    var case_number = 0; // tracks how many patients seen
    var clockHours = 9; // how many hours the clock will run for
    var minRotate = 7; // speed of minute hand rotation
    cures = 0;
    waits = 0;
    var patientCount = trial.trials;
    var patients = [];
    var move = 8; // patient move speed
    var cure_outcomes = jsPsych.randomization.shuffle([1, 1, 1, 1, 1, 1, 1, 0, 0, 0]);
    var wait_outcomes = jsPsych.randomization.shuffle([1, 1, 1, 1, 1, 1, 1, 0, 0, 0]);
    var runClock = false;

    var disease_sketch = new p5(function( sketch ) {

      var sketchHeight = 300;
      var sketchWidth = 700;
      var patientParts = {m: {hair: []}, f: {hair: {}}};
      var patientSize = 100;

      var bodyColors = [{r: 255, g: 30, b: 30}, {r: 51, g: 158, b: 51}, {r: 227, g: 80, b: 234},
          {r: 247, g: 147, b: 35}, {r: 9, g: 202, b: 237}];
      var hairColors = [{r: 236, g: 236, b: 25}, {r: 160, g: 68, b: 11}, {r: 167, g: 113, b: 13},
          {r: 93, g: 51, b: 4}, {r: 39, g: 26, b: 11}];
      var headColors = [{r: 79, g: 44, b: 16}, {r: 220, g: 182, b: 83}, {r: 250, g: 235, b: 173},
          {r: 209, g: 160, b: 69}, {r: 124, g: 93, b: 35}];
      var legColors = [{r: 43, g: 107, b: 171}, {r: 114, g: 181, b: 249}, {r: 41, g: 83, b: 125},
          {r: 130, g: 150, b: 169}, {r: 194, g: 188, b: 175}];
      var feetColors = [{r: 0, g: 0, b: 0}, {r: 90, g: 63, b: 2}, {r: 204, g: 4, b: 4},
          {r: 164, g: 153, b: 169}, {r: 116, g: 87, b: 32}];

      var peopleColors = [];

      for(var i = 0; i < patientCount/5; i++){
        bodyColors = jsPsych.randomization.shuffle(bodyColors);
        hairColors = jsPsych.randomization.shuffle(hairColors);
        headColors = jsPsych.randomization.shuffle(headColors);
        legColors = jsPsych.randomization.shuffle(legColors);
        feetColors = jsPsych.randomization.shuffle(feetColors);
        for(var j = 0; j < 5; j++){
          peopleColors.push({body: bodyColors[j],
                       hairColor: hairColors[j],
                       head: headColors[j],
                       leg: legColors[j],
                       feet: feetColors[j]});
        }
      }
      for(var k = 0; k < patientCount/6; k++){
        var ids = jsPsych.randomization.factorial({gender: ['m', 'f'], hairNo: [0, 1, 2]}, 1);
        ids = jsPsych.randomization.shuffle(ids);
        for(var l = 0; l < 6; l++){
          var id = 6*k + l;
          if(id < patientCount){
            peopleColors[id].gender = ids[l].gender;
            peopleColors[id].hairNo = ids[l].hairNo;
          }
        }
      }

      function Clock(max){
        this.base = max;
        this.max = this.base + (4*Math.random()-2);
        this.hours = 0;
        this.mins = 0 + (60*Math.random()-30);

        this.reset = function(){
          runClock = false;
          this.hours = 0;
          this.max = this.base  + (4*Math.random()-2);
          this.mins = 0 + (60*Math.random()-30);
        };

        this.show = function(){
          if(runClock){
            sketch.push();
              sketch.textSize(8);
              sketch.translate(0.6*sketchWidth, 80);
              sketch.stroke(0);
              sketch.ellipse(0, 0, 80, 80);
              // hour markings
              for(var i = 0; i < 12; i++){
                sketch.push();
                  sketch.rotate(-1*sketch.PI/2 + i*sketch.PI/6);
                  sketch.line(0, 38, 0, 39.5);
                sketch.pop();
              }
              // numbers
              sketch.strokeWeight(1);
              sketch.stroke(255);
              sketch.textAlign(sketch.CENTER, sketch.CENTER);
              sketch.text('12', 0, -35);
              sketch.text('6', 0, 35);
              sketch.text('3', 35, 0);
              sketch.text('9', -35, 0);
              sketch.stroke(0);
              // hour hand

              sketch.push();
                sketch.rotate(-1*sketch.PI/2 + this.hours*sketch.PI/6);
                sketch.strokeWeight(1.5);
                sketch.line(0, 0, 0, 20);
              sketch.pop();
              // minute hand
              sketch.push();
                sketch.rotate(-1*sketch.PI/2 + this.mins*sketch.PI/30);
                sketch.line(0, 0, 0, 35);
                if(this.hours < this.max){
                  if(this.mins>60){
                    this.mins = 0;
                    this.hours +=1;
                  }
                  this.mins+=minRotate;
                } else {
                  patients[case_number].revealResult();
                }
              sketch.pop();
            sketch.pop();
          }
        };
      }

      function Patient(patientNumber){
        this.patientNumber = patientNumber;
        this.y = 150;
        this.x = 0;
        this.appear = false;
        this.sick = true;
        this.revealed = false;

        this.gender = peopleColors[patientNumber].gender;
        this.hairNo = peopleColors[patientNumber].hairNo;

        this.body = patientParts[this.gender].body;
        this.head = patientParts[this.gender].head;
        this.hair = patientParts[this.gender].hair[this.hairNo];
        this.legs = patientParts[this.gender].legs;
        this.feet = patientParts[this.gender].feet;

        this.body.loadPixels();
        this.head.loadPixels();
        this.hair.loadPixels();
        this.legs.loadPixels();
        this.feet.loadPixels();

        this.bodyColor = peopleColors[patientNumber].body;
        this.hairColor = peopleColors[patientNumber].hairColor;
        this.headColor = peopleColors[patientNumber].head;
        this.legColor = peopleColors[patientNumber].leg;
        this.feetColor = peopleColors[patientNumber].feet;

        this.enter = function(){
          this.appear = 'arriving';
        };

        this.leave = function(){
            this.appear = 'going';
        };

        this.outcome = function(result){
          if(!this.result){
            this.result = result;
            runClock = true;
          }
        };

        this.revealResult = function(){
          if(!this.revealed){
            if(this.result == 1){
              this.sick = false;
            }
            this.revealed = true;
            announceResult(this.sick);
          }
        };

        this.show = function(){
          if(this.appear == 'going'){
            if(this.x < sketchWidth){
              this.x += move*2;
            } else {
              this.appear = 'gone';
            }
          } else if(this.appear == 'arriving'){
            if(this.x < sketchWidth/3){
              this.x += move;
            } else {
              if(!this.arrived){
                addChoiceButtons();
              }
              this.arrived = true;
            }
          }
          if(this.appear == 'arriving' | this.appear == 'going'){
            sketch.push();
              sketch.translate(this.x, this.y);
              sketch.push();
                sketch.tint(this.bodyColor.r, this.bodyColor.g, this.bodyColor.b);
                sketch.image(this.body, 0, 0, patientSize, patientSize);
              sketch.pop();
              sketch.push();
                if(this.sick){
                  sketch.tint(30, 200, 30);
                } else {
                  sketch.tint(this.headColor.r, this.headColor.g, this.headColor.b);
                }
                sketch.image(this.head, 0, 0, patientSize, patientSize);
              sketch.pop();
              sketch.push();
                sketch.tint(this.hairColor.r, this.hairColor.g, this.hairColor.b);
                sketch.image(this.hair, 0, 0, patientSize, patientSize);
              sketch.pop();
              sketch.push();
                sketch.tint(this.legColor.r, this.legColor.g, this.legColor.b);
                sketch.image(this.legs, 0, 0, patientSize, patientSize);
              sketch.pop();
              sketch.push();
                sketch.tint(this.feetColor.r, this.feetColor.g, this.feetColor.b);
                sketch.image(this.feet, 0, 0, patientSize, patientSize);
              sketch.pop();
                // sketch.fill(0);
                // sketch.ellipse(0.58*patientSize, 0.4*patientSize, 6, 12)
            sketch.pop();
          }
        };
      }

      sketch.preload = function(){

        patientParts.f.body = sketch.loadImage('img/patients/f_body.png');
        patientParts.f.head = sketch.loadImage('img/patients/f_head.png');
        patientParts.f.hair[0] = sketch.loadImage('img/patients/f_hair_1.png');
        patientParts.f.hair[1] = sketch.loadImage('img/patients/f_hair_2.png');
        patientParts.f.hair[2] = sketch.loadImage('img/patients/f_hair_3.png');
        patientParts.f.feet = sketch.loadImage('img/patients/feet.png');
        patientParts.f.legs = sketch.loadImage('img/patients/f_legs.png');
        patientParts.m.body = sketch.loadImage('img/patients/m_body.png');
        patientParts.m.head = sketch.loadImage('img/patients/m_head.png');
        patientParts.m.hair[0] = sketch.loadImage('img/patients/m_hair_1.png');
        patientParts.m.hair[1] = sketch.loadImage('img/patients/m_hair_2.png');
        patientParts.m.hair[2] = sketch.loadImage('img/patients/m_hair_3.png');
        patientParts.m.feet = sketch.loadImage('img/patients/feet.png');
        patientParts.m.legs = sketch.loadImage('img/patients/m_legs.png');

        for(var j = 0; j < patientCount; j++){
          var gender = _.sample(['m', 'f']);
          var hair = _.sample(_.range(3));
          patients[j] = new Patient(j);
        }
      };

      sketch.setup = function(){
        sketch.ellipseMode(sketch.CENTER);
        sketch.createCanvas(sketchWidth, sketchHeight);
        clock = new Clock(clockHours);
        $('#button-container').html('<div id="start" class="my-button">Click to see your first patient</div>');
      };

      sketch.draw = function(){
        sketch.background(255);
        patients[case_number].show();
        if(case_number>0){
          patients[case_number-1].show();
        }
        clock.show();
      };

    }, 'sketch-container');


    function addChoiceButtons(){
      $('#instructions-container').html("Do you want to administer Batatrim to this patient?");
      $('#button-container').html("<div id='test' class='my-button'>Yes</div><div id='wait' class='my-button'>No</div>");
    }

    function makeChoice(choice){
      $('#button-container').html('');
      $('#instructions-container').html("We wait a few hours to observe the outcome ...");
      var result;
      if(choice=='test'){
        if(cures<cure_outcomes.length){
          result = cure_outcomes[cures];
          cures += 1;
        } else {
          result = Math.random() > 1 - trial.contingency ? 1 : 0;
        }

      } else {
        if(waits<wait_outcomes.length){
          result = wait_outcomes[waits];
          waits += 1;
        } else {
          result = Math.random() > 1 - trial.contingency ? 1 : 0;
        }
      }
      patients[case_number].outcome(result);
      trial_data.outcomes[case_number] = {choice: choice, result: result};
    }

    function announceResult(sick){
      if(sick){
        $('#instructions-container').html("The patient is still sick.");
      } else {
        $('#instructions-container').html("The patient is cured!");
      }
      var next = case_number + 2;
      if(next > patientCount) {
        $('#button-container').html('<div id="next" class="my-button">Click to finish</div>');
      } else {
        $('#button-container').html('<div id="next" class="my-button">Click to see patient '+next+'</div>');
      }

    }

    $('body').on('click', function(e){
      console.log('body');
    })

    $('#button-container').on('click', function(e){
      var button = e.target.id;
      console.log(button)
      switch(button){
        case 'start':
          patients[case_number].enter();
          $('#button-container').html('');
        break;
        case 'test':
          makeChoice('test');
        break;
        case 'wait':
          makeChoice('wait');
        break;
        case 'next':
          console.log('here', case_number);
          patients[case_number].leave();
          if(case_number < patientCount - 1){
            case_number += 1;
            patients[case_number].enter();
            clock.reset();
            $('#instructions-container').html('');
            $('#button-container').html('');
          } else {
            finish_trial();
          }

        break;
      }
    });

    function finish_trial(){
      trial_data.task_end_time = Date.now();
      trial_data.duration = trial_data.task_end_time - trial_data.task_start_time;
      disease_sketch.remove();
      display_element.innerHTML = '';
      jsPsych.finishTrial(trial_data);
      console.log(trial_data);
    }

    $( document ).ready(function() {
      // trial_start = Date.now(); // tracking each separate trial
      trial_data.task_start_time = Date.now(); // tracking overall time
      $('#sketch-container').focus();
    });

  };

  return plugin;
})();
