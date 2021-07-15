---
title: "Online experiments - lecture 14"
author: Justin Sulik
date: 15/07/21
output: 
  ioslides_presentation:
    widescreen: true
    smaller: true
---

## Outline

- Revision (just a little)
- Assignment guidance

## Revision

- How do you feel about achieving the stated learning goals?

1. Understand core issues in X-Phi
2. Develop familiarity with the Theory&harr;Data cycle
3. Be able to design an simple X-Phi study
4. Be able to code a web experiment using open-source software

## Revision topics

- Intuitions
- Responses
- Stimuli
- Design

## Intuitions

- How would you define them?
- Why are we collecting them from participants (vs thinking in an armchair)? 
  - (3 key words/phrases that might help your answers: Diversity, Sensitivity, Explanatory depth)
- Why does this matter for philosophy? (3 views)

## Intuitions

- Whose intuitions?
- What are they anyway? (3 phrases: core, folk, reflective)

## Responses

- Why be cautious with interpreting varying responses? (we had 3 types: practical, pragmatic, theoretic)
- How to make sure that the responses are maximally informative?

## Stimuli

- What criticisms have I raised about typical X-Phi stimuli?
- How could things be improved?

## Design

- What was the issue with calibration? How can it be improved?
- What was the issue with vignettes? How can it be improved?
- What was the issue with engagement? How can it be improved?

# Assignment guidance

## Assignments

1. Essay on X-Phi
2. Essay motivating a design
3. Implementing a design with an online script

These are *very* different kinds of tasks. I'll certainly bear that in mind. 

## Assignments: General advice

- Show evidence that you've read some stuff
  - Things not on the syllabus/my slides
  - Use Google scholar *including* the cited-by button
- Show evidence that you've thought a bit
- Don't always go with the first idea you think of 
  - Take time to ponder before committing
  - Do things really need to be so complex?
  
## Assignments: General advice

- Tell me the motivations 
  - Go beyond 'not enough is known about X' or 'X remains poorly understood'! 
  - Why is it worth knowing more? What does understanding it better do for us?
  - I'm more likely to care if it's clear why *you* care
- It's not all about the text: can an image/schema/figure/chart help me understand?

## 1. Essay on X-Phi: guidance

- Think about, limit, and be explicit about how you are interpreting the question
- Pick a fair battleground. Again, be explicit about your choices
- Be honest about gaps, conflicts, issues
- Nobody *needs* long sentences, and fancy words don't make your point inherently smarter

## 1. Essay on X-Phil: evaluation criteria

- Have you set up your question appropriately?
- Have you identified the key issues?
- Have you explained them well and fairly?
- Have you shown some evidence of original research?
- Have you argued towards a balanced conclusion?

## 2. Essay on design: guidance

- I'm *not* expecting a complete/flawless design (which would months and be a lot of work)
- It will be easier on you if you identify something in the literature that doesn't *quite* answer its own research question properly, and then show how it could be improved
- Make a list of the various kinds of changes/improvements/issues/tweaks we've covered in class. Reflect on which of those are worth pursuing for a particular question
- You won't get top marks for just saying "let's add X". The more unsurprising X is (e.g., if we've covered it in class), the more detail or justification you'll need to provide, to get credit for saying it should be included. 
- Can you give me some example stimuli?

## 2. Essay on design: evaluation criteria

- Have you shown some evidence of original research?
- Have you identified a clear question that would benefit from (more) empirical study?
- Have you explained why some current design isn't enough to address this question fully?
- Have you clearly explained your proposed design? 
- Have you set out what hypotheses will be tested and possible conclusions might be drawn?

## 3. Experiment script: guidance

- It's not enough to just build a jsPsych study using a linear sequence of existing plugins. Something more will be needed for a good mark, e.g., *some* combination of:
  - Contingencies/follow-ups/feedback/loops/conditional blocks/timeline variables
  - A custom plugin or something else fancy (animation, interaction, chat, ...)
  - A server script
- I still need some indication of what your script is meant to achieve (even if not a whole essay like task 2)
- Keeping the code readable: 
  - Descriptive variable/function names
  - Consistent formatting
  - Comments!
- Make sure it runs!
- Put it on github (can be a private repo, but then invite me as a collaborator)

## 3. Experiment script: evaluation criteria

- Have you explained well what the script is supposed to do? (A couple of paragraphs in a readme file? Comments on the script?)
- Does your script run well? 
- Is your code clean, clear, easy to read?
- How is the user experience?
- Have you shown evidence of coding skills?

## Final words

- This is technically a philosophy course, but you're not all philosophers. I'm happy with general cognitive science literature/design if it's at least relevant to the kinds of X-Phi topics we've covered
- I'm happy to reward a risk taken (& missed) IF the point of the risk is explained
- I'm happy to reward non-traditional topics/connections/designs IF the value of the new perspective is spelled out
- Real-world science is collaborative. It's fine if, e.g., one person proposes a design for task 2 and another person implements that design for task 3