---
title: "Week 1 - homework 2 workthrough"
output: 
  html_document:
    toc: true
    toc_float: true
    toc_depth: 2
---

# Outline of the problem

- You're given a template (`homework_2.html`) that contains some basic html, as well as instructions in the `<script>` area
- Make the button do something different on odd and even clicks
- The main thing is to do this step-by-step: how about by just trying to get the button to do *anything* whenever it's clicked (never mind odd and even)

# Making the button do something on clicks

- If you refer to the relevant lecture material/exercises, it gives some examples. You'll need:
- A function (to do something)
- An element in the body (so that *that element* will do something)
- An event (so that it will do something when you do a particular thing, like click on it)

Here are some examples from the `exercise_5_done.html` (I've deleted the extraneous bits and tweaked the comments)
```
    // what do you want to do?
    function do_something(click_event){
      click_event.target.style.backgroundColor = "red"
    }

    // what element will do something?
    var button = document.getElementById("my-button")
    
    // when will it do something? On clicking...
    button.onclick = function(event){
      do_something(event)
    }
```

If you copy+paste this as is into `homework_2.html` then something should happen on a click: the button changes color. (Note: the ID in `document.getElementById()`) needs to match the ID in the html `<button id="my-button">Click!</button>`

I have this working in `homework_2_stage1.html`

# Keeping track of clicks

Ultimately you want it to do something different on odd/even clicks. But before you can do that, you need to have the script keep track of odd/even clicks in the first place. And before you can do that, you need to have the script keep track of how many clicks there are. 

Keeping track of information is what variables are for. So you'll need something like the following. I've set it to 0 because at the start, there have been no clicks. 

```
var click_count = 0
```

Next we want to increase this count every time the button is clicked. Google 'js increase number by 1`. It will lead you to pages like [https://codeburst.io/javascript-increment-and-decrement-8c223858d5ed](https://codeburst.io/javascript-increment-and-decrement-8c223858d5ed) which tell you that the code is:

```
click_count++
```

But the next question is where to put these? Since they are about what happens when we click (what happens = function, so the function `do_something`) we might put them in there. To check if things are working, use a `console.log()` (always do this! And open the javascript console so you can see what's being printed there...)

```
    function do_something(click_event){
      var click_count = 0
      click_count++
      console.log(click_count)
      click_event.target.style.backgroundColor = "red"
    }
```

BUT if you try this (`homework_2_stage2.html`) you'll see that it never increases beyond 1! So something is not working...

# Fixing the click tracker

Think about what's happening:

- The button is clicked
- On the click event, the function `do_something` is being run
- Each time it is run, it just running the code inside it
- This code includes setting `var click_count = 0`
- So it's resetting to 0 on every click, then incrementing once at `click_count++`

In other words, we need to put `var click_count = 0` somewhere where the `do_something` function can't reset it. Try putting it in the main part of the `<script>` (see `homework_2_stage3.html`). Now, it seems to be increasing on each click. It's working!

# Checking if a condition is met

In our `do_something` function we need to add some logic, including:
- Check IF something is the case
- So let's start with the IF part before we worry about the IF odd vs even part

Google "js if" and it will tell you the IF logic looks something like 
```
if(condition){...do this if condition is true...}else{...do this if condition is false...}
```

Which is often formatted something like the following (though this is personal preference) 

```
if( condition ){
  ...do this if condition is true...
  } else {
  ...do this if condition is false...
  }
```

Always start simple. So before trying to have the `condition` check if something is even/odd, let's check we have the basic `if()` working by doing something simpler, like `if( click_count > 3 )`

Remember: use lots of `console.log()` to check something is working. If you try to get too fancy with your commands too soon, you won't know if the problem is in the `if()` part or in the `...do this...` part. 

So I've added a simple `if()` with some `console.log` to `homework_2_stage3.html`, which should now print "many clicks" or "few clicks" in the console depending on the condition `click_count > 3 `

# Checking if the number is odd or even

Finally, we need to make different things happen on the odd/even clicks. You could google `js odd even` or `js divisible by 2`. This could lead you to a page such as [https://stackoverflow.com/questions/2821006/find-if-variable-is-divisible-by-2](https://stackoverflow.com/questions/2821006/find-if-variable-is-divisible-by-2) which contains the code:

```
variable % 2 === 0  
```

Further googling/exploration will tell you that `%` just gives you the remainder of a division, so this just checks if, when you divide by 2, the remainder is 0 (which will be true for even numbers). 

So I've just added the above code to the `if()` statement in `homework_2_stage4.html` (obviously, replacing `variable` with our actual variable name `click_count`). 

I've also decided that the thing I want to do on odd/even clicks is just have different colors of the button in question, so I've just moved the existing `click_event.target.style.backgroundColor = "red"` command to the even condition, and copy+pasted it, changing the color, in the odd condition. 

Finally, I have added comments (like `// if even` or `// if odd`) to keep track of these conditions. 

# Final advice
- Start small/simple
- Use lots of console.logs
- Include comments to keep track of things
- Google the error message