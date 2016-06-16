---
id: 2457
title: 'MultiLineOmniFocus V2:  Improved Launch Center Pro and Callback Support'
date: 2014-01-14T12:24:25+00:00
author: n8henrie
excerpt: Small update to my Pythonista script for sending multiple tasks to OmniFocus at once from iOS that improves LCP and callback support.
layout: post
guid: http://n8henrie.com/?p=2457
permalink: /2014/01/multilineomnifocus-v2-improved-launch-center-pro-and-callback-support-3/
yourls_shorturl:
  - http://n8henrie.com/n8urls/63
dsq_thread_id:
  - 2122217519
---
**Bottom Line:** Small update to my Pythonista script for sending multiple tasks to OmniFocus at once from iOS. <!--more-->

**See [my original post](http://n8henrie.com/2013/03/send-multiple-tasks-to-omnifocus-at-once-with-drafts-and-pythonista/) for context.**

I had previously thought that <a target="_blank" href="https://itunes.apple.com/us/app/launch-center-pro/id532016360?mt=8&#038;at=10l5H6">Launch Center Pro</a> (now also <a href="https://itunes.apple.com/us/app/launch-center-pro-for-ipad/id799664902?mt=8&#038;at=10l5H6" target="_blank">available on iPad</a>) wouldn&#8217;t be unable to use my MultiLineOmniFocus script directly because its prompt can&#8217;t handle linebreaks. However, <a target="_blank" href="https://plus.google.com/115119158456853391806/about">Kyle Reamer</a> recently brought to my attention the fact that its <a target="_blank" href="https://itunes.apple.com/us/app/fleksy-happy-typing/id520337246?mt=8&uo=4&at=10l5H6" title="Fleksy - Happy Typing">Fleksy</a> keyboard _does_ support linebreaks. With a little testing, I found that it worked flawlessly with my existing MLOF script.

However, because <a target="_blank" href="https://itunes.apple.com/us/app/pythonista/id528579881?mt=8&uo=4&at=10l5H6" title="Pythonista">Pythonista</a> doesn&#8217;t support <a target="_blank" href="http://omz-software.com/pythonista/docs/ios/urlscheme.html">x-callback-url</a>, I had hard-wired it to return to <a target="_blank" href="https://itunes.apple.com/us/app/drafts/id502385074?mt=8&uo=4&at=10l5H6" title="Drafts for iPad">Drafts</a> irrespective of what app had launched the script.

By tweaking just a couple lines of code, I found I could add an extra parameter to the URL used to call MLOF and have it return to whatever app the user wants. I think I have it set so that it will default to returning to Drafts if this option isn&#8217;t set or is set incorrectly.

Here are a few examples:

<pre># Original URL to launch MLOF from Drafts, should still work:
pythonista://MultiLineOmniFocus?action=run&argv=[[draft]]

# New URL to launch MLOF from Drafts (and return to it):
pythonista://MultiLineOmniFocus?action=run&argv=[[draft]]&argv=drafts:

# New URL to launch MLOF from Launch Center Pro (and return to it):
pythonista://MLOF2?action=run&argv=[prompt-fleksy]&argv=launchpro:
</pre>

As you can see, all you need to add is `&argv=` and the URL of the app you want to launch (including the colon).

Here&#8217;s the updated gist: