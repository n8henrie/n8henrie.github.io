---
id: 2060
title: A Strategy for UI Scripting in AppleScript
date: 2013-03-20T21:45:18+00:00
author: n8henrie
excerpt: |
  |
    I generally think AppleScript is a lot of fun. It's close enough to plain English that even beginners like me can read a script and understand a good amount of what it's trying to accomplish, then use that as a framework to write their own custom scripts to automate myriad tasks on a Mac.
layout: post
guid: http://n8henrie.com/?p=2060
permalink: /2013/03/a-strategy-for-ui-scripting-in-applescript/
dsq_thread_id:
  - 1153376076
disqus_identifier: 2060 http://n8henrie.com/?p=2060
tags:
- applescript
- automation
- Mac OSX
categories:
- tech
---
**Bottom Line:** Getting AppleScript to simulate clicks and keystrokes can be frustrating, but using Accessibility Inspector and the “UI Elements” command can make it easier.<!--more-->

**Update 20140802:** The most important part of the post starts down at the UI elements section below. Also, keep in mind that you have to tell System Events to tell application **process** `UI elements`… if you forget “process” it’s not going to work.

I generally think [AppleScript is a lot of fun](http://n8henrie.com/tag/applescript/). It’s close enough to plain English that even beginners like me can read a script and understand a good amount of what it’s trying to accomplish, then use that as a framework to write their own custom scripts to automate myriad tasks on a Mac.

One of the handy things AppleScript can do is simulate mouse clicks and keyboard keystrokes through a process called UI Scripting, which uses the System Events app. I think Python might be able to accomplish this with Appscript, but other than that, I’d say AppleScript is one of the only ways to do this. One example of putting this to use is my [UpdateiOSApps.scpt](http://n8henrie.com/2012/12/applescript-to-update-ios-apps-in-itunes/) I wrote a few months ago, which uses some UI scripting to get iTunes to the iOS Apps screen (cmd 7), check for new apps (cmd r), and download the updates.

Now that last part is really the trick. You don’t want to tell it to just click a certain point on the screen, since if the screen layout changed for some reason it might just click the “delete everything and make my Mac explode” button or something. Besides, if you wanted to share your script, everyone with a different screen size or device would have to reinvent the wheel.

Instead, you have to navigate through tons of ambiguously named documents and windows and UI elements and find out what they want to be called and build those into your Applescript. One tool that helps out considerably is <a target="_blank" href="http://developer.apple.com/library/mac/#documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTesting/OSXAXTestingApps.html">Apple’s Accessibility Inspector</a>, which comes as part of Xcode (available for free in the Mac App Store).

I’m not inclined to give a comprehensive overview of how Accessibility Inspector works, but I will mention a few things. This will probably make more sense if you start it up as you read along.

![]({{ site.url }}/uploads/2013/03/20130320_20130320-ScreenShot-120.png)

So this is what Accessibility Inspecture looks like. Both the Hierarchy and Attributes panes are dynamic and will change as you move your mouse cursor over various parts of a given app. Like it says at the bottom, you can lock it (cmd F7) while hovering over a particular item that you’re interested (such as a button you want the script to click) to give you a static display of the hierarchy and attributes of that UI element.

For example, here’s the Download All Free Updates button in iTunes that I alluded to above…

 ![]({{ site.url }}/uploads/2013/03/20130320_20130320-ScreenShot-122.jpg)

…and here’s the Accessibility Inspector when locked on that element.

![]({{ site.url }}/uploads/2013/03/20130320_20130320-ScreenShot-121.jpg)

Notice the four triangles down bottom. These are useful for navigating to parents, children, and siblings of a given UI element. What this means is that you might be looking at a screen with a divider and a button on the right side of the divider. In such a case, it’s possible that the screen UI Element is set up as the “parent” of the divider UI element, which is the parent of the button “UI Element.” You’ll eventually be using these to build a command such as

```applescript
tell screen 1 to tell divider 1 to tell button 1 to perform action "AXPress"
```

However, one of the biggest problems is what to call each UI Element. As you can see in the Attributes, there are descriptions and roles and titles…. and while I have seen some scripts employing strategies like ‘tell the first UI element whose role is “AXLink” to…’ and others that just use the title (e.g. ‘tell “loading iTunes store” to…’), I have had _really_ inconsistent results doing this. When they have none of these attributes, you really have no choice but to use a number (as in “tell window 1”). However, this can be problematic as well, as different view options (e.g. sidebars) may change the number of the element you want. _Gah._

Even worse, you’ll find that what is suggested by Accessibility Inspector (AI) and what AppleScript Editor likes are often two different things. For example, it took me quite a bit of Googling to figure out that while AI tells me that an element has the role “AXSplitGroup” and description “split group,” Applescript Editor only understands when I refer to it as a “splitter group.” While this makes sense once you’re told, I certainly did not intuitively think that I should try this name when fed “split group” and “AXSplitGroup” by Accessibility Inspector.

I’m going to jump tracks a bit here to talk about why this matters. When talking to AppleScript, you have to specify a full hierarchy to get anything done. As I said before, you’ll be doing this through the System Events app, which “tells” the process (not the application — note that the process may have a different name, which you may be able to divine using Activity Monitor, which is preinstalled on your Mac), which “tells” its children UI Elements what to do. Also, some parts of UI Scripting can only work on what it can see, in the same way that you can’t click a button that you can’t see. So when we start UI Scripting, we’ll start our AppleScript with a few lines that get things set up by starting the conversation with System Events and bringing the application in question into focus.

<script src="http://pastebin.com/embed_js.php?i=cDVq0ic8"></script>

Try this out. It should bring iTunes into focus. Now on some systems (esp. older ones like mine) the app might not quite make it into focus before the next line of AppleScript is run, which presents a problem. For this reason, I’ll often add a **delay 1** to give the app a second to come fully into focus.

## UI Elements

Here’s where I tell you the one tip that makes this post worthwhile. Well, I was glad to learn it, at least. It’s that you can give the simple command `UI elements` to UI Scriptable UI elements, and they will return a list of their elements — _with names that work_ — to the Results window in Applescript Editor. For example, here is a screenshot of the script with the delay and “UI elements,” including the returned results.

![]({{ site.url }}/uploads/2013/03/20130320_20130320-ScreenShot-123.jpg)

If you’ll scroll up a bit to the screenshot of Accessibility Inspector while locked onto the “Download All Free Apps” button, you’ll see in the hierarchy (top) pane that our top-level UI element is application. We’ve taken care of this with the **to tell process “iTunes”**. The next level below that is AXWindow:AXStandardWindow … so we’re looking for a window. Sure enough, in the AppleScript Editor results pane, we see a “window” named “iTunes.” So then we can “tell” this UI element to list _its_ UI element children. Here is how we would do that, including the results (as a comment below the script). As you can see, we have a lot more to sort through this time.

<script src="http://pastebin.com/embed_js.php?i=ysd3JZdg"></script>

Looking at Accessibility Inspector, the next UI element we’re looking for is an “AXSplitGroup.” As I mentioned above, I had a heck of a time trying to figure out what AppleScript Editor wanted me to call “AXSplitGroup.” Sorting through the returned results in the bottom pane, there is only one item that catches my eye — **splitter group 1** — and sure enough, it works like a charm. Follow the next logical step and we can see in the returned results **UI element “loading iTunes store”**, which (again) matches the AXDescription in the Attributes section of the Accessibility Inspector screenshot above. We’re clearly on the right track. Add in a **tell UI element “loading iTunes store”** (and its “end tell” of course), and you should have:

<script src="http://pastebin.com/embed_js.php?i=eDheaxPf"></script>

Search its returned results to find the “Download All Free Updates” button we’ve been looking for, which you can tell to **perform action “AXPress”** to click.

I think I’ll end this post here. Again, the main idea is that Accessibility Inspector does a pretty good job giving you the basic UI elements that you’ll need to “tell” in order to successfully run your UI script. However, sometimes the names used in AI won’t work quite right in AppleScript Editor. Working in conjunction with AppleScript Editor’s **UI Elements** command will make it far easier to figure out exactly how you need to write your script to get it up and running.

**Update 20151027:** I got [a very good question](http://n8henrie.com/2013/03/a-strategy-for-ui-scripting-in-applescript/#comment-2324286651) in the comments below by Carlo DelPizzo, asking about the best way to figure what “number” a UI element is. In other words, there are often numerous “buttons” or “menu items” or “windows”, and Accessibility Inspector doesn’t help you figure out which number a specific element is going to be. Unfortunately, there’s not a single answer that always works, so some of my strategies are:

  * Don’t use the numbers, instead look for the “description” in Accessibility Inspector, and use that instead (assuming it’s unique). For example, instead of \`tell button 2 to…\`, use \`tell first button whose description is “foo” to…\`
  * Use something like <a href="http://hints.macworld.com/article.php?story=20111208191312748" target="_blank">this suggestion</a> where you write a script something like the below, copy and paste the results into your favorite text editor, and try to search for the relevant button that way.
        tell application "System Events" to tell application process "Google Chrome"
        	set stuff to entire contents of front window
        end tell
        return stuff

  * Finally, you can always just iterate through all the UI elements and have them return something like their \`description\`, \`name\`, or \`value\`, to see if that helps, e.g.:
        tell application "System Events" to tell application process "Google Chrome"
        	set counter to 1
        	set mybuttons to every button in toolbar 1 of window "Bar"
        	repeat with mybutton in mybuttons
        		display dialog counter & ": " & (description of mybutton) as string
        		set counter to counter + 1
        	end repeat
        end tell

    .

    Afterwards, of course you can verify by \`tell button # to display dialog (description as string)\`.

    Hope that helps! If anyone has better suggestions, please put them in the commmnts below!
