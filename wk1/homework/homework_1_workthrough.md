---
title: "Week 1 - homework 1 workthrough"
output: 
  html_document:
    toc: true
    toc_float: true
    toc_depth: 2
---

# Outline of the problem

- You have `example.pdf` and a plain html file, and you need to style the html file to look close(ish) to the pdf

- Notice how the body of the html has three divisions, represented with 3 `<div>` tags:
```
<body>
  <div>...title...</div>
  <div>...main content...</div>
  <div>...contact info...</div>
</body>
```
  
- So this task has several components:
  - Making things the right size/font/color
  - Marking things appear in the correct position on the page
  - Let's deal with the last one first...
  
# Things to watch out for

- It's hard to remember just how to format everything (with `[]{};:,`)
- But if you copy+paste carefull AND double check that these small details match the thing you're copying, you'll probably be fine
- In particular, watch out for `;` separating css properties!!
  
# Working out how to make divs appear on the left/right

- As with most of these tasks, the anwser is: you need to google it (e.g., 'html div side by side')
- This brings up (among other things) [https://coder-coder.com/display-divs-side-by-side/](https://coder-coder.com/display-divs-side-by-side/)
  - This tells you there are several options. I'll pick the one called 'flexbox method'
  - It gives you some example code, which has both html (content/structure) and css (styling)
  - The HTML goes in the `<body>` of your code and the css goes inside the `<style>`
  - Obviously, ignore bits that are just there for the example like the magenta/green colors, but you'll need to add the other class info
  
HTML
```
<div class="flex-container">

  <div class="flex-child magenta">
    Flex Column 1
  </div>
  
  <div class="flex-child green">
    Flex Column 2
  </div>
  
</div>
```

CSS
```
.flex-container {
    display: flex;
}

.flex-child {
    flex: 1;
    border: 2px solid yellow;
}  

.flex-child:first-child {
    margin-right: 20px;
} 
```
  
One thing to note from the above (that may not be immediately obvious, but is discussed on the above link) is that, in order to position two divs in this way, they need to have a parent div. So one step is to update `example.html` so that it now has this structure:

```
<body>
  <div>...title....</div>
  <div> <--- This is the parent div we have added
    <div>...main content...</div>
    <div>...contact info...</div>
  </div>
</body>

```

So now we'd have something like:

```
<style>
.flex-container {
    display: flex;
}

.flex-child {
    flex: 1;
}  

.flex-child:first-child {
    margin-right: 20px;
} 
</style>
<body>
<div>...title</div>
<div class="flex-container"> 
    <div class="flex-child">...main content...</div>
    <div class="flex-child">...contact info...</div>
</div>
</body>
```

To see where this has got us so far, you can look at `homework_1_stage1.html`. 

One thing: in the main content it talks about divs, using a `<div>` tag as an example. I replaced that with plain text `div` so that the `<div>` tag didn't mess with our structure

# Adjusting the width of the columns

- Currently, both columns are 50% of the width. We want a wide left column for the main text and narrower right column for the contact info. 

- So google 'html flex width'
- This brings up (among other things) [https://css-tricks.com/snippets/css/a-guide-to-flexbox/](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- This illustrates the various concepts involved, but look for the 'flex' property
- It looks like we need to just change the flex property for each child, and to do that, we can just give each of them a different class and then style it.

```
<style>
.flex-container {
    display: flex;
}

.flex-child.main {
    flex: 6
} 

.flex-child.contact {
    flex: 1
} 
</style>
<body>
<div>...title</div>
<div class="flex-container"> 
    <div class="flex-child main">...main content...</div>
    <div class="flex-child contact">...contact info...</div>
</div>
</body>
```

Now everything is in the right place. This is illustrated in `homework_1_stage2.html`, which also starts adding the following styling
But it still looks pretty ugly. 

# Changing font

- Let's start with the font. The example uses a sans serif font, but the current code is appearing with serifs. 
- So google 'css sans serif'
- This brings up (among other things) [https://css-tricks.com/sans-serif/](https://css-tricks.com/sans-serif/)
- which says you can add a property `font-family` to the body to make the whole body sans serif

```
<style>
  body {
    font-family: Sans-Serif;
  }
</style>
```

# Adding paragraphs

The main body is just a lump of text. We need to divide it into paragraphs with `<p>` tags. While we're at it, let's make the main title a nice big heading (`<h1>`) and make the title of the main text a bit bigger too (`<h2>`) and the titel of the contact section a smaller heading (`<h3>`)

Looking much better (still in `homework_1_stage2.html`)

# Adding colors/tweaking sizes

- I'm going to change the colors now. I'm not aiming for an exact match. More just to illustrate how to go about it. 

- The main heading has a blue background and also a dark blue border and font in the same dark blue

- Some of the contact info is in a lighter blue

- google `html color` to get started, and then `css background` or `css border` to discover the right properties for those aspects of the look

- This might lead you to [https://htmlcolorcodes.com](https://htmlcolorcodes.com) to pick colors (e.g., if you move the sliders to get a color you like, it will give you a code starting `#` that you can just copy+paste)
- And will let you know the relevant properties are just `background` and `border`, but also that `border` can be specific with something like the following to indicate the thickness, line type and color of the border. 

```
<style>
 h1 {
    border: 1px solid black;
 }
<style>
```

Based on this googling, I've made some changes in `homework_1_stage3.html`

# Adding margins

- Finally, notice that the main heading has a margin around it, and the text also has a margin (it's not on the complete left/right of the page)
- google 'html margin' or 'css margin'
- after a bit of trial and error, you'll probably see that this won't quite do it (especially for the main heading)
- but more googling will probably lead you do 'padding'
- I've added margins and padding to `homework_1_stage4.html`

# Adding links

- Finally, we want to make the contact links clickable
- google 'html link' and it will lead to you info about the `<a>` tag and its `href` property
- copy+pasting those into your code and tweaking them will lead to the changes in `homework_1_stage4.html`
- the same googled tutorials will explain the added bits like `target="_blank"` or `href="mailto:address"`

# Wrapping up

- We haven't matched the colors/sizes/fonts exactly. But close enough. 
- If you want to make this better, you could look at the other info on the [https://css-tricks.com/snippets/css/a-guide-to-flexbox/](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) page above to keep the columns looking nice when the browser window is resized. 