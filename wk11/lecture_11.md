---
title: "Online experiments - lecture 11"
author: Justin Sulik
date: 24/06/21
output: 
  ioslides_presentation:
    widescreen: true
    smaller: true
---

## Outline

- Theoretical: Language
- Practical: adding animations to studies
 
## Philosophy of language

- How is it that a name like "Aristotle" refers to a particular individual?

- Two main theories: Descriptivist vs Causal-History

- Intuitions seem to be on the side of the latter

- However:
  1. Machery et al. (2004): this may just be an effect of Western culture (and associated thinking styles)
  2. Martí (2009): no, they were measuring the wrong thing...

- We're going to delve into this *just enough* to discuss the experimental design

## Descriptivist

- Competent speakers associate a description with a proper name (e.g., Alexander the Great is the guy who...)

- Something is the referent of a proper name if it uniquely/best matches that description

- What is appealing about this?

## Causal-history

- At some point, someone bestows a proper name upon an individual (a linguistic baptism?)

- Others get acquainted with that name via a causal chain

- Something is the referent of a proper name if it is that name bestowed on them is starting point of such a chain

- What is appealing about this?

## Interlude: Intuitions and theory

- Do we expect that people have an explicit theory of reference? No. Rather, we assume that competent speakers know how to use their languages to refer to things

- We are just trying to work out how this works

- Cf. working out grammatical structures by asking people if a sentence sounds ok to them

## X-Phi study (Machery et al., 2004)

- Motivation: accumulating evidence for differences in thinking style between Westerners and East Asians
  - E.g., more analytic/individual vs more holistic/collective
  - Focusing on individual causes (vs. contextual factors) is typical of the former
  
- So maybe this bias towards a causal theory is just an artefact of western culture?

## Study 1

- 18 W; 26 EA (this would be considered *very* small today)
- 4 items
  - 2 'Gödel' cases; 
  - 2 'Jonah' cases
  
- (they say something went wrong with latter - really not clear what. Poor reporting!)

## Materials: Gödel case


Suppose that there was an important Roman mathematician, Luttius, who is credited with an important mathematical theorem, commonly known as the Roman Theorem. The proof was preserved on a piece of parchment identifying Luttius as the person responsible for the theorem. The only thing that anyone believes about Luttius is that he devised the Roman Theorem. Now suppose that in fact, the person who devised the Roman Theorem was really Maxus, but his friend Luttius, who was also a mathematician, got hold of the manuscript and put his own name on it. In that case, if someone today says ‘Luttius was a mathematician’, is she really talking about:

i. the Roman mathematician who actually devised the Roman Theorem or 

ii. the friend who put his name on the parchment?

## Results study 2

- Gödel cases: W more causal than EA
- (no idea what happened with Jonah cases)

&rarr; tentative support for the idea that the appeal of the causal-history theory is partly cultural?

## Study 2

- 31 W; 40 EA (bit better... but still)
- 4 items
  - 2 'Gödel' cases; 
  - 2 'Jonah' cases
  
## Results study 2

- Gödel cases: W more causal than EA 
- Jonah cases: no difference

- "we conclude that it is wrong for philosophers to assume a priori the universality of their own semantic intuitions."

## Limitations

- Not clear why difference between cases (maybe Jonah cases too long?)

- NB: the motivation was that W apparently focus more on causes over context
- This design doesn't address that

## Martí's critique

- The question was:

```
In that case, if someone today says ‘Luttius was a mathematician’, is she really talking about:

i. the Roman mathematician who actually devised the Roman Theorem or 

ii. the friend who put his name on the parchment?
```

- This is not actually asking the participant how they use names
- Rather, it is inviting them to reflect on how names are used

&rarr; it's probing their intuitions about theories of reference rather than their use of names

- but the point isn't to study folk theories; it's to study folk usage to inform philosophical theories

## Martí's critique

- Analogy

- People struggle with reasoning. But do we learn this by giving them a reasoning task, or by asking them:

- John knows that not B, and he knows that if A then B, should John conclude that not A?

## Martí's critique

- So what do Machery et al. show?

- Not that EAs use names descriptively, but that they may be predisposed to a descriptive theory

- How convincing do you find this critique?

## Task

- Granting the critique, how can we design a study that probes *usage* not *theory*

- A communication game where participant must refer to things

- Challenge: think of ways to disrupt either causal chain OR description

# Practical: Adding animations

## Animations

- Several reasons we've touched on previously:
  - Engagement
  - Interactivity
  - Clarity 
  - Less text
  
## Animations

- We'll be using a javascript library called p5.js
- (this is based on a language called Processing, just so you won't be surprised when tutorials switch between them, e.g. [https://www.youtube.com/watch?v=HerCR8bw_GE&list=PLRqwX-V7Uu6Zy51Q-x9tMWIv9cueOFTFA](https://www.youtube.com/watch?v=HerCR8bw_GE&list=PLRqwX-V7Uu6Zy51Q-x9tMWIv9cueOFTFA))

## P5.js

- Library with lots of functionality for drawing/animating/interactivity
- Putting P5 in jsPsych needs a bit of work (it's doable though - just ask me if you need to do this)
- So we're going to just use a plain page
- We'll write scripts to generate P5 "sketches"

## P5.js - basic concepts

- P5 draws by running a block of code (e.g., drawing lines, curves, circles)
- It animates by re-drawing the block about 60 times a second
- So if there are any variables in the block, they can be updated, and the drawing will change

- As we sometimes *don't* want everything to change, we can separate out initial conditions and the drawing into two blocks:
  - setup: run once right at the start
  - draw: run subsequently 60 times a second

&rarr; exercise_1

## P5.js - adding interactivity

- The library includes various functions for handling input info

- For instance
  - `function mouseClicked(){...}` will execute whenever the mouse is clicked [https://p5js.org/reference/#/p5/mouseClicked](https://p5js.org/reference/#/p5/mouseClicked)
  - `mouseX` and `mouseY` are inbuilt variables giving you the mouse position [https://p5js.org/reference/#/p5/mouseX](https://p5js.org/reference/#/p5/mouseX)
  
&rarr; exercise_2

## Homework

- If you're on the theory track, pick 2 of the suggested readings
- If you're on the coding track, finish exercise 2 (answers are in exercise_2_done.html)