---
id: 57
title: DropVox, DropBox, Hazel, and OmniFocus
date: 2011-06-14T02:39:00+00:00
author: n8henrie
layout: post
guid: http://www.n8henrie.com/?p=57
permalink: /2011/06/dropvox-dropbox-hazel-and-omnifocus/
blogger_blog:
  - www.n8henrie.com
blogger_author:
  - Nathan Henrie
blogger_permalink:
  - /2011/06/dropvox-dropbox-hazel-and-omnifocus.html
blogger_images:
  - 1
dsq_thread_id:
  - 812645444
disqus_identifier: 57 http://n8henrie.com/?p=57
---
<div>
  <p>
    This will probably not make any sense to the majority of my friends and family, but an inexpensive but ingenious iPhone app DropVox has inspired me to make a quick post to highlight how I put it to use.  First, a very quick introduction to each of the components; honestly they each deserve their own post, but time constraints&#8230; you know.
  </p>
  
  <p style="text-align: center;">
    <a href="http://www.omnigroup.com/products/omnifocus" title="OmniFocus" target="_blank"><span style="font-size: medium;"><strong>OmniFocus</strong></span></a>
  </p>
  
  <p>
    For starters, I use OmniFocus as my primary task manager.  If you haven&#8217;t checked it out, the main reasons I love it are:
  </p>
  
  <p>
     
  </p>
  
  <ul>
    <li>
      Excellent cloud sync with native iPhone app
    </li>
    <li>
      Quick Entry Shortcut
    </li>
    <li>
      Context support
    </li>
    <li>
      Start date support
    </li>
    <li>
      Repeating tasks support
    </li>
    <li>
      Scriptable (see below)
    </li>
    <li>
      Stable
    </li>
  </ul>
  
  <p>
     
  </p>
  
  <p>
    The biggest thing it lacks IMO is task sharing.  However, I don&#8217;t expect many of my peers to plunk down the cash for OF in the first place, so I use <a href="http://www.6wunderkinder.com/wunderlist" title="Wunderlist" target="_blank">WunderList</a> (free) for shared tasklists.
  </p>
  
  <p>
    The OmniFocus iPhone app has great features like &#8220;Map&#8221; mode, where you can assign locations to contexts, and it will sort your available tasks by distance from you, as will as letting you take pictures and voice memos and attach them to your tasks.
  </p>
  
  <p style="text-align: center;">
    <a href="http://www.noodlesoft.com/hazel.php" title="Hazel" target="_blank"><span style="font-size: medium;"><strong>Hazel</strong></span></a>
  </p>
  
  <p style="text-align: left;">
    <span style="font-size: small;">Hazel is like folder actions on steroids.  (&#8220;Folder actions&#8221; is a neat tool that Apple built into OSX that lets you &#8220;do something&#8221; every time a file is added to a particular folder.)  I use it to do things like &#8220;take every file I&#8217;ve downloaded or on my desktop that is over 1h old and <5MB and copy it to a particular folder in my DropBox ("DumpBox").  Then take any file in that folder that's over 2w old and trash it.  In combo with DropBox iPhone (or webapp), this has come in handy countless times, almost eliminating those "Dang, wish I had that file I just downloaded!" moments.  Of note, Hazel can also do cool things like run an applescript or set a Growl notification when it is invoked.</span>
  </p>
  
  <p style="text-align: center;">
    <a href="https://www.dropbox.com/" title="DropBox" target="_blank"><span style="font-size: medium;"><strong>DropBox</strong></span></a>
  </p>
  
  <p>
    If you don&#8217;t know about DropBox&#8230; well, you&#8217;ll have to read about it somewhere else.  I&#8217;ll just quickly note that DropBox + GoodReader (iPhone) + Hazel make a killer combo for remote-controlling my MBP from my iPhone.  For example, I can upload a file via GoodReader to a DBox folder that matches a Hazel script which runs an applescript&#8230; possibilities are endless.
  </p>
  
  <p style="text-align: center;">
    <a href="http://www.irradiatedsoftware.com/dropvox/" title="DropVox" target="_blank"><span style="font-size: medium;"><strong>DropVox</strong></span></a>
  </p>
  
  <p>
    DropVox (iOS) does one thing&#8230; awesome.  I have it set so that I click (press?) the app, it launches straight to recording mode.  I speak, click stop &#8211; it automatically uploads to a preset DropBox folder.  Just like that.  The newest update even lets it upload in the background.  Beautiful.
  </p>
  
  <p style="text-align: center;">
    <span style="font-size: medium;"><strong>Putting it all together&#8230;</strong></span>
  </p>
  
  <p>
    While OmniFocus iPhone is overall excellent, its voice memo implementation is lacking.  Not only does it take a bit longer to press ~3 buttons (including some scrolling) to get to the OF voice recorder, most importantly, I have to look at my iPhone to do it.  Compared with 1-click DropVox &#8212; well, there is no comparison, I guess.  However, I want those voice memos to get into OF so I remember to process them.  Can you see where this is going?
  </p>
  
  <p>
    DropVox uploads to a particular DropBox folder, which syncs to my Mac, which Hazel monitors and runs an applescript (below) that imports it into OmniFocus.  Best part is, if my MBP isn&#8217;t running or isn&#8217;t on WiFi at the time, DropBox just holds onto everything until later.
  </p>
  
  <p style="text-align: center;">
    <span style="font-size: medium;"><strong>Shortcomings:</strong></span>
  </p>
  
  <ul>
    <li>
      The voice memo isn&#8217;t transcribed
    </li>
    <li>
      The voice memo isn&#8217;t playable by OF iPhone (which only likes some weird Apple loops format)
    </li>
  </ul>
  
  <p>
    Together, this means that I have to manually process the audio files the next time I&#8217;m at my MBP (using spacebar to &#8220;quick look&#8221;).  Worth it for me.  An alternative is to use <a href="http://www.reqall.com/" title="ReQall" target="_blank">ReQall</a> or <a href="https://accounts.google.com/ServiceLogin?service=grandcentral&passive=1209600&continue=https://www.google.com/voice&followup=https://www.google.com/voice&ltmpl=open" title="Google Voice" target="_blank">Google Voice</a> and an email-to-Dropbox service (<a href="http://sendtodropbox.com" title="SendToDropbox" target="_blank">SendToDropbox</a>), as I&#8217;ve detailed ad nauseam at the OmniGroup forums in <a href="http://forums.omnigroup.com/showthread.php?t=11543" title="Voice to OmniFocus" target="_blank">this thread</a>.
  </p>
  
  <p>
    Anyway, this post has taken too much time as is.  I have my surgery shelf Friday.  Time to hit the books!
  </p>
  
  <p>
     
  </p>
  
  <p style="text-align: center;">
    <span style="font-size: medium;"><strong>Applescript</strong></span>
  </p>
  
  <p style="text-align: center;">
    (note that I have Hazel trash the original file after running this script)
  </p>
</div>