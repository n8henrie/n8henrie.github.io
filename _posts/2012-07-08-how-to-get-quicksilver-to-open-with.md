---
id: 12
title: 'How to Get Quicksilver to Open with&#8230; TextWrangler'
date: 2012-07-08T00:45:00+00:00
author: n8henrie
layout: post
guid: http://www.n8henrie.com/?p=12
permalink: /2012/07/how-to-get-quicksilver-to-open-with/
blogger_blog:
  - www.n8henrie.com
blogger_author:
  - Nathan Henrie
blogger_permalink:
  - /2012/07/how-to-get-quicksilver-to-open-with.html
geo_latitude:
  - 35.0729762
geo_longitude:
  - -106.6173415
geo_address:
  - Albuquerque, NM 87106, USA
blogger_images:
  - 1
dsq_thread_id:
  - 813563671
yourls_shorturl:
  - http://n8henrie.com/n8urls/3
---
**Bottom line:** You can get an app to show up in Quicksilver or Finder’s “Open with…” list by editing the app’s info.plist.

<!--more-->

If there is a single app that I couldn’t use my Mac without, it’s <a target="_blank" href="http://qsapp.com/" title="Quicksilver Homepage">Quicksilver</a>. I started using it when it was out of active development and slowly starting to break down, and it’s been my good fortune that a new crew of very active developers has taken the open-source project to new heights, with new updates to the app and its plugins _all the time_. It could be categorized as an “app launcher,” but it really does so much more. It’s hard to explain, but you can think of it as an app that has 2 or 3 panes that act like when you used to dissect sentences in grammar class. In the first pane, you tell it what you want to act on (the subject), and in the second pane you tell it what you want it to do (verb). Occasionally, you give it a bit more information (time, a location, etc.) in the third pane. Over time, it learns what you do most often and gets better about figuring out what you want it to do.

The possibilities are endless, but a few examples include [1st pane : 2nd pane : 3rd pane (if any)]:

  * Document.doc : Open with&#8230; : Pages.app
  * Chrome.app : Open
  * File.txt : Move to… : Example folder
  * “Don’t forget dinner on the stove!” : Large text : 10 min
  * “Get back to work, Nate” : Speak text (say)
  * File.html : Rename : DifferentName.html
  * www.wikipedia.com : open in… : Opera.app
  * Under The Bridge : Play (in iTunes)
  * Tomatos : Append to… : Shopping_list.txt

It indexes my bookmarks in Chrome, my documents, my apps, any folder I tell it to, it integrates with apps’ built-in services, you can make custom keyboard shortcuts, it’s scriptable, and because it’s all keyboard-based, it is _tons_ faster than using the mouse / trackpad to do these things. Nearly everyone I’ve gotten to give it a fair shot has become addicted within a week; there’s nothing like it.

One other app I use more than I ever would have thought is <a target="_blank" href="http://www.barebones.com/products/textwrangler/" title="TextWrangler">TextWrangler</a>, also available in the Mac App store (though I like the app store version _less_ because it doesn’t authenticate as root for editing system files). One of the features I adore in TextWrangler is its implementation of <a target="_blank" href="http://en.wikipedia.org/wiki/Grep">grep</a>, which is essentially a _really_ powerful find and replace function. I use it to scour large files for the bits of data I need, or frequently to rearrange information in a file so it will output a <a target="_blank" href="http://en.wikipedia.org/wiki/Comma-separated_values">csv</a> that I can then import into a spreadsheet.

Well, my problem was I could select a file in Quicksilver, go to “Open with…” and TextWrangler frequently wasn’t an option. It would be there for text files, or html, or xml, but files that were in strange formats or lacked an extension altogether, it wouldn’t show up. Similarly, when you use the right click in Finder to “Open with,” TextWrangler wasn’t there, either. I had to go through the “Open with” -> “Other” and hunt down TextWrangler in my Applications folder every time. This was getting to be a big hassle.

Then, I remembered having fixed this same problem at some point in the last couple of years with another app. I couldn’t remember how, so I asked Quicksilver’s über-helpful voice on the web, <a target="_blank" href="https://twitter.com/lovequicksilver">@LoveQuicksilver</a>, who set me on the right track.

To cut to the chase, I knew it had to do with opening TextWrangler.app (show contents) and fiddling with the info.plist, which is what OSX’s LaunchServices uses to figure out what apps can open what. I messed with CFBundleDocumentTypes stuff and lsItemContentTypes and public.data stuff until my brain fried, but what eventually worked was to find another app that seemed to be able to open everything (I used Xcode), look at its info.plist (with TextWrangler, or your text editor of choice), and try to copy it.

Here’s what I ended up copying:

        <dict><br />        <key>CFBundleTypeExtensions</key><br />        <array><br />            <string>*</string><br />        </array><br />        <key>CFBundleTypeName</key><br />        <string>Anything</string><br />        <key>CFBundleTypeOSTypes</key><br />        <array><br />            <string>****</string><br />        </array><br />        <key>CFBundleTypeRole</key><br />        <string>Viewer</string><br />    </dict><br />

I pasted this into TextWrangler’s info.plist, and it worked like magic when nothing else would. The plist has an array that starts with:

        <key>CFBundleDocumentTypes</key><br />    <array><br />        <dict><br />            <key>CFBundleTypeIconFile</key><br />

and ends with:

            </dict>     <br />    </array><br />    <key>CFBundleExecutable</key><br />

I pasted it at the end, between the </dict> and </array>. To see the effect, you have to make LaunchServices reindex TextWrangler:

> /System/Library/Frameworks/CoreServices.framework/Versions/A/Frameworks/LaunchServices.framework/Versions/A/Support/lsregister -f /Applications/TextWrangler.app 

Then, relaunch Finder (Command + Option + Escape). I don’t think I had to relaunch Quicksilver, but if you’re having problems you can give that a shot, too. (Quicksilver.app : Relaunch)

<div style="clear: both; text-align: center;">
  <a href="http://www.n8henrie.com/wp-content/uploads/2012/08/ScreenShot2012-07-06at6.30.46PM1.jpg" style="margin-left: 1em; margin-right: 1em;"><img border="0" height="268" src="http://www.n8henrie.com/wp-content/uploads/2012/08/ScreenShot2012-07-06at6.30.46PM.jpg" width="640" /></a>
</div>

I’m quite pleased with the result, which gives me the option to open any file type in TextWrangler in a fraction of a second with Quicksilver. If you’re a Mac user, and you haven’t tried <a target="_blank" href="http://qsapp.com/" title="Quicksilver Homepage">Quicksilver</a> or <a target="_blank" href="http://www.barebones.com/products/textwrangler/" title="TextWrangler">TextWrangler</a>… give them a shot.

<div>
</div>