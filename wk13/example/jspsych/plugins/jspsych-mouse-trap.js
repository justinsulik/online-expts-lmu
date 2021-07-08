/*
 * Mouse trap game, based on Brugger & Graves (1997) Testing vs. believing hypotheses: Magical ideation in the judgement of contingencies. Cognitive Neuropsychiatry, 2(4), 251-272.
 */



jsPsych.plugins["mouse-trap"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "mouse-trap",
    parameters: {
      cutoff_time: {
        type: jsPsych.plugins.parameterType.INT, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: 3500
      },
      max_duration: {
        type: jsPsych.plugins.parameterType.INT, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: 20000
      },
      trials: {
        type: jsPsych.plugins.parameterType.INT,
        default: 10
      },
      grid_size: {
        type: jsPsych.plugins.parameterType.INT,
        default: 4
      },
      attempts : {
        type: jsPsych.plugins.parameterType.INT,
        default: 10
      }
    }
  };

  plugin.trial = function(display_element, trial) {

    // trial data

    var trial_data = {
      trial_number: trial.trial_number,
      draws: trial.draws
    };

    for(var i = 0; i<trial.attempts; i++){
      trial_data[i] = {
        moves: []
      };
    }

    // css + html

    var css = '<style>';
    css += '</style>';

    var html = '<div id="sketch-container">';
    html += '</div>';

    display_element.innerHTML = css + html;

    // trial vars

    var mouse;
    var trap;
    var result;
    var remaining;
    var timer_start_time;

    var stage = 'start';
    var current_attempt = 0;
    var points = 0;
    var start_message = 'Press SPACE to start the timer.';
    var feedback_string1 = start_message;
    var feedback_string2 = 'Attempts remaining: ' + trial.attempts + '    Points: ' + points;
    var timer_started = false;
    var feedback_period = false;
    var feedback_duration = 1500;
    var win_feedback_duration = 1500;
    var lose_feedback_duration = 3500;

    var mouse_sketch = new p5(function( sketch ) {

      var sketchSize = 700;
      var offset = 100;
      var grid_size = sketchSize - offset;
      var blockSize = grid_size/trial.grid_size;
      var imgSize = 0.9*blockSize;
      var frameRate = 6;
      var correct = false;
      var timer_size = 100;
      var timer_proportion = 0.8;
      var feedback_start_time;
      var instructions_color = 0;
      var emphasize_instructions = false;

      mouse = {
        direction: 'right',
        x: 0,
        y: 0,
        show: function(){
          if(!(this.x+1==trial.grid_size & this.y+1==trial.grid_size) & !feedback_period){
            sketch.push();
              sketch.translate(blockSize*(this.x+0.5), blockSize*(this.y+0.5));
              if(this.direction == 'right'){
                sketch.image(this.right, 0, 0, imgSize, imgSize);
              } else {
                sketch.image(this.left, 0, 0, imgSize, imgSize);
              }
            sketch.pop();
          }
        }
      };

      trap = {
        x: trial.grid_size-1,
        y: trial.grid_size-1,
        frames: 0,
        animationTime: 0,
        lose: [],
        show: function(){
          if(stage == 'start' | stage == 'play'){
            this.image = this.set;
          } else if(result == 'lose') {
            if(this.animationTime==0){
              this.image = this.lose[0];
            }
            if(this.animationTime < frameRate*this.lose.length){
              this.animationTime +=1;
            }
            if(Math.floor(this.animationTime/frameRate) > this.frames & this.frames < this.lose.length-1){
              this.frames +=1;
              this.image = this.lose[this.frames];
            }
          } else if(result == 'win'){
            this.image = this.win;
          }
          sketch.push();
            sketch.translate(blockSize*(this.x+0.5), blockSize*(this.y+0.5));
            sketch.image(this.image, 0, 0, imgSize, imgSize);
          sketch.pop();
        }
      };

      sketch.preload = function(){
        mouse.left = sketch.loadImage('img/mouse/mousetrap_mouse_left.png');
        mouse.right = sketch.loadImage('img/mouse/mousetrap_mouse_right.png');
        trap.set = sketch.loadImage('img/mouse/mousetrap_trap_set.png');
        trap.win = sketch.loadImage('img/mouse/mousetrap_trap_win.png');
        for(var i = 1; i<14; i++){
          var index_string;
          if(i<10){
            index_string = '0' + i;
          } else {
            index_string = i;
          }
          trap.lose.push(sketch.loadImage('img/mouse/mousetrap_trap_lose'+index_string+'.png'));
        }
      };

      sketch.setup = function(){
        sketch.createCanvas(sketchSize+1,sketchSize+1);
        sketch.imageMode(sketch.CENTER);
        sketch.frameRate(60);
        // trial_start = Date.now();
      };

      sketch.draw = function(){
        sketch.background(255);
        // timer
        sketch.push();
          sketch.translate(timer_size/2,timer_size/2);
          timer();
        sketch.pop();
        // text
        sketch.push();
          sketch.translate(offset,0);
          feedback();
        sketch.pop();

        // game grid
        sketch.push();
          sketch.translate(offset,offset);
          drawGrid();
          mouse.show();
          trap.show();
        sketch.pop();
      };

      sketch.keyPressed = function(){
        var key = sketch.keyCode;
        switch(stage){
          case 'start':
              if(key == 32){
                stage = 'play';
                timer_started = true;
                timer_start_time = Date.now();
                trial_data[current_attempt].start_time = timer_start_time;
                emphasize_instructions = false;
                instructions_color = 0;
              } else {
                emphasize_instructions = true;
              }
          break;
          case 'play':
              switch(key){
                case 65: // a
                  mouse.direction = 'left';
                  if(mouse.x > 0){
                    mouse.x -= 1;
                  }
                break;
                case 87: // w
                  if(mouse.y > 0){
                    mouse.y -= 1;
                  }
                break;
                case 68: // d
                  mouse.direction = 'right';
                  if(mouse.x==2 & mouse.y==3){
                    endphase();
                  }
                  if(mouse.x + 1 < trial.grid_size){
                    mouse.x += 1;
                  }
                break;
                case 83: // s
                if(mouse.x==3 & mouse.y==2){
                  endphase();
                }
                  if(mouse.y + 1 < trial.grid_size){
                    mouse.y += 1;
                  }
                break;
                default:
                  alert("You only need to use the keys W (up) A (left) S (down) D (right)");
              }
              var move = {x: mouse.x,
                          y: mouse.y,
                          key: key,
                          time: Date.now() - trial_data[current_attempt].start_time};
              trial_data[current_attempt].moves.push(move);
          break;
        }
      };

      function endphase(){
        trial_data[current_attempt].end_time = Date.now();
        trial_data[current_attempt].trial_duration = trial_data[current_attempt].end_time - trial_data[current_attempt].start_time;
        emphasize_instructions = false;
        instructions_color = 0;
        stage = 'feedback';
        if(Date.now() - timer_start_time>trial.cutoff_time){
          result = 'win';
          feedback_string1 = 'Win!';
          feedback_duration = win_feedback_duration;
          points += 1;
          remaining = trial.attempts - current_attempt;
          feedback_string2 = 'Attempts remaining: ' + remaining + '   Points: ' + points;
        } else {
          result = 'lose';
          feedback_duration = lose_feedback_duration;
          feedback_string1 = 'Trapped!';
        }
        trial_data[current_attempt].result = result;
        feedback_start_time = Date.now();
        feedback_period = true;
      }

      function drawGrid(){
        sketch.push();
          sketch.stroke(170);
          for(var i = 0; i < trial.grid_size; i++){
            for(var j = 0; j < trial.grid_size; j++){
              sketch.rect(i*blockSize,j*blockSize,blockSize,blockSize);
            }
          }
        sketch.pop();
      }

      function feedback(){
        sketch.fill(0);
        sketch.textSize(20);
        if(stage == 'start' | stage == 'feedback'){
          sketch.push();
            if(emphasize_instructions){
              instructions_color = instructions_color % 255 + 15;
            }
            sketch.fill(instructions_color);
            sketch.text(feedback_string1, 10, 10, sketchSize-offset-10, offset);
          sketch.pop();
        }
        sketch.text(feedback_string2, 10, 30, sketchSize-offset-10, offset);
      }

      function timer(){
        sketch.push();
          sketch.rotate(-1*sketch.PI/2);
          switch(stage){
            case 'feedback':
                time_elapsed = Date.now() - feedback_start_time;
                time_remaining = feedback_duration - time_elapsed;
                percent_remaining = time_remaining/feedback_duration;
                if(percent_remaining>0){
                  switch(result){
                    case 'win':
                      sketch.stroke(0, 230, 0);
                    break;
                    case 'lose':
                      sketch.stroke(230, 0, 0);
                    break;
                    case 'timeout':
                      sketch.stroke(200);
                    break;
                  }
                  sketch.strokeWeight(2);
                  sketch.ellipse(0, 0, timer_proportion*timer_size*percent_remaining, timer_proportion*timer_size*percent_remaining);
                } else {
                  endTrial();
                }
            break;

            case 'play':
                time_elapsed = Date.now() - timer_start_time;
                time_remaining = trial.max_duration - time_elapsed;
                percent_remaining = time_remaining/trial.max_duration;
                if(percent_remaining>0){
                  var red = 255-percent_remaining*255;
                  sketch.stroke(100);
                  sketch.strokeWeight(1);
                  sketch.ellipse(0, 0, timer_proportion*timer_size, timer_proportion*timer_size);
                  sketch.stroke(red, 0, 0);
                  sketch.strokeWeight(8);
                  sketch.arc(0, 0, timer_proportion*timer_size, timer_proportion*timer_size, 0, percent_remaining*2*sketch.PI);
                } else {
                  feedback_period = true;
                  emphasize_instructions = false;
                  instructions_color = 0;
                  stage = 'feedback';
                  result = 'timeout';
                  feedback_string1 = "Time's up!";
                  feedback_duration = lose_feedback_duration;
                  feedback_start_time = Date.now();
                  trial_data[current_attempt].end_time = feedback_start_time;
                  trial_data[current_attempt].trial_duration = trial_data[current_attempt].end_time - trial_data[current_attempt].start_time;
                  trial_data[current_attempt].result = result;
                }
            break;
          }
          sketch.pop();
        }

    }, 'sketch-container');


    function endTrial(){
      if(current_attempt < trial.attempts - 1){
        current_attempt +=1;
        mouse.x = 0;
        mouse.y = 0;
        stage = 'start';
        result = null;
        trap.frames = 0;
        trap.animationTime = 0;
        feedback_period = false;
        // trial_start = Date.now();
        trial_data[current_attempt].start_time = Date.now();
        feedback_string1 = start_message;
        remaining = trial.attempts - current_attempt;
        feedback_string2 = 'Attempts remaining: ' + remaining + '    Points: ' + points;
      } else {
        mouse_sketch.remove();
        trial_data.task_end_time = Date.now();
        trial_data.task_duration = trial_data.task_end_time - trial_data.task_start_time;
        display_element.innerHTML = '';
        console.log(trial_data);
        jsPsych.finishTrial(trial_data);
      }

    }


    //jsPsych.finishTrial(trial_data);

    // start/end trial

    $( document ).ready(function() {
      // trial_start = Date.now(); // tracking each separate trial
      trial_data.task_start_time = Date.now(); // tracking overall time
      $('#sketch-container').focus();
    });




  };

  return plugin;
})();
