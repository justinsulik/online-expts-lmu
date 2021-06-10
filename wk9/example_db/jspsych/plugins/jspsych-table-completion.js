/*
 * Plugin for collecting common demographic variables
 * If adding any more, ensure that the relevant input tag has class="jspsych-demographics answer"
 *store both ID and name of previous data

- to do: auto parse column headers into vals

 LOAD LODASH
 */

jsPsych.plugins["table-completion"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "table-completion",
    parameters: {
      add_new: {
        type: jsPsych.plugins.parameterType.BOOL, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: false,
        description: "Whether new rows can be added"
      },
      row_values: {
        type: jsPsych.plugins.parameterType.OBJECT,
        array: true,
        default: [],
        description: "Values to go in the first column. Object with keys id, row_name"
      },
      column_headers: {
        type: jsPsych.plugins.parameterType.STRING,
        array: true,
        default: null,
        description: "Names of columns"
      },
      column_icons: {
        type: jsPsych.plugins.parameterType.BOOL,
        default: false,
        description: "Whether to include header icons"
      },
      column_vals: {
        type: jsPsych.plugins.parameterType.STRING,
        array: true,
        default: null,
        description: "Short names for variables of columns"
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
        description: "Preamble for the page"
      },
      instructions: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
        description: "More detailed instructions"
      },
      response_validation: {
        type: jsPsych.plugins.parameterType.STRING,
        default: 'none',
        description: "If 'force_column', force >=1 response per non-empty line; if 'force_row' force response for all rows with checks; if 'force_both' do both."
      },
      dependencies: {
        type: jsPsych.plugins.parameterType.STRING,
        default: '',
        description: "In format 'column1>column2', selecting column1 will automatically select column 2."
      },
      highlighting: {
        type: jsPsych.plugins.parameterType.STRING,
        default: 'column',
        description: "Whether alternative rows or columns are highlighted."
      },
      new_row_placeholder: {
        type: jsPsych.plugins.parameterType.STRING,
        default: 'Add a name',
        description: "Text input placeholder for new rows."
      },
      select_one: {
        type: jsPsych.plugins.parameterType.BOOL,
        default: false,
        description: "If true, only one choice per row; otherwise as many as apply."
      },
      submit: {
        type: jsPsych.plugins.parameterType.STRING,
        default: 'Continue',
        description: "Text for 'submit' button"
      },
      column_reminder: {
        type: jsPsych.plugins.parameterType.STRING,
        default: null,
        description: "Text for reminder to choose a value"
      },
      first_wider: {
        type: jsPsych.plugins.parameterType.INT,
        default: 1,
        description: "ratio of how much longer first column should be than others"
      }
    }
  };

  plugin.trial = function(display_element, trial) {

    // data saving
    var trial_data = {own_rows: [], responses: []};
    var start_time;
    var dependencies = {};
    var column_number = trial.column_headers.length;

    var column_vals;
    if(trial.column_vals){
      column_vals = trial.column_vals;
    } else {
      column_vals = _.range(0, column_number);
    }

    var css = '<style>';
    css += '.check-box {width: 15px; height: 15px; margin: auto; cursor: pointer;}';
    css += '.reminder {display: none}';
    css += '.reminder.problem {display: inline-block}';
    css += 'tr {display: table; border: 1px solid transparent}';
    css += 'tr:hover {border: 1px solid #005597;}';
    css += 'tr.problem {border: 1px solid red;}';
    css += 'td {vertical-align: middle;}';
    css += '.cell.main {text-align: left; padding: 8px 2px; }';
    css += '.header-icon {padding-top: 2px; width: 60%}';
    css += '.cell.highlight {background-color: #daedf2}';
    css += '.check-table {border-collapse: collapse}';
    css += '.cell.header {border-top: 1px solid black;border-bottom: 1px solid black;}';
    css += '#add-button {font-size: 1.8em; display: inline-block; font-weight: 900; color: #348ee3; width: 28px; border: 1px solid #005597; border-radius: 50px; margin-left: 5px; cursor: pointer}';
    css += '#final-row {border-top: 1px solid grey; border-bottom: 1px solid grey;}';
    css += '.opt-out {margin-bottom: 10px;}';
    css += '.problem {color: red}'
    css += '</style>';

    var html = '';
    if(trial.preamble){
      html += '<div class="preamble">'+trial.preamble+'</div>';
    }
    if(trial.instructions){
      html += '<div class="instructions">'+trial.instructions+'</div>';
    }
    if(trial.column_reminder){
      html += '<div id="column-reminder" class="reminder instructions">'+trial.column_reminder+'</div>';
    }
    if(trial.opt_out){
      html += '<div class="opt-out"><input id="optout" type="checkbox" value="optout"/><label for="optout">'+trial.opt_out+'</label></div>';
    }
    if(trial.dependencies.length>0){
      var reg = /([a-zA-Z0-9_]+)>([a-zA-Z0-9_]+)/;
      var matches = trial.dependencies.match(reg);
      if(matches.length>1){
        var match1 = matches[1];
        var match2 = matches[2];
        if(column_vals.indexOf(match1) ==-1 || column_vals.indexOf(match1)==-1){
          console.log('Error in trial.dependencies: check you provided appropriate column_vals!');
        }
        dependencies[match1] = match2;
      }
    }

/***
Table
***/

    var table = '<table class="check-table" style="width:100%">';
    var total_cols = column_number - 1 + trial.first_wider; // account for wider first column (deleting its unadjusted value as 1)
    var base_width = 100/total_cols;
    var first_column_width = trial.first_wider*base_width;// allow first column to be wider

    // header row
    var header_cells = _.reduce(trial.column_headers, function(acc, header, i){
      var class_string = 'cell header';
      var valign = 'middle';
      if(i==0){
        class_string += ' main';
        column_width = first_column_width;
      } else {
        column_width = base_width;
      }
      if(i%2==1 && trial.highlighting=='column'){
        class_string += ' highlight';
      }
      column_width = Math.round(100*column_width)/100;
      var icon_string = '';
      if(trial.column_icons && i != 0){
        header_height = 40;
        icon_string += '<div style="width:70%; margin: auto; position: relative;">';
        if(column_vals){
          if(column_vals[i]){
            if(column_vals[i]!='other'){
              valign = 'bottom';
              var icon_file_string = 'img/icons/' + column_vals[i] + '.png';
              icon_string += '<div ><img class="header-icon" src="'+icon_file_string+'"></div>';
              icon_string += '</div>';
            }
          }
        }
      }

      header_string = '<div>'+header+'</div>';
      acc += '<th valign="'+valign+'" class="'+class_string+'" style="width:'+column_width+'%">'+header_string+icon_string+'</th>';
      return acc;
    }, '');
    var header_row = '<thead style="width:100%"><tr style="width:100%">'+header_cells+'</tr></thead>';

    // add in prefilled/given rows
    var table_rows = '<tbody style="width:100%">';
    if(trial.row_values){
      trial.row_values.forEach(function(d,i){
        var row_id = d.id;
        var row_val = d.row_name;
        var first_col = add_first_column(row_id, row_val, i, 'old');
        var other_cols = add_columns(row_id, i);
        table_rows += first_col + other_cols;
      });
    }

    if(trial.add_new){
      table_rows += add_new_row() + last_row();
    }

    table_rows += '</tbody>';
    table += header_row+table_rows;
    table += '</table>';

    var submit = '<div>'+
                  '<br><button type="button" id="submit" style="margin-bottom:25px">'+trial.submit+'</button>'+
                  '</div>';

    display_element.innerHTML = css+html+table+submit;

/***
Inputs/interactions
***/

    $('#add-button').on('click', function(e){
      var new_row = add_new_row();
      $('#final-row').before(new_row);
    });

    $('table').on('click', function(e){
      var clicked_on = e.target.id;
      console.log(clicked_on)
      if(!clicked_on){
        if($(e.target).hasClass('cell clickable')){
          $(e.target).children('input').trigger('click');
        }
      }
      // in case any highlighted problem rows have been clicked, remove their highlighting
      $(':checked').each(function(i,d){
        var id_str = $(d).attr('id');
        var data = id_str.match('check-([_a-zA-Z0-9]+)-([_a-zA-Z0-9]+)');
        var row_id = data[1];
        $('#row-'+row_id).removeClass('problem')

      });
    });

    $('input[type=checkbox]').on('click', function(e){
      if(this.id=='optout'){
        if(this.checked){
          $('table').css({opacity: 1.0}).animate({opacity: 0}, 200).slideUp();
        } else {
          $('table').slideDown().css({opacity: 0}).animate({opacity: 1}, 200);
        }
      }
      var cell_id = this.id;
      var reg = cell_id.match(/check-([0-9a-zA-Z_]+)-([0-9a-zA-Z_]+)/);
      var checked1 = this.checked;
      if(reg){
        if(reg.length>1){
          var row_id = reg[1];
          var col1 = reg[2];
          if(trial.select_one){
            // set all other columns to unchecked
            $('input[type=checkbox]').each(function(i, d){
              var other_cell_id = d.id;
              var check_row = new RegExp('check-'+row_id+'-');
              var same_row = check_row.test(other_cell_id);
              if(same_row && other_cell_id!=cell_id){
                $('#'+other_cell_id).prop("checked", false);
              }
            });
          } else if (column_vals.indexOf(col1)!=-1 && dependencies[col1]){
            // handle dependencies
            var col2_name = dependencies[col1];
            var checkbox2 = $('#check-'+row_id+'-'+col2_name);
            checkbox2.prop("checked", checked1);
          }
        }
      }
    });

    $('#submit').on('click', function(e){
      var response_data = getResponses();
      var validation = validateResponses(response_data.responses);
      if(response_data.optout || validation.ok){
        endTrial(response_data);
      } else {
        highlightProblems(validation, response_data.responses);
      }
    });

    $('input[type="text"]').on('keydown', function(e){
      if(e.keyCode==13){
        this.blur();
      }
    });

/***
data handling + endTrial
***/

    function getResponses(){
      var responses = {};
      var optout = false;
      trial.row_values.forEach(function(d,row_index){
        var row_id = d.id;
        var row_name = d.row_name;
        responses[row_id] = {name: row_name, row_index: row_index, choices: []};
      });
      $(':text').each(function(row_index,d){
        var name = $(d).val();
        var id_str = $(d).attr('id');
        var id = id_str.match('new-row-([0-9]+)')[1];
        responses[id] = {name: name, row_index: row_index, choices: []};
      });

      $(':checked').each(function(i,d){
        var id_str = $(d).attr('id');
        if(id_str == 'optout'){
          optout = true;
        } else {
          var data = id_str.match('check-([_a-zA-Z0-9]+)-([_a-zA-Z0-9]+)');
          var row_id = data[1];
          var col_id = data[2];
          responses[row_id].choices.push(col_id);
        }
      });
      var response_data = {responses: responses, optout: optout};
      return response_data;
    }

    function validateResponses(responses){
      var validation = {ok: true, problems: {rows: [], columns: []}};
      Object.keys(responses).forEach(function(response_id){
        var response_data = responses[response_id];
        var row_ok = response_data.name.length>0;
        var column_ok = response_data.choices.length>0;
        if(trial.response_validation == 'force_row' && !row_ok){
          validation.ok = false;
          validation.problems.flag_row = true;
        }
        if(trial.response_validation == 'force_column' && !column_ok && row_ok){ // last part is to ignore rows with blank text inputs
          validation.ok = false;
          validation.problems.flag_column = true;
          validation.problems.rows.push(response_id);
        }
        if(trial.response_validation == 'force_both' && row_ok != column_ok){
          validation.ok = false;
          if(!column_ok){
            validation.problems.flag_column = true;
          }
          validation.problems.rows.push(response_id);
        }
      });
      return validation;
    }

    function highlightProblems(validation, responses){
      $('.problem').each(function(i,d){
        $(d).removeClass('problem');
      });
      $("html,body").animate({scrollTop: 0}, 100);
      $('tbody').scrollTop(0);
      validation.problems.rows.forEach(function(row_id){
        $('#row-'+row_id).addClass('problem');
        if($('#row-'+row_id).has('input[type="text"]').length){ //.length needed to get false (if lack children), otherwise returns something truthy even if no child
          $('#row-'+row_id).parent().addClass('problem');
        }
      });
      if(validation.problems.flag_column){
        $('#column-reminder').addClass('problem');
      } else {
        $('#column-reminder').removeClass('problem');
      }
    }

    function endTrial(response_data){
      var end_time = Date.now();
      var rt = end_time - start_time;
      trial_data.rt = rt;
      trial_data.responses = JSON.stringify(response_data);

      // kill any remaining setTimeout handlers/listeners
      jsPsych.pluginAPI.clearAllTimeouts();
      $('#add-button').off();
      $('table').off();
      $('#submit').off();
      $('input[type="text"]').off();
      $('input[type="checkbox"]').off();

      // clear screen
      display_element.innerHTML = '';
      console.log(trial_data);
      jsPsych.finishTrial(trial_data);
    }

/***
Helper functions
***/

    function add_columns(row_id, row_index){
      var other_cols = '';
      var check_box = '';
      _.range(1,column_number).forEach(function(i){
        var class_string = 'cell clickable ';
        if(row_index%2==1 && trial.highlighting=='row'){
          class_string += 'highlight';
        }
        var id_str = 'check-'+row_id+'-'+column_vals[i];
        check_box = '<input type="checkbox" class="check-box response" id="'+id_str+'">';
        if(i%2==1 && trial.highlighting=='column'){
          class_string += 'highlight';
        }
        if(row_id=='final'){
          other_cols += '<td style="width:'+base_width+'%"></td>';
        } else {
          other_cols += '<td class="'+class_string+'" style="width:'+base_width+'%">'+check_box+'</td>';
        }
      });
      other_cols += '</tr>';
      return other_cols;
    }

    function add_first_column(row_id, row_value, row_index, type){
      var first_col;
      var class_string = 'cell main ';
      if(row_index%2==1 && trial.highlighting=='row'){
        class_string += 'highlight';
      }
      if(type=='old'){
        first_col = '<tr style="width:100%">';
        first_col += '<td class="'+class_string+'" id="row-'+row_id+'" style="width:'+first_column_width+'%">'+row_value+'</td>';
      } else {
        first_col = '';
        first_col += '<tr style="width:100%">';
        first_col += '<td class="'+class_string+'" id="row-'+row_id+'" style="width:'+first_column_width+'%">';
        first_col += '<input id="new-row-'+row_id+'" name="new-name-'+row_id+'" type="text" placeholder="'+trial.new_row_placeholder+'" size="10">';
        first_col += '</td>';
      }
      return first_col;
    }

    function latest_row(){
      new_row = trial_data.own_rows.length + trial.row_values.length;
      trial_data.own_rows.push({row: new_row});
      return new_row;
    }

    function add_new_row(){
      var row_id = latest_row();
      var row_index = row_id + trial.row_values.length + 1;
      var first_col = add_first_column(row_id, null, row_index, 'new');
      var other_cols = add_columns(row_id, row_index);
      return first_col+other_cols;
    }

    function last_row(){
      var row_id = 'final';
      var add_button = '<td><div id="add-button">+</div></td>';
      var first_col = '<tr id="final-row" style="width:100%">'+add_button+'</td>';
      var other_cols = add_columns(row_id);
      return first_col + other_cols;
    }

    $( document ).ready(function() {
      start_time = Date.now();
      $("html,body").animate({scrollTop: 0}, 100);
      $('tbody').scrollTop(0);
    });

  };

  return plugin;
})();
