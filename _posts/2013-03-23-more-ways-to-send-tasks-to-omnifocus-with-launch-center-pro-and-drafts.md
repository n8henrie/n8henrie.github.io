---
id: 2067
title: More Ways to Send Tasks to OmniFocus with Launch Center Pro and Drafts
date: 2013-03-23T18:40:26+00:00
author: n8henrie
excerpt: "Like Drafts, Launch Center Pro is a pretty popular app with the productivity and OmniFocus-loving crowd, so I thought I'd post a few new ways to get tasks from LCP to OF."
layout: post
guid: http://n8henrie.com/?p=2067
permalink: /2013/03/more-ways-to-send-tasks-to-omnifocus-with-launch-center-pro-and-drafts/
dsq_thread_id:
  - 1160210870
---
**Bottom Line:** You can use Launch Center Pro&#8217;s new in-app email to send email items to OmniFocus without leaving the app, as well as a URL scheme to send it through Drafts. <!--more-->

Like <a target="_blank" href="https://itunes.apple.com/us/app/drafts/id502385074?mt=8&#038;at=10l5H6" title="Drafts Website">Drafts</a>, <a target="_blank" href="https://itunes.apple.com/us/app/launch-center-pro/id532016360?mt=8&#038;at=10l5H6">Launch Center Pro</a> is a pretty popular app with the productivity and OmniFocus-loving crowd, so I thought I&#8217;d post a few new ways to get tasks from LCP to OF. Like some of [my other recent posts](http://n8henrie.com/2013/03/send-multiple-tasks-to-omnifocus-at-once-with-drafts-and-pythonista/), these depend on being enrolled in OmniGroup&#8217;s Mail Drop (beta), an email-to-OmniFocus service. If you&#8217;re not on board with that yet, do it now &#8212; it&#8217;s _really_ nice.

LCP&#8217;s recent update support a handful of new actions, one of which is in-app email. This obviously works a treat for emailing tasks to OmniFocus. Now LCP can also just add tasks directly to the OmniFocus iPhone app, which is great. Using the in-app email, however, you don&#8217;t have to lose LCP&#8217;s focus by opening the OmniFocus app at all, it just emailed in the background and you&#8217;re good to go. Additionally, this would seem to be a _great_ way for OmniFocus users that _don&#8217;t_ yet own OF for iPhone to add tasks from their iDevice. (Then again, I&#8217;m betting that the set of OmniFocus users nerdy enough to own LCP who don&#8217;t also own OF for iPhone is… not very big.)

#### Setup for first method (requires LCP and Mail Drop address)

  1. Copy your OmniFocus Mail Drop email address to the clipboard (trust me, do this first).
  2. New Action -> System Actions -> In-App Email -> Email with Body & Subject
  3. Name it whatever you want.
  4. Paste the email address from your clipboard into Recipients
  5. Click the &#8220;Subject&#8221; field, and tap the &#8220;Input Prompt&#8221; that appears above the keyboard, then choose &#8220;Keyboard.&#8221;
  6. The body of the email will be used as a note attached to the task, so put whatever you like (scroll down touch to see how I used TextExpander to add a datestamp here).

Here&#8217;s what it will look like if you edit the finalized action (so you can customize the icon).

 ![](http://n8henrie.com/wp-content/uploads/2013/03/20130323_IMG_07421.PNG)

Whenever you launch this action, it will give you an input prompt, where you type your task:

 ![](http://n8henrie.com/wp-content/uploads/2013/03/20130323_IMG_07431.PNG)

Upon clicking &#8220;Go&#8221; your email will appear. Click &#8220;Send.&#8221;

 ![](http://n8henrie.com/wp-content/uploads/2013/03/20130323_IMG_07441.PNG)

You might have noticed that my email body has a nicely formatted timestamp (although I prefer YYYYMMDD for anything that might need sorting). That happened by way of LCP&#8217;s <a target="_blank" href="http://smilesoftware.com/TextExpander/touch/index.html">TextExpander Touch</a> support. To set this up, first make a new TextExpander snippet more or less like this:

 ![](http://n8henrie.com/wp-content/uploads/2013/03/20130323_IMG_07411.PNG)

Once that&#8217;s done, go through the steps above to create the action, but don&#8217;t finalize it yet. Placing the cursor in the Body field of the action, you can hit the **te** button above the keyboard to the far right, and it will insert **<>**. Between these, put in the name of your TextExpander snippet ( **,timestamp** in my example). I used <a target="_blank" href="http://docs.python.org/2/library/datetime.html#strftime-and-strptime-behavior">this key</a> at the bottom of the Python datetime documentation to remind me what all the little percent characters meant.

#### Setup for second method (requires LCP, Drafts, and Mail Drop address)

This is somewhat silly, bit I really didn&#8217;t like having to click the &#8220;Send&#8221; button in the previous workflow. I wanted it to just give me a prompt, click &#8220;Go&#8221;, and be done (the way that Drafts doesn&#8217;t prompt me to &#8220;Send&#8221; the email, it just does it). So I took a few seconds to compose a URL that just redirects the LCP prompt to Drafts, which sends the email, and returns the focus to LCP (via <a target="_blank" href="http://x-callback-url.com/">x-callback-url</a> support). I was pleased to find that it does this very quickly.

For this to work, you&#8217;ll first need to set up an &#8220;Email Action&#8221; in Drafts. Here is how mine is set up:
  
* Name: Email to OmniFocus (this matters, you&#8217;ll see why soon. And this parenthetical statement is not part of the name. Duh.)
  
* To: Your\_OmniFocus\_Mail\_Drop\_Beta_Address@sync.omnigroup.com
  
* Subject: First Line
  
* Send in Background: On

I also went into &#8220;Manage Actions&#8221; and set Drafts to &#8220;Delete&#8221; after success. Your call on this one, but if you leave it off, you&#8217;ll probably have a bunch of Drafts building up over time that will require manual deletion.

Once this is set up, write some junk and test the action to make sure it&#8217;s working. Your tasks should be synced into OmniFocus in just a few seconds.

Now, return to LCP. This time, create a new &#8220;Custom URL&#8221; action. Assuming your Drafts action is also called Email to OmniFocus, paste in the below URL. If you chose a different name, you&#8217;ll need to URL encode it, delete everything between **&action=** and **&x-success=**, and place it there.

> drafts://x-callback-url/create?text=[prompt]&action=Email%20to%20OmniFocus&x-success=launchpro://

Also, if you have Drafts set to use a key for added security with incoming URLs, add **&key=Your_Key** immediately before **&x-success**.

Don&#8217;t forget to give the action a name (I like QuickFocus) and an icon you like. Here&#8217;s mine:

 ![](http://n8henrie.com/wp-content/uploads/2013/03/20130323_IMG_07401.PNG)

When you launch the action, you&#8217;ll get the LCP prompt just like before, but this time when you hit Go&#8230;

 ![](http://n8henrie.com/wp-content/uploads/2013/03/20130323_IMG_07451.PNG)

…you&#8217;ll see the screen launch into Drafts momentarily, then immediately return to LCP.

The upside of this method is not having to hit &#8220;Send.&#8221; The downside is no ability to add a datestamp or custom stuff to the message body like the previous action. Then again, it might be possible with a little URL tweaking, but I&#8217;m not going to bother with that for now.

In closing… here&#8217;s a screenshot of my LCP layout. Just because.
  
 ![](http://n8henrie.com/wp-content/uploads/2013/03/20130323_IMG_07391.PNG)