---
id: 34
title: Using ifttt to make recurring tasks for Orchestra or Wunderlist
date: 2012-01-19T22:06:00+00:00
author: n8henrie
layout: post
guid: http://www.n8henrie.com/?p=34
permalink: /2012/01/ifttt-recurring-tasks-orchestra-wunderlist/
blogger_blog:
  - www.n8henrie.com
blogger_author:
  - Nathan Henrie
blogger_permalink:
  - /2012/01/using-ifttt-to-make-recurring-tasks-for.html
geo_latitude:
  - 35.0844909
geo_longitude:
  - -106.6511367
geo_address:
  - 301-399 Central Ave SW, Albuquerque, NM 87102, USA
dsq_thread_id:
  - 811565513
blogger_images:
  - 1
disqus_identifier: 34 http://n8henrie.com/?p=34
---
Hopefully this turns out to be a relatively quick post, especially since this little trick was so easy to figure out. In this post i plan on referring to a number of companies that do a great job keeping users up-to-date with their responsive Twitter accounts. For this reason I’ll refer to them by their “@” Twitter handles (making their accounts especially easy to find for you [@Twitter](http://twitter.com/ "Twitter") users), but the hyperlinks will go to their company website, to make that easy to find as well.
  


### 

### Overview

We’re very lucky to have a number of excellent, free task managers available, such as [@Orchestra](http://www.orchestra.com/ "Orchestra") and [@Wunderlist](http://www.wunderlist.com/ "Wunderlist"). Because we all have something easy-to-forget but important we have to do every {week, month, day}, I think that repeating tasks are a critical component of a solid tasklist manager.  Unfortunately, both of these top-rated apps lack repeating reminders.  However, both support email-in tasks, and you can use the powerful webapp [IFTTT](http://ifttt.com/ "IFTTT") to make a task by email at a given interval to replicate this function and get repeating tasks.
  


### 

### My System

Personally, I use [@OmniFocus](https://itunes.apple.com/us/app/omnifocus/id402835630?mt=12&#038;at=10l5H6 "OmniFocus"). I’ve probably tried 25+ task managers on iOS, OSX, webapps, etc., and I firmly believe that OF is the best out there for me. I could tell you all about how I couldn’t do without its [Applescript support](http://www.n8henrie.com/2011/06/dropvox-dropbox-hazel-and-omnifocus/ "DropVox, DropBox, Hazel, and OmniFocus"), excellent syncing across my Mac, iPhone, and iPad, start dates for future tasks, contexts, perspectives, etc… but I won’t (for now). Instead, I’ll admit that it does have a few downsides. 

  1. Task / tasklist sharing is not well implemented in my opinion.
  2. There is no webapp or online version.
  3. Email-in tasks are not well supported (tasks can be applescript-ed in by Mail.app, but if you don’t have a computer actively running Mail.app, doesn’t do much good).
  4. It’s got to be one of the most expensive task managers out there.
  5. Apple devices only.

While it’s worth the cost to me, the prohibitive cost to others means that task sharing is even more limited. It’s hard enough to convince a group of my coworkers or classmates that we should see if a shared tasklist could help us GTD and distribute tasks more evenly and efficiently. Slap a $20, $40, $80 pricetag on the iPhone, iPad, and Mac versions, respectively, and there’s no way. If some of the people use Android or PC devices, it’s impossible anyways, since OmniGroup products are Apple only.
  


### 

### @Orchestra and @Wunderlist

Both of these are excellent options for people with iPhones. Both are free and support tasklist sharing. Both have excellent webapp interfaces so you can not only use them on your Mac, PC, Chromebook, etc., but you can log in on _any_ computer you want to use your tasklist. [@Wunderlist](http://www.wunderlist.com/ "Wunderlist") gets extra bonus points for having a native app for a _huge_ variety of devices. [@Orchestra](http://www.orchestra.com/ "Orchestra") does not yet have a native OSX or iPad app, but it has really excellent list sharing options and built-in task dictation on the iPhone.
  


### 

### Email-in Tasks

Both of the above mentioned free apps support the ability to email tasks to your tasklist. They have a generic, easy-to-remember email address (either <me@wunderlist.com> or <tasks@orchestra.com>) that you can send or forward an email to and it will show up in your tasklist. I know that [@Orchestra](http://www.orchestra.com/ "Orchestra") even has some syntax you can use to add tasks to specific lists or share them with specific individuals by adding symbols and keywords to the subject line (I’ll use this in my example later in this post). To keep things straight, only emails coming from your account-associated email address will be added to your tasklist, so you can’t have your friends email a task directly to your tasklist, the email must be coming from your address. **Tip:** Make a special contacts group in your Address Book where you can make a contact card for apps like these. This way, you don’t even have to remember the simple email address. And if you’re a Siri user, you’ll be able to “Make an email to Wunderlist” to add tasks by voice.
  


### 

### @ifttt Automation

[@ifttt](http://ifttt.com "ifttt") is a killer webapp that can automate and coordinate tasks between a _ton_ of services that you already use ([Dropbox](https://www.dropbox.com/referrals/NTU0NzE4MDQ5 "You're welcome, Matt"), Facebook, Twitter, RSS, and many more). For example, I have ifttt text me if it’s going to snow or rain tomorrow. Very simple to set up and use, and it works great.

For the purposes of this post, I bet you can already guess what we’re going to do. [@ifttt](http://ifttt.com "ifttt") can be linked to your Gmail account in order to send email “from” you. Once this is set up, it’s super simple, and worked first time for me.
  


### 

### How to Make a Repeating Task

  1. Make an [@Orchestra](http://www.orchestra.com/ "Orchestra") or [@Wunderlist](http://www.wunderlist.com/ "Wunderlist") account and associate it with your Gmail address.
  2. Set up an [@ifttt](http://ifttt.com "ifttt") trigger for a given date, day of the week, time, etc.
  3. Make this trigger an action to send an email from your Gmail account to the address for your tasklist manager of choice.

A few pics of selected steps and the resulting task in the <a href="http://www.orchestra.com/" target="_blank">@Orchestra</a> webapp and iPhone app:

<div style="clear: both; text-align: center;">
  <a href="{{ site.url }}/uploads/2012/08/ScreenShot2012-01-19at1.07.15PM1.jpg" style="margin-left: 1em; margin-right: 1em;"><img border="0" height="260" src="{{ site.url }}/uploads/2012/01/ScreenShot2012-01-19at1.07.15PM.jpg" width="640" /></a>
</div>

<div style="clear: both; text-align: center;">
</div>

<div style="clear: both; text-align: center;">
  <a href="{{ site.url }}/uploads/2012/08/ScreenShot2012-01-19at1.07.26PM1.jpg" style="margin-left: 1em; margin-right: 1em;"><img border="0" height="348" src="{{ site.url }}/uploads/2012/01/ScreenShot2012-01-19at1.07.26PM.jpg" width="640" /></a>
</div>

<div style="clear: both; text-align: center;">
</div>

<div style="clear: both; text-align: center;">
  <a href="{{ site.url }}/uploads/2012/08/ScreenShot2012-01-19at1.05.44PM1.jpg" style="margin-left: 1em; margin-right: 1em;"><img border="0" height="363" src="{{ site.url }}/uploads/2012/01/ScreenShot2012-01-19at1.05.44PM.jpg" width="640" /></a>
</div>

<div style="clear: both; text-align: center;">
</div>

<div style="clear: both; text-align: center;">
  <a href="{{ site.url }}/uploads/2012/08/IMG_13841.png" style="margin-left: 1em; margin-right: 1em;"><img border="0" height="640" src="{{ site.url }}/uploads/2012/01/IMG_1384.png" width="426" /></a>
</div>

<div style="clear: both; text-align: center;">
</div>

<div>
</div>

<div>
</div>

If you’re using [@Orchestra](http://www.orchestra.com/ "Orchestra"), here’s a list of [email syntax tricks to use for sharing and setting task options](http://www.orchestra.com/email-tips/){.broken_link}. **Tip:** _C&#038;P syntax rules like these to the “notes” section of your contact card._ See the photos below for an example [@ifttt](http://ifttt.com "ifttt") to [@Orchestra](http://www.orchestra.com/ "Orchestra") task that will repeat itself on a weekly basis and be added automatically to my #HomeShare list. This list is shared between my roommate and me and could easily be used to remind us of cleaning tasks, putting out the trash, or any other task that needs to be done by one of us on a regular interval.

As I said above, I use [@OmniFocus](http://www.omnigroup.com/products/omnifocus/ "OmniFocus"), which has its own powerful system for repeating tasks, but this may serve as an acceptable alternative for those of you using a system that doesn’t yet support repeating tasks.

If anyone has suggestions for other ways to implement repeating tasks on some of the free tasklist managers, please let me know in the comments section below!  Corrections on anything I got wrong or misrepresented are always appreciated as well. 

<div>
</div>