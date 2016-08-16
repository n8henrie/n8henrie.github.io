---
id: 1700
title: Gmail Workflow with Priority Inbox and iOS, and a New OmniFocus Bookmarklet
date: 2012-09-10T18:38:05+00:00
author: n8henrie
layout: post
guid: http://www.n8henrie.com/?p=1700
permalink: /2012/09/gmail-workflow-with-priority-inbox-and-ios-and-a-new-omnifocus-bookmarklet/
al2fb_facebook_exclude:
  - 1
dsq_thread_id:
  - 839051245
disqus_identifier: 1700 http://n8henrie.com/?p=1700
tags:
- bookmarklet
- Chrome
- email
- GTD
- Mac OSX
- OmniFocus
- productivity
categories:
- tech
---
**Bottom line:** Improved “Send to OmniFocus” bookmarklet that works better with Gmail at the end of the post, the rest is just my workflow.
  
<!--more-->


  
I’m a big advocate of “universal capture” and a single task inbox that is the ultimate receptacle for all tasks, whether personal, professional, or miscellaneous. I’m also a big fan of OmniFocus and Gmail. 

Today I was looking for a better way to have Gmail and OmniFocus work together. I use Gmail’s “Priority Inbox” to keep important emails in-my-face at all times. These generally fall into three main categories:

  * Label: Action: “need to reply to / act on these”
  * Label: Waiting: “waiting for responses to these”
  * Starred: “urgent attention needed”

Gmail’s excellent keyboard shortcuts make shuffling emails around a breeze (e.g. from “Action” to “Waiting” after I’ve composed a reply that needs a response). Once you’ve turned them on in settings, just type a ? at any time to get a cheat-sheet. 

Overall, I have a successful email workflow and get to “Inbox Zero” every day. A big part of this is how easy it is to integrate mobile access into this workflow. Once I label a message “Action,” I also archive it. With Priority Inbox, the label keeps the email visible when I’m at my computer, but keeping it out of the “inbox” keeps it from clogging up my “All Inboxes” view on my iPhone. I process email on my iPhone throughout the day, using the stock Mail.app on the iPhone. When I get a new email, most stuff I can simply archive after I’ve skimmed it (by default Gmail “archives” when you click “delete” if you’re on Exchange). If there is further “stuff to be done,” I just leave it in the inbox (marked as read). Alternatively, if I know it needs to go into my “Action” or “Waiting” label, I move it there using the little icon that looks like a folder with a down arrow. This works well because it simultaneously removes it from my inbox, making it out-of-my-face on my mobile device, by in-my-face when I’m back at home base and can do something about it.

Also, because I label and archive everything that is no longer immediately relevant, when I get home, I can safely assume that anything in my inbox needs some kind of action. Frequently, I do this with newsletters that have an unsubscribe option that doesn’t have great mobile access. If there is no unsubscribe action (often a school-based listserve), I have a Gmail filter that automatically marks as read, archives, and adds a label called “blind,” so I add “from:example@example.com to:listserve@example.com” to that filter. By leaving those annoying emails in my inbox until I get to my computer, I give myself a fair shot at reducing my long-term email overload by preventing those types of emails in the future. And trust me, I unsubscribe from nearly _everything_; newsletters and site updates are interesting but [](http://www.n8henrie.com/2012/06/how-to-use-rss-feeds-to-customize-your/ "belong in my RSS feed"), whereas email is for personal communication.

One of the few problems I’ve had with this setup is I haven’t yet found a satisfactory way to add a “due date” to emails in my “Action” label (Google Tasks may be a good way to do this, but I haven’t paid much attention to it). For this reason, and because having a unified inbox is so central to my workflow, sometimes it’s best to just make an OmniFocus task for an email. 

The stimulus for this post comes from finding this great Chrome to OmniFocus bookmarklet by Alex Popescu. It makes some minor adjustments to the stock OF bookmarklet that give it much better Gmail integration. Calling the bookmarklet while viewing an email in Gmail puts the subject as the task name and includes a link to the email thread in the task note. A few quick tests show that it seems to maintain its link to the email thread even if the email is moved (i.e. I made a task from an email in the inbox, archived the email, and the link still worked, even in a different browser).

A Generalized OmniFocus Bookmarklet With Support for GMail :: think differently big.</p>