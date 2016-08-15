---
id: 2037
title: Send Multiple Tasks to OmniFocus at Once with Drafts and Pythonista
date: 2013-03-10T11:04:33+00:00
author: n8henrie
excerpt: I often come up with several tasks I need to jot down at once, and this script helps me get them all into OmniFocus in one shot.
layout: post
guid: http://n8henrie.com/?p=2037
permalink: /2013/03/send-multiple-tasks-to-omnifocus-at-once-with-drafts-and-pythonista/
dsq_thread_id:
  - 1127956432
disqus_identifier: 2037 http://n8henrie.com/?p=2037
---
**Bottom Line:** I often come up with several tasks I need to jot down at once, and this script helps me get them all into OmniFocus in one shot. <!--more-->

**Updated Jan 14, 2014: MultiLineOmniFocus V2 Available [here](http://n8henrie.com/2014/01/multilineomnifocus-v2-improved-launch-center-pro-and-callback-support-3/). Still recommended to read this post for background.**

**NB:** _The script in this post is set up to use <a target="_blank" href="https://itunes.apple.com/us/app/drafts/id502385074?mt=8&#038;at=10l5H6" title="Drafts on iTunes">Drafts</a>, <a target="_blank" href="https://itunes.apple.com/us/app/pythonista/id528579881?mt=8&#038;at=10l5H6" title="Pythonista on iTunes">Pythonista</a>, <a target="_blank" href="https://itunes.apple.com/us/app/omnifocus-2-for-iphone/id690305341?mt=8&at=10l5H6" title="OmniFocus iPhone on iTunes">OmniFocus</a>, access to the OmniGroup&#8217;s Mail Drop Beta, and a <a target="_blank" href="http://gmail.com">Gmail</a> email address. It may be possible to use the basic principles with a different setup (esp. re: Gmail, shouldn&#8217;t be hard to configure a different SMTP server), but you may need to get your hands dirty._

I do my best to keep the load of tasks &#8220;on my mind&#8221; to a minimum by getting them into <a target="_blank" href="https://itunes.apple.com/us/app/omnifocus/id402835630?mt=12&#038;at=10l5H6" title="OmniFocus at Mac App Store">OmniFocus</a> on the fly. However, sometimes my thoughts race a bit, and I realize I&#8217;m juggling maybe 4 or 5 ideas that I really ought to get filed away before I forget them. On my Mac, it&#8217;s a simple matter to invoke the OmniFocus Quick Entry box, type a task, and hold **Shift + Enter** to go directly to a second task, making it seamless to input as many as I need at once. _Protip: If you have your Quick Entry box set up to allow you to set Projects and Contexts, you can use **⌘ + d** to **d**uplicate a task, including title and context._

However, as the general rule goes, things on iOS are not quite this smooth. While OmniFocus does provide an in-app quick entry button, for entering a handful of tasks, the process is something like:

  1. Launch OmniFocus.
  2. Wait for for the sync to finish (usually pretty quick).
  3. Click the quick task button.
  4. Type task.
  5. Click save.
  6. Repeat 3-5 for each task.

Now this really isn&#8217;t that bad &#8212; OmniGroup has done a great job making this process pretty darn low-friction. However, I have only [recently started playing around](http://n8henrie.com/tag/drafts/) with <a target="_blank" href="https://itunes.apple.com/us/app/drafts/id502385074?mt=8&#038;at=10l5H6" title="Drafts on the App Store">Drafts</a>, and I really like how quick and responsive it is. It includes a built-in action to send a task to OmniFocus, which works great. Others have recommended using the OmniFocus Mail Drop Beta, an email-to-task feature the OmniGroup has been working on, as one of Drafts&#8217; &#8220;email actions,&#8221; for an even smoother workflow, since the email is sent in the background without any app switching. This works great as well.

I&#8217;ve also [recently started playing](http://n8henrie.com/tag/pythonista/) with <a target="_blank" href="https://itunes.apple.com/us/app/pythonista/id528579881?mt=8&#038;at=10l5H6" title="Pythonista at App Store">Pythonista</a>, and I came across <a target="_blank" href="https://gist.github.com/omz/4073599">a Python script written by the dev himself</a> that creates a little SMTP server and sends email directly from Pythonista. Between the two, I found it pretty easy &#8212; even for a beginner like me &#8212; to put together a combined Drafts / Pythonista workflow that makes for a superior way to import a bunch of tasks to OmniFocus at once (aka &#8220;brain dump&#8221;).

#### They way it works

  * Open a new draft in Drafts. 
  * Type in your tasks, one task per line, as fast as your thumbs can peck.
  * Hit the MultiLineOmniFocus action.
  * Pythonista will launch, you&#8217;ll see some info about the SMTP server starting and each task getting sent.
  * It will return to Drafts when it&#8217;s done.

Here&#8217;s a quick video example of how it works. Apologies for the shoddy editing.



#### Setup

  1. If you haven&#8217;t already, get set up with the OmniFocus Mail Drop Beta, which provides an email address that will turn subject lines into tasks. Request access in your <a target="_blank" href="https://manage.sync.omnigroup.com/" title="Sign up for OmniFocus Mail Drop Beta">OmniSync management page</a>.
  2. Install the URL action into Drafts.
  
    > pythonista://MultiLineOmniFocus?action=run&argv=[[draft]]</li> 
    > 
    >   * Import the script below into Pythonista (here are [a few ways to import scripts](http://n8henrie.com/2013/02/quickly-import-pythonista-scripts-via-textexpander-or-bookmarklet/)).
    >   * Input your information in the **\### CHANGE THESE VALUES:** section.</ol> 
    > 
    > 
    > 
    > I&#8217;m also trying to figure out what in the world GitHub is all about, so I put this (and a bunch of my other scripts) into a repo. Here is the link for this one: <a target="_blank" href="https://github.com/n8henrie/n8pythonista/blob/master/MultiLineOmniFocus.py">https://github.com/n8henrie/fromPastebin/blob/master/MultiLineOmniFocus.py</a>. Maybe you can branch it and tweak it or whatever people do with GitHub stuff.
    > 
    > I&#8217;m not convinced that this method actually saves _time_ compared to just inputting the actions directly into OmniFocus. Even if it did, the time saved would be minimal, because there are already fairly quick methods for doing this. For me, the benefit is that it minimizes the disruption between dumping tasks &#8212; that I can put down everything in one go without having to pause in between each task to hit &#8220;save&#8221; and &#8220;new task.&#8221; If you&#8217;re trying to get 5 ideas out of your head and into OmniFocus, saving 10 clicks is saving 10 clicks. Especially if those clicks are before you&#8217;ve gotten the ideas written down.
    > 
    > #### Pending issues
    > 
    > Currently, I have Drafts set up to delete the contents of the draft when the action is called so I don&#8217;t have to do it manually later. However, this could present a problem if, for example, I didn&#8217;t have internet access at the time. In this case, I&#8217;m guessing Drafts would delete all the tasks I&#8217;d just typed out, and the Pythonista script would fail, and I&#8217;d have to start over. One idea that I haven&#8217;t yet tried but would probably take minimal effort would be to have Drafts _not_ delete the contents at the time the action is called, but to change the final Pythonista **webbrowser.open(&#8216;drafts://&#8217;)** to call the Drafts &#8220;delete&#8221; action. That way, hopefully the contents would only be deleted if the action succeeded. If Pythonista eventually implements <a target="_blank" href="http://x-callback-url.com/">x-callback-url</a>, this might be even easier (just have an x-success argument call the delete action).
    > 
    > I&#8217;d love to hear your feedback or suggestions for improvement in the comments section. I&#8217;ve only discovered Python in the last couple of weeks, so I&#8217;m definitely going for &#8220;functional&#8221; and not necessarily &#8220;elegant&#8221; here, but I&#8217;d love to hear how it could be done better.
    > 
    > **Update Apr 11, 2013:** A reader and fellow Pythonista in training, Jon Kameya, sent in <a href="http://pastebin.com/GzwEet0F" title="MultiLine OmniFocus w/ Newline" target="_blank">this modification</a> that uses | to separate email subject and body, which translates into task title and note in OmniFocus, as well as a check for blank lines. Thanks!