---
title: "Week 2 - homework workthrough"
output: 
  html_document:
    toc: true
    toc_float: true
    toc_depth: 2
---

# Outline of the problem

- You're asked to copy a previous experiment html file (to use as a template)
- And then add a new trial to it, after looking at the various kinds of trial on [https://www.jspsych.org](https://www.jspsych.org) under "plugins"

- As in previous weeks, I'll do this stage by stage and label these (e.g., `homework_stage1.html`) in the text below.

# Copy the template

- Remember, you're seldom expected to start coding a project from scratch
- Usually, you'll just use a previous working example as a template (or see if you can find one online)

- So let's just copy+paste exercise `exercise_3_done.html` into this homework folder and rename it something like `homework.html` (it's fine that this is a bit uninformative because we know *which* homework it is due to being in the folder `wk2/homework` - it's a good idea to use directories to help structure your files). 

- To help declutter, I've deleted the previous trials. I also renamed `my_timeline` to `timeline` because it's shorter (&rarr; `homework_stage1.html`)

# Pick some plugins to try out

- Browsing through the jsPsych plugins, the following look interesting:
  - https://www.jspsych.org/plugins/jspsych-html-keyboard-response/
  - https://www.jspsych.org/plugins/jspsych-image-slider-response/

- These differ in what the simulus is (some html vs an image) and how you respond (with the keyboard vs with a slider)
- Read the docs carefully (especially the example at the bottom!)

# Let's start with the html + keyboard trial

- Again, we can just copy+paste the example from the above documentation and tweak it
- One thing to remember (mentioned in the lecture): 
  - there are lots of types of trial, and jsPsych doesn't load all of them (it's good to keep things trimmed down)
- So we need to load the relevant plugin with the following in the header

```
<script src="../../jspsych/plugins/jspsych-html-keyboard-response.js"></script>
```

The `../../` are just telling you where the file is, relative to the current folder (you need to backup `../` twice to get to the jspsych folder, hence the repetition). Google "relative path" or "relative folder path" to learn more.

(&rarr; `homework_stage2.html`)

- Ok, so this works
- You can leave this there, or tweak it a bit (e.g., changing the question) or tweak it a lot. This involves imagination. For the sake of example, let's have the participant hit a key depending on the color of the text (a *bit* like a Stroop task - google it) 

- Next you need to think of what has to go into such a task:
  - A list of colors: `var colors = ['red', 'yellow', 'blue', 'green']`;
  - Update the key choices
  - A way to make the font appear in those colors
  - A way to make the stimulus text be one of those colors
  - A way to randomize trials, making some congruent and some incongruent
  - Optionally, after the trial check if they were correct
  
## Starting out with colors

- How do we make the stimulus appear in these colors? It's a matter of styling, so google `html color` or `css color`
- From this it looks like we can add style like this: 
```
<p style="color:red">hello!</p>
```

- So let's just check we can make it appear in a given color (before we worry about setting up randomized congruent/incongruent trials)
- I've updated the options and prompt, and made the first letter bold to make their choices clear:
```
prompt: "<p>Press the key that matches the color of the word (<b>r</b>ed, <b>b</b>lue, <b>y</b>ellow, <b>g</b>reen) </p>"
```

- &rarr; `homework_stage3.html`

## Ok, now we need to add some randomization

- At this point, you can decide to manually create all trials (i.e., literally typing the color in the `style` attribute and the `<p>` tag) 
- e.g. 
```
trial1 = {}
trial2 = {}
trial3 = {}
```

- But if there are lots of trials, this is a pain. So let's try automate part of this. 
- The aim is to create different combinations of font color and text name, so google `jspsych combination` which will take you to
[https://www.jspsych.org/core_library/jspsych-randomization/](https://www.jspsych.org/core_library/jspsych-randomization/)
- Reading through this, it looks like  `jsPsych.randomization.factorial` may help
- Based on the examples there, the following defines our colors, and then says we need to get combinations of font color and stimulus text (both drawn from the list of colors)

```
var colors = ['red', 'blue', 'yellow', 'green']
var factors = {
  font_color: colors,
  stimulus_text: colors
}
```

  - And then the following is how we create combinations of these (as the documentation says, the `1` means repeat each combination once)
  - Always console.log to see how it looks (and open the javascript console in your browser)
  
```
var full_design = jsPsych.randomization.factorial(factors, 1);
console.log(full_design)
```

(&rarr; `homework_stage4.html`)

Looks ok!

## Creating the trials automatically

- Ok, now we need to iterate over this array (work through it, doing something with each element)
- We'd talked about using `array.forEach()` for this. The input to the `forEach()` method is a function where the input is the element/index pair

```
full_design.forEach(function(element, index){...})
```

- Always start small, so let's just check we can get the right element/index when we do this
```
full_design.forEach(function(element, index){
  console.log(element, index)
})
```

(&rarr; `homework_stage5.html`)


- So it looks like each element is an object, e.g. `{font_color: "green", stimulus_text: "blue"}` and each index just counts from 0 to 15. Sounds good!
- We need to be able to get the properties of the element, which we learned previously can be done as follows:

```
element.font_color
element.stimulus_text
```

- So now we just need to incorporate this into our stimulus html code in 2 places: the style and the content
- We're starting from something like: 

```
'<p style="color:red">red</p>'
```

- So we just need to replace the first 'red' with `element.font_color` and the second with `element.stimulus_text`
- Just to check how not to do it (which might be your first guess), this doesn't work because it would literally make the content of the stimulus be the word `element.stimulus_text`

```
'<p style="color:element.font_color">element.stimulus_text</p>'
```

- Rather we need to concatenate some strings using `'string1'+'string2'+'string3'`
  - So the following starts out with the string `'<p style="color:'`
  - Then it adds the `element.font_color`
  - Then another string `'">'`
  - Then it adds `element.stimulus_text`
  - Then finishes with `'</p>'`
  - Opening this in Atom helps highlight the bit in different colors 
  - As usual, add a console log to help check

```
'<p style="color:'+element.font_color+'">'+element.stimulus_text+'</p>'
```

(&rarr; `homework_stage6.html`)

- Ok, now we can just use this to create trials! I've just copy+pasted the `keyboard_response` trial into the `forEach` loop and given its `stimulus` property the value of the new string we've created

```
var stim_string = '<p style="color:'+element.font_color+'">'+element.stimulus_text+'</p>'
console.log(stim_string)
var keyboard_response = {
      type: 'html-keyboard-response',
      stimulus: stim_string,
      choices: ['r', 'b', 'g', 'y'],
      prompt: "<p>Press the key that matches the color of the word (<b>r</b>ed, <b>b</b>lue, <b>y</b>ellow, <b>g</b>reen) </p>"
};
```

And don't forget to add the trial to the timline once it's created. 

```
var stim_string = '<p style="color:'+element.font_color+'">'+element.stimulus_text+'</p>'
console.log(stim_string)
var keyboard_response = {
      type: 'html-keyboard-response',
      stimulus: stim_string,
      choices: ['r', 'b', 'g', 'y'],
      prompt: "<p>Press the key that matches the color of the word (<b>r</b>ed, <b>b</b>lue, <b>y</b>ellow, <b>g</b>reen) </p>"
};
timeline.push(keyboard_response)
```

(still in &rarr; `homework_stage6.html`)

## Randomizing again

- Currently it's going through all the trials in order. We need to shuffle them. We're learning about this this week

```
var full_design = jsPsych.randomization.factorial(factors, 1);
var full_design_shuffled = jsPsych.randomization.shuffle(full_design)

full_design_shuffled.forEach(...)
```

(still in &rarr; `homework_stage7.html`)


## Optional extensions

- Make the stimulus in a bigger font
- The yellow is hard to see. What can be done?
- Can you check (when it's being created) whether each trial is congruent or not?
- Can you check (using the `on_finish` propert we're learning about this week) if the participant was correct or not?
- Can you give the participant feedback based on how well they're doing?
