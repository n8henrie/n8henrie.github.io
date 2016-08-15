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
---
**Bottom line:** Improved &#8220;Send to OmniFocus&#8221; bookmarklet that works better with Gmail at the end of the post, the rest is just my workflow.
  
<!--more-->


  
I&#8217;m a big advocate of &#8220;universal capture&#8221; and a single task inbox that is the ultimate receptacle for all tasks, whether personal, professional, or miscellaneous. I&#8217;m also a big fan of OmniFocus and Gmail. 

Today I was looking for a better way to have Gmail and OmniFocus work together. I use Gmail&#8217;s &#8220;Priority Inbox&#8221; to keep important emails in-my-face at all times. These generally fall into three main categories:

  * Label: Action: &#8220;need to reply to / act on these&#8221;
  * Label: Waiting: &#8220;waiting for responses to these&#8221;
  * Starred: &#8220;urgent attention needed&#8221;

Gmail&#8217;s excellent keyboard shortcuts make shuffling emails around a breeze (e.g. from &#8220;Action&#8221; to &#8220;Waiting&#8221; after I&#8217;ve composed a reply that needs a response). Once you&#8217;ve turned them on in settings, just type a ? at any time to get a cheat-sheet. 

Overall, I have a successful email workflow and get to &#8220;Inbox Zero&#8221; every day. A big part of this is how easy it is to integrate mobile access into this workflow. Once I label a message &#8220;Action,&#8221; I also archive it. With Priority Inbox, the label keeps the email visible when I&#8217;m at my computer, but keeping it out of the &#8220;inbox&#8221; keeps it from clogging up my &#8220;All Inboxes&#8221; view on my iPhone. I process email on my iPhone throughout the day, using the stock Mail.app on the iPhone. When I get a new email, most stuff I can simply archive after I&#8217;ve skimmed it (by default Gmail &#8220;archives&#8221; when you click &#8220;delete&#8221; if you&#8217;re on Exchange). If there is further &#8220;stuff to be done,&#8221; I just leave it in the inbox (marked as read). Alternatively, if I know it needs to go into my &#8220;Action&#8221; or &#8220;Waiting&#8221; label, I move it there using the little icon that looks like a folder with a down arrow. This works well because it simultaneously removes it from my inbox, making it out-of-my-face on my mobile device, by in-my-face when I&#8217;m back at home base and can do something about it.

Also, because I label and archive everything that is no longer immediately relevant, when I get home, I can safely assume that anything in my inbox needs some kind of action. Frequently, I do this with newsletters that have an unsubscribe option that doesn&#8217;t have great mobile access. If there is no unsubscribe action (often a school-based listserve), I have a Gmail filter that automatically marks as read, archives, and adds a label called &#8220;blind,&#8221; so I add &#8220;from:example@example.com to:listserve@example.com&#8221; to that filter. By leaving those annoying emails in my inbox until I get to my computer, I give myself a fair shot at reducing my long-term email overload by preventing those types of emails in the future. And trust me, I unsubscribe from nearly _everything_; newsletters and site updates are interesting but [](http://www.n8henrie.com/2012/06/how-to-use-rss-feeds-to-customize-your/ "belong in my RSS feed"), whereas email is for personal communication.

One of the few problems I&#8217;ve had with this setup is I haven&#8217;t yet found a satisfactory way to add a &#8220;due date&#8221; to emails in my &#8220;Action&#8221; label (Google Tasks may be a good way to do this, but I haven&#8217;t paid much attention to it). For this reason, and because having a unified inbox is so central to my workflow, sometimes it&#8217;s best to just make an OmniFocus task for an email. 

The stimulus for this post comes from finding this great Chrome to OmniFocus bookmarklet by Alex Popescu. It makes some minor adjustments to the stock OF bookmarklet that give it much better Gmail integration. Calling the bookmarklet while viewing an email in Gmail puts the subject as the task name and includes a link to the email thread in the task note. A few quick tests show that it seems to maintain its link to the email thread even if the email is moved (i.e. I made a task from an email in the inbox, archived the email, and the link still worked, even in a different browser).

A Generalized OmniFocus Bookmarklet With Support for GMail :: think differently big.</p>