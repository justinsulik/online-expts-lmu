---
title: "Online experiments - lecture 3"
author: Justin Sulik
date: 29/04/21
output: 
  ioslides_presentation:
    widescreen: true
    smaller: true
---

## Back to jsPsych

- Last time we built a simple survey with a couple of question types
- Adding more question types is a matter of reading the docs on jspsych.org
- Today we're going over a couple more complex aspects:
    - How to randomize things
    - How to use responses in later questions

## Quick recap

There are 2 ways to include scripts:

1. If it's your script, you put the code between `<script>` tags:

```
<script>
var timeline = [];
var survey = {
  type: "survey-multichoice",
  questions: [...]
}
</script>
```

## Quick recap


2. If it's another script that you're just loading, you use the source `src=""` attribute that just needs to point to the right file on your computer

```
<script src="../jspsych/jspsych.js"></script>
```

## Quick recap

- Where do we put them? It depends on what you need and when you need it
  - As you want jspsych available before you actually do anything, load jspsych at some point before your own script
  - As you want your script to create things to add to the web page, makes sense to do that after the page template has been created (i.e., after the `<body></body>`)


## Randomization

- jsPsych has plenty of useful randomization functions
- [https://www.jspsych.org/core_library/jspsych-randomization/](https://www.jspsych.org/core_library/jspsych-randomization/)
- e.g. `jsPsych.randomization.shuffle(array)`

```
var options = ["yes", "no"];
var options_shuffled = jsPsych.randomization.shuffle(options);

var gettier_trial = {
  type: 'html-button-response',
  stimulus: 'John places a watch blah blah',
  prompt: 'Does John know there\'s a watch on the table?',
  choices: options_shuffled
};
```
&rarr; open exercise 1
    
- It's going to crash! Let's first try work out why
    
## Using responses in later trials

- E.g., if the participant chooses "no" on trial 1, then on trial 2 they can be asked: "why did you say no?"
- Doing this needs a couple components:
  - On trial 1, extracting the relevant information
  - On trial 2, incorporate the relevant information
- One tricky element: when creating trial 2, the response to trial 1 doesn't exist yet!

## Step 1 - extracting the data

- Each jsPsych trial has a property `on_finish`
- The value of that property is a `function(data){...}`
- This function can do something with the data from that trial, such as:
  - Extract the relevant response
  - Store it for later use
- One issue: a variable declared inside a function is only visible to that function
  - (for more info: google "js function scope")
    
&rarr; open exercise 2

## Step 2 - using the data later

- You can define a trial using variables
```
var trial = {
  type: 'html-button-response',
  stimulus: 'Is it fair to kill the innocent homeless man to prevent the mob rioting?'
 }
```

## Step 2 - using the data later

- You can define a trial using variables
```
var question = 'Is it fair to kill the innocent homeless man to prevent the mob rioting?'
var trial = {
  type: 'html-button-response',
  stimulus: question
 }
```
So if we've stored the info from a previous trial in such a variable, we *should* be able to access it later...somehow

&rarr; open exercise 3


# Theories, intuitions and data

## Theories and intuitions

- So far we've been talking about a cycle:
  - theory &harr; intuition

- BUT are we measuring intuitions? 
  - No, those are cognitive phenomena
  - We're measuring people's responses

- So really it's been more:
  - theory &harr; (data &rarr; *inferred* intuition)
  
- How much of a gap can there be between responses and the intuitions they're meant to reflect?  A *huge* one
- What do you need to know about closing the gap between observable data and inferred intuitions behind it? A bit of cognitive science methodology

## More romanticism

- Last week: intuition-driven romanticism
  - The idea that a philosopher just needs to introspect to find a golden little nugget of evidence for/against some theory
  - x-phi's negative project is a reaction against this
  
- Now: survey-driven romanticism (Cullen, 2010)
  - The idea that we can just read off evidence for intuitions from survey responses
  
## More romanticism
 
- "Despite well-established results in survey methodology, many experimental philosophers have not asked whether and in what way conclusions about folk intuitions follow from people’s responses to their surveys. Rather, they appear to have proceeded on the assumption that intuitions can be simply read off from survey responses." (Cullen, 2010)

- "We cannot simply assume that the participants in these studies were forming intuitional judgments, because it is just as (if not more) likely that they were doing something else entirely – for example, guessing, giving responses that they deemed socially suitable/acceptable, and so on – and none of the studies conducted thus far have attempted (much less successfully managed) to control for this" (Wright, 2016)

## More romanticism

- Basically, responses don't always mean what you think they mean:
  - Practical issues
  - Pragmatic issues
  - Theoretic issues

## The problem: practical

Schwarz, citen in Cullen (2010):

- "How successful would you say you have been in life?"
- 2 scale options ("not at all successful" to "extremely successful")
  - ` 0  1  2  3  4 5  6  7  8  9  10`
  - `−5 −4 −3 −2 −1 0 +1 +2 +3 +4 +5`
- Where do you think most people responded?

## The problem: practical

Recall the truetemp cases from last week?

- The answer options were "really knows" vs. "only believes"
- In what ways may these be ... not ideal?

## The problem: practical

- What if people are responding carelessly/guessing?
  - What if long and bizarre vignettes make them more likely to respond carelessly/guess?
- What if people are bias towards positive responses/responses on the right handside of the screen?
- More on this in week 6 when we talk about data quality

## The problem: pragmatic

Pragmatics is the branch of linguistics that is about 

- inferring meaning in context
- inferring people's communicative intentions
  - "Why are you even asking me this?"

## The problem: pragmatic

From a current project of mine ([https://psyarxiv.com/djaex/](https://psyarxiv.com/djaex/)): 

- Studying how people explain (vs. how theories explain)
- Collected 1000s of responses to "Why?" questions
- "Why do people shake their head for 'no'?"
- What do you think I was getting at? (Given my interest in cultural variation...)
- How do you think people interpreted it?
- Could this have been foreseen?
  - It's *very* hard to know how people will take you
  
## The problem: pragmatic

- A common theme in pragmatics: we communicate what is relevant against a backdrop of shared knowledge
- Example 1
  - Bob: "Are you and Sue coming to the party?"
  - Mary: "I am"
  
- Example 2
  - Question 1: "Do you like salads?" Yes
  - Question 2: "Do you like vegetables?"
  
(for more info, see Sperber & Wilson, 1995)

## The problem: pragmatic

- Cullen's discussion of ordering effects

- 1st stage: respondent given EITHER ordinary vignette about knowledge OR vignette about someone with a weird belief (e.g., Dave's belief he can predict which side a coin comes down)
- 2nd stage: respondent given truetemp case 
- Their response in 2nd stage differs according to which vignette they saw in first stage
- *Apparently* philosophically irrelevant feature alters intuitions
- Therefore, don't trust intuitions as evidence (negative project)

## The problem: pragmatic

- BUT this ignores pragmatics: people interpret current communication in light of previous communication
- Given case of knowledge, they think they're being asked "how about this weird case - does this compare with the previous thing that was obviously knowledge?"
- Of course they're going to say "no"

- Explicit instructions to consider cases completely independently reduces ordering effect
 - Instructions are important!

## The problem: theoretic

- Guest & Martin (2021)
  - (This is not their main point, but anyway...)
  
- What's the area of a circle? $\pi r^2$
  - Do people know this? Often, yes
- Which gets you more pizza? Two 12-inch pizzas or one 18-inch pizza?
  - What's the right answer?
  - Do you think people reliably give this answer?
  
- So on one hand we have a model/concept and a response, and the response *needn't* tell us anything about whether the respondent would endorse the model/concept

## The problem: theoretic

- van Rooij & Baggio (2021)
  - Effects are things that need to be explained
    - E.g. Stroop effect
  - Psychological theories are meant to explain these effects
  - Without better (formal) psychological theories, collecting more and more effects doesn't move us forward

- Both positive and negative X-phi are focusing on the effects (the variability of intuition)
- Philosophical theory isn't meant to explain the effects
- But it's often not clear what the effects/responses mean in terms the beliefs/models/intuitions people have in their heads
- For x-phi survey responses to be useful x-phi *qua* philosophy, x-phi needs to fully engage with the psychology of the situation

## So?

- Well, what this means depends on why we're wondering about intuitions
- If it's about x-phi's negative project, then varying responses needn't mean varying intuitions
- If it's about x-phi's positive project, then varying responses needn't inform theory building
- If it's about x-phi's relation to cognitive science, then we want to know why it's happening
   - Methodological failings? X-phi needs to learn to do better experiments
   - Genuine variation in intuitions/cognitive models? Push for explanatory depth, further into cognitive science...
   - Especially those bits of cognitive science that are concerned with the relationship between formal theories and data, even if those are formal in the sense of mathematical/computational, rather than philosophical
   
## Homework

- Pick an empirical study -- or part of a study -- that involves some randomization (e.g., one in Cullen, 2010)
- Try recreate it in jsPsych
- Try improve on it!

## Citations

- Cullen, S. (2010). Survey-driven romanticism. *Review of philosophy and psychology*, 1(2), 275-296.

- Guest, O., & Martin, A. E. (2020). How computational modeling can force theory building in psychological science. *Perspectives on Psychological Science*, preprint: [https://psyarxiv.com/rybh9/](https://psyarxiv.com/rybh9/)

- Sperber, D., & Wilson, D. (1986). *Relevance: Communication and cognition.* Harvard University Press.

- van Rooij, I. & Baggio, G. (2021). Theory before the test: How to build high-verisimilitude explanatory theories in psychological science. *Perspectives on Psychological Science*, preprint: [https://psyarxiv.com/7qbpr/](https://psyarxiv.com/7qbpr/)

- Wright, J. C. (2016). Intuitional stability. In Sytsma, J., & Buckwalter, W. (Eds.) *A companion to experimental philosophy*, 568-577.


