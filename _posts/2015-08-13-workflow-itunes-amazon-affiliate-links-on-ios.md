---
id: 2751
title: Use Workflow to Make iTunes and Amazon Affiliate Links on iOS
date: 2015-08-13T09:08:59+00:00
author: n8henrie
excerpt: "Here's a Workflow Extension I made to generate iTunes and Amazon affiliate links and shorten them with Bitly."
layout: post
guid: http://n8henrie.com/?p=2751
permalink: /2015/08/workflow-itunes-amazon-affiliate-links-on-ios/
dsq_thread_id:
  - 4029226565
---
**Bottom Line:** Here&#8217;s a Workflow Extension I made to generate iTunes and Amazon affiliate links and shorten them with Bitly.<!--more-->

Like many bloggers, as part of my &#8220;tech fund&#8221; that pays server costs and keeps n8henrie.com up and running, I participate in the iTunes and Amazon affiliate programs.

While my favorite way to generate affiliate links &#8212; no contest &#8212; is <a href="http://brettterpstra.com/projects/searchlink" target="_blank">Brett Terpstra&#8217;s Searchlink</a>, the mechanisms for generating the links on iOS are less polished. (Though I found <a href="http://editorial-app.appspot.com/workflow/5803016212971520/Id9R-MLqQ4g" target="_blank">this effort to port SearchLink</a> to <a title="Pythonista" href="https://itunes.apple.com/us/app/pythonista/id528579881?mt=8&uo=4&at=10l5H6" target="_blank">Pythonista</a> interesting.)

However, I recently realized that a <a title="Workflow: Powerful Automation Made Simple" href="https://itunes.apple.com/us/app/workflow-powerful-automation/id915249334?mt=8&uo=4&at=10l5H6" target="_blank">Workflow Extension</a> seems like a pretty smooth way to generate these links. You can send a URL to an extension from the iOS App Store using the share button (top right) followed by choosing your extension down below (Workflow in this case).


<img class="aligncenter" src="http://n8henrie.com/uploads/2015/08/20150813_File_Aug_13__8_46_24_AM.jpg" alt="" width="227" height="403" /> 

I also wanted to make sure that my extension could accept URLs from the Safari share button when viewing an Amazon item and return a suitable link.

Finally, instead of returning a big ugly URL, I took advantage of a <a href="https://www.reddit.com/user/akhandar" target="_blank">u/akhandar</a>&#8216;s work <a href="https://www.reddit.com/r/workflow/comments/2pgba9/shorten_url_by_bitly/" target="_blank">posted at Reddit</a> to have the workflow shorten the link with Bitly. I have a custom domain tied into Bitly, so I get returned convenient little <a href="http://n8h.me" target="_blank">n8h.me</a> links.

I had to do a fair amount of tweaking and testing, but I think I have the extension fairly dialed in at this point. To customize it for yourself, you&#8217;ll first need to change the 3 placeholders up top (which are indicated by the variable name they&#8217;re stored in beneath each bit of text). Replace my info with your Amazon Affiliate tag, your iTunes Affiliate code, and a Bitly oath `access_token`, which you can get as a `Generic Access Token` at the bottom of <a href="https://bitly.com/a/oauth_apps" target="_blank">this page</a>. Please note that I have expired the Bitly access_token you&#8217;ll see, so you will at minimum need to change that value before it will work even for testing.

The workflow itself tried to filter out URLs from the passed in text, uses `expand URL` to try to clean it up, applies the appropriate tags based on whether the host is amazon.com or apple.com, then shortens and copies to the clipboard. Feel free to do some testing with <a href="http://redirectdetective.com/" target="_blank">Redirect Detective</a> to verify it seems to be working properly.

Once your values are plugged in you should be set to go! Give it a whirl and let me know if you run into any trouble &#8212; <a href="https://workflow.is/workflows/5942fafc9a974968a4fc5ed0535ea30d" target="_blank">here&#8217;s the Workflow</a>.