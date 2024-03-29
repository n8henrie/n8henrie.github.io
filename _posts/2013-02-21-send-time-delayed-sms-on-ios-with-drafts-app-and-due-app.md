---
id: 2002
title: Send Time-Delayed SMS on iOS with Drafts.app and Due.app
date: 2013-02-21T16:28:19+00:00
author: n8henrie
excerpt: While at first blush Drafts may seem like "just another notepad" app that can send data to other apps, it also allows you to built custom email, Dropbox, and URL actions that give you a way to automate some cool tasks with a single click (or maybe a few).
layout: post
guid: http://n8henrie.com/?p=2002
permalink: /2013/02/send-time-delayed-sms-on-ios-with-drafts-app-and-due-app/
dsq_thread_id:
  - 1097626631
disqus_identifier: 2002 http://n8henrie.com/?p=2002
tags:
- automation
- Drafts
- iPad
- iPhone
categories:
- tech
---
**Bottom Line:** This is a custom URL Action for the iOS app <a target="_blank" href="http://agiletortoise.com/drafts">Drafts</a> that sends an SMS message to <a href="http://www.dueapp.com/" title="Due Website" target="_blank">Due.app</a> to be sent later.

<!--more-->

You may have heard some of the buzz lately about <a target="_blank" href="http://agiletortoise.com/drafts" title="Drafts Website">Drafts</a>. I wasn't sure what it was all about, but on a whim I decided to give a shot to both Drafts (<a target="_blank" href="https://itunes.apple.com/us/app/drafts/id502385074?mt=8&at=10l5H6">$2.99 iPhone</a> and <a target="_blank" href="https://itunes.apple.com/us/app/drafts-for-ipad/id542797283?mt=8&at=10l5H6">$3.99 iPad</a>) and <a target="_blank" href="http://omz-software.com/pythonista/">Pythonista</a> (<a target="_blank" href="https://itunes.apple.com/us/app/pythonista/id528579881?mt=8&at=10l5H6">$5, universal</a>).

Possibly the biggest cause for buzz about Drafts is its implementation of <a target="_blank" href="http://x-callback-url.com/">x-callback-url</a>, which is essentially a way for one iOS app to launch and optionally send information to a second app, then optionally return the user to the first app. The "sandbox" in iOS generally prevents apps from directly communicating with one another, and so this helps to build a bridge between them. While at first blush Drafts may seem like "just another notepad" app that can send data to other apps, it also allows you to built custom email, Dropbox, and URL actions that give you a way to automate some cool tasks with a single click (or maybe a few). For example, the email actions can send a pre-formatted email to a given address (e.g. this way to <a target="_blank" href="/2013/03/more-ways-to-send-tasks-to-omnifocus-with-launch-center-pro-and-drafts">send a note to OmniFocus without leaving Drafts</a>), and the Dropbox actions can automatically upload a pre-formatted text file to a predefined Dropbox folder. This is perfect for remotely triggering apps on your computer via Hazel or folder actions, [as I've discussed before](/2011/06/dropvox-dropbox-hazel-and-omnifocus/).

It's the URL actions that are really changing things up, though. For example, yesterday I saw a post on Lifehacker about a new app for sending time-delayed texts. This is one of the few features that I really miss from my jailbroken days; being in medicine means I'm often up much earlier in the morning than my peers, and I hate to risk waking them with a text. However, if I wait to send the text, there's a pretty good chance that I'll either forget or get busy. Sometimes, I'll set a reminder with <a target="_blank" href="https://itunes.apple.com/us/app/due-super-fast-reminders-reusable/id390017969?mt=8&at=10l5H6" title="Due on the App Store">Due</a> to send the text later — this is a pretty good solution, especially since Due can attach a contact's phone number to a reminder so that checkin the reminder launches you right into a phone call or text to that person.

However, I got wondering how Due would handle a URL. The dev team at Due has always seemed very forward thinking and clever (not to mention friendly)... so I put in a task with the title **https://n8henrie.com** ... and sure enough, checking the reminder prompted me to open the site. So I tried something else — I put in a reminder with the title **drafts://** ... and it worked like you might imagine, sending me to Drafts.app.

After (quite) a bit of thinking, I dreamed up a URL action for drafts that would make a reminder in Due (using Due's x-call-back-url support), and afterwards return to Drafts. The reminder in Due would be a link to Drafts, that — when checked — would open Drafts and trigger the "Message" action. Here's the thing, though — _the initial Drafts action would pass the text contents of the screen (in Drafts) to Due, which would then pass them back to Drafts, which would then pass them to the message._ In this way, I could compose a message to a friend in Drafts, and click the "Text Later" action (my name for this URL action). Due would launch and I'd choose when I wanted to be reminded. When the reminder launches, I just check it off and my message appears — all I have to do is choose a recipient.

It took quite a bit of tinkering with URL encoding all the special symbols and spaces in the message, but I finally got something to work. The hardest part was figuring out why Due kept giving me some kind of warning about sync and backing up... it seems like it had something to do with case-sensitivity. In my testing, using **Due://** at the beginning provokes the problem, and **due://** works great. Weird. Oh, one other thing — I was testing these URLs in Notes.app, so I could easily compose on my Macbook and test on my iOS devices, but this ended up costing me a significant amount of time. I eventually discovered that clicking + holding a link in Notes.app and using the "copy link" popup copied a _url-encoded version_ of the link to the clipboard, not the link verbatim. I found that instead, if I clicked elsewhere in "Notes" to put it into edit mode (where hyperlinks are no longer clickable), I could then select and copy the links verbatim. I hope that

Anyway, on to the action. Unless there are problems with posting and URL encoding on my blog, the following link _should_ automatically open Drafts and install the URL action. **NB:** _If you have Drafts set to require a "key,"_ you'll need to edit the URL to include `<strong>%26key%3D</strong>YourKeyHere` immediately after the word **Message** and before **}}**. Otherwise, I think the Due reminder should get made correctly but fail to bring things back to Drafts when you check it off.

> <a target="_blank" href="drafts://x-callback-url/import_action?type=URL&name=Text%20Later&url=due%3A%2F%2Fx-callback-url%2Fadd%3Ftitle%3D%7B%7Bdrafts%3A%2F%2F%2Fcreate%3Ftext%3D%5B%5Bdraft%5D%5D%26action%3DMessage%7D%7D%26x-source%3DDrafts%26x-success%3Ddrafts%3A%2F%2F">Click Me from an iOS Device with Drafts.app installed</a>

If that doesn't work or you prefer not to install the action that way, here is the action as it appears in Drafts; you should be able to C&P it as a new URL action. Once again, if you have Drafts set to require a key, you'll need to modify it slightly by putting `<strong>&key=</strong>YourKeyHere` immediately after **Message** and before **}}**.

<script src="http://pastebin.com/embed_js.php?i=BnUxQHX3"></script>

The only other comment I have is that I used Draft's "Manage Actions" to set it to delete the text from Drafts once sent, so returning to Drafts from Due brings me to a clean slate, ready for my next task.

**Update Mar 05, 2013:** Personally, I really like Due's interface for setting the alarm time and therefore didn't invest energy into building it into the URL. However, it seems like this is a popular and desirable feature for many people. "<a href="https://alpha.app.net/axx" title="Axx at App.net" target="_blank">The Axx</a>," Alex Guyot, has expanded considerably on this Drafts to Due idea in his post <a href="http://theaxx.net/duelaterseries" title="theaxx.net :: Due Later Series" target="_blank" class="broken_link">here</a>. In it, he gives a great overview of problems with and potential solutions to providing a "at time" criteria in the URL, as well as expanding Due's URL support to a variety of "text later," "Tweet later," and "post later" implementations. Well done! Readers may also be interested in my link to imissmymac's post in the comments section.
