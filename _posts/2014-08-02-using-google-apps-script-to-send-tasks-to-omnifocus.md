---
id: 2592
title: Using Google Apps Script to Send Tasks to OmniFocus
date: 2014-08-02T10:57:02+00:00
author: n8henrie
excerpt: How to use a Google Apps Script to automate making OmniFocus tasks from emails.
layout: post
guid: http://n8henrie.com/?p=2592
permalink: /2014/08/using-google-apps-script-to-send-tasks-to-omnifocus/
dsq_thread_id:
  - 2894891502
disqus_identifier: 2592 http://n8henrie.com/?p=2592
tags:
- automation
- javascript
- OmniFocus
- productivity
- webapp
categories:
- tech
---
**Bottom Line:** How to use a Google Apps Script to automate making OmniFocus tasks from emails.<!--more-->

Gmail filters are pretty powerful, and you can easily set one up to forward to your <a target="_blank" href="http://support.omnigroup.com/omnifocus-mail-drop" title="OmniFocus Mail Drop - Support - The Omni Group">OmniFocus Mail Drop</a> address. In conjunction with <a target="_blank" href="https://ifttt.com/" title="IFTTT: Put the internet to work for you.">IFTTT</a> (<a target="_blank" href="https://itunes.apple.com/us/app/ifttt/id660944635?mt=8&uo=4&at=10l5H6" title="IFTTT">iOS App</a>), you can create even more powerful actions to send customized tasks using Gmail triggers. This kind of basic task generation automation is a great place to start, and it’s reasonably easy even for tech novices.

However, if you want to get into some _really_ powerful email-to-task automation, you ought to look into Google Apps Script. It’s basically JavaScript that Google runs for you, with some really cool integration with things like Gmail and Google Sheets. It basically lets you write scripts that access and are triggered by things like a particular Gmail message or spreadsheet cell and gives you pretty fine control over what you do with the message.

Consider this situation, for example. Let’s say you get emails about bank transactions, and you want to know about them ASAP. Great — set up a Gmail filter to send a notification via <a target="_blank" href="https://itunes.apple.com/us/app/pushover-notifications/id506088175?mt=8&uo=4&at=10l5H6" title="Pushover Notifications">Pushover</a> or use IFTTT. **However**, let’s say instead that you only want notifications for transactions _over a certain dollar amount_. That’s where this type of script may be your best bet, using something like a regex to find the amount of the transaction, `parseFloat()`, and a comparison. For example,

```javascript
var emailContent = 'You had a transaction for $24.50';

// Set up the regex (parenthesis indicate a "group")
var transAmountRegex = /\$(\d+\.\d{2})/;

// Get first matching group
var transAmountString = transAmountRegex.exec(emailContent)[1];

// Turn the string into a number
var transAmount = parseFloat(transAmountString);

if ( transAmount >= 25.00 ) {
    console.log("That was a big transaction.");
    sendNotification();
    }
else {
    console.log("Honey badger don't care.");
    }
```

Don’t worry too much if you don’t know JavaScript. I don’t really know any either (compare my posts tagged `javascript` to those tagged `python` or `AppleScript` for example). But if you have even a _little_ background in scripting and access to Google, you can probably figure it out enough to get a working script using my template. In my script below, I’ve included a template function called `bankEmail` to provide a basic example.

## Initial setup

  1. Create a new Gmail label called \`scripts\` (or choose your own label name).
  2. If desired, create a Gmail filter to automatically label certain emails.
  3. Go to <a target="_blank" href="https://script.google.com">https://script.google.com</a> and choose \`Blank Project\`.
  4. Copy and paste my script below (replacing anything already in the script), save, and choose a new name.
  5. Change the variables at the top of the script to your label and your Mail Drop address (or whatever address you’re sending the message to).

## Make your test in `function processMessage(message)`

Because I plan on using this same script and label to process a number of different kinds of emails, the next step is to use an `if` statement to see what pattern a given email fits into. Depending on the complexity of your rule, this may be redundant (as a Gmail filter would serve a similar purpose), but it allows for much more flexibility and more powerful matching with things like regular expressions, as I mentioned above.

You’ll need to make a new test for each “type” of email you want to match, and a new function for how to deal with that type of email.

  1. Go to the `function processMessage(message)` part of the script.
  2. You can leave my example for `bankEmail` (near line 61) there as a template, if you want.
  3. Change the section `else if ( to == 'youremail@email.com'` section to fit the pattern of emails you want to match.
      * You may want to brush up on <a target="_blank" href="http://www.w3schools.com/js/js_regexp.asp">JavaScript regular expressions</a>.
      * The `from` field isn’t _just_ the address — Click the small down arrow to the right of a Gmail message, `Show original`, and look for what it has under `From:`.
      * You’ll probably want to use `/yourRegex/i.test(emailField)` in this portion, as it returns `true` or `false`, which is what you need for matching.
  4. In the curly brackets `{ }` after `if`, put in the name of the new function that you want to be called when that particular email matches, and send it the messageId as an argument, i.e. replace `yourNewFunction(messageId);` with your new values.

## Set up your function

Next we’ll make your custom function that is called when your email pattern matches.

  1. Make a new function following the pattern demonstrated in `function yourNewFunction(messageId) {`.
  2. In the curly braces `{ }`… do what you want! Get attributes like the message content, the subject, etc. using the <a target="_blank" href="https://developers.google.com/apps-script/reference/gmail/gmail-message">GmailMessage class</a>.
  3. Use this data you’ve extracted from the email to make a concise, informative task.
  4. Consider using the JavaScript `Date()` function to add a “Processed on: ” type line.
  5. You’ll use <a target="_blank" href="https://developers.google.com/apps-script/reference/mail/mail-app">MailApp.sendEmail</a> to send the task to OmniFocus via Mail Drop.
      * Don’t forget your subject will be the task name, and your email body will be the task note.
      * Consider including using something like `GmailMessage.getPlainBody()` in your note to give your task appropriate context.
  6. Add a `message.getThread().removeLabel(label);` to the bottom of your function to make sure the label gets removed before the next run.

## Test and debug

Next, give it a shot!

  1. In Gmail, label a message that should pass your “test” and trigger your custom function.
  2. A few seconds after labeling it, go back to the script, save, then go to `Run` -> `processLabel`.
  3. During the first run, you should expect an `Authorization required` box asking to be able to read your emails and send emails. Take a look through your code and make sure you’re okay with this.

If by some miracle your script worked on the first try, **you’re a lot better at this than me**.

If you got an error, hopefully it gave you a helpful error message. One thing that might help you figure it out is to click the line number of the script at some point _before_ the error is being picked up, which tells it to debug there. Then use the button that looks like a bug, which will run the script up to that point, then pause and show you details about all your variables.

If it didn’t work but you _didn’t_ get an error, that might mean your message didn’t properly get picked up in the `processMessage` function. In this case, set the `myDebug` global variable up top to `true`, run the script again, then go to `View` -> `Logs`; you should get a printout of most of the values you would use to match a message, such as `From`, `To`, `Subject`, etc. Make sure the values you’re trying to match are exactly right.

If all else fails, <a target="_blank" href="http://n8h.me/1lkah2D">Google is your friend</a>. You can try <a target="_blank" href="https://twitter.com/n8henrie">me on Twitter</a>, but I probably won’t be a whole lot of help, since I didn’t know how to do any of this before this morning.

## Set up your trigger

Once it seems to be working manually, the hard part is through! Now you just need it to run automatically. Unfortunately, I don’t think there’s a way to trigger your script immediately when a new email arrives or gets labeled, so I think time-based is the best option available.

`Resources` -> `Current project's triggers`

My current settings:

  * Run: **processLabel**
  * Time-driven
  * Minutes timer
  * Every 5 minutes
  * Notifications: Once daily

Well, that’s about it. As one last reminder, when you set up your Gmail filter, you can have a _single filter_ run the same rule for a bunch of different email patterns by using curly braces `{ }` to indicate `or`, e.g. `{this, that} == this OR that` and parenthesis `( )` to indicate `and`, e.g. `(this, that) == this AND that`.

For example, if I want my custom Google Apps script to run on emails from `person1@gmail.com` that have `cars` in the subject and on emails from `person2@gmail.com` that has the phrase `let's go riding` somewhere in them, a Gmail filter with the following will match **both** of them:

```
Has the words: { (from:person1@gmail.com, subject:cars), (from:person2@gmail.com, "let's go riding") }
```

Then just have that filter do something like this for its action:

  * Apply the label: `scripts`
  * Never mark as spam
  * Skip the Inbox (optional)
  * Mark as read (optional)

Okay, that’s it! I’m excited to have finally broken into the world of Google Apps Script. Let me know if you have suggestions for improvement or questions in the comments section below!
