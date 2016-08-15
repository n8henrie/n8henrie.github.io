---
id: 2113
title: Send iMessage Messages with Quicksilver
date: 2013-04-07T12:00:17+00:00
author: n8henrie
excerpt: I love using Messages.app to text from OSX – much faster than trying to type on my mobile devices, and it syncs up all my conversations. It even prevents my phone from notifying me of new texts if I’ve already seen them on my Mac – a lot of thought has gone into it.
layout: post
guid: http://n8henrie.com/?p=2113
permalink: /2013/04/send-imessage-messages-with-quicksilver/
dsq_thread_id:
  - 1193684566
disqus_identifier: 2113 http://n8henrie.com/?p=2113
---
**Bottom Line:** This [AppleScript Action](http://n8henrie.com/2013/03/template-for-writing-quicksilver-actions-in-applescript/) for <a target="_blank" href="http://qsapp.com/" title="Quicksilver Website">Quicksilver</a> sends iMessages through Messages.app on your Mac without having to bring it into the foreground. <!--more-->

> Version 2 of the script [here](http://n8henrie.com/2013/06/send-imessages-with-quicksilver-v2/).

I _love_ using Messages.app to text from OSX &#8212; much faster than trying to type on my mobile devices, and it syncs up all my conversations. It even prevents my phone from notifying me of new texts if I&#8217;ve already seen them on my Mac &#8212; a lot of thought has gone into it. That said, it&#8217;s not always 100% reliable. For example, I have to check it fairly often for the little red explanation mark next to an outgoing text that signifies it not being sent properly. That&#8217;s a bummer, but you can just click the icon and resend&#8230; as long as you&#8217;ve noticed it wasn&#8217;t sent.

The other day I was clicking around in AppleScript Editor and noticed that Messages.app has its own AppleScript dictionary &#8212; pretty cool! I was able to use this with Quicksilver&#8217;s excellent AppleScript support to write a quick-and-dirty Quicksilver action to send texts through Messages. At this point, I&#8217;d say it&#8217;s functional but not great.

To &#8220;install&#8221; it:

  1. Save the action to `~/Library/Application Support/Quicksilver/Actions`.
  2. Open the script in AppleScript Editor and replace the AppleID property at the top with your own. Compile and save.
  3. Relaunch Quicksilver `cmd ctrl q` to have it reindex the actions folder.

Note that the script will be an eligible (second pane) action only if it detects a string in the first pane. 

> **Update Apr 26, 2013 thanks to <a href="https://twitter.com/p_j_r" target="_blank">@p_j_r</a>:** The script has been updated to now accept the text content in the _first_ and the _recipient_ in the third pane. This is much better, as it allows other scripts to return text content (e.g. a URL, text grabbed from an application) to the first pane. Previously you would have had to copy that to the clipboard and replace it with the contact, then paste into the third pane. **This may add some confusion**, however, as contacts will now be selectable in both the first and third panes, and **it will not work** if you select them in the first pane. If you have ideas on how I could add some kind of switch to allow either way, that would be great, but since both the message content and iMessage phone number or email address are both strings, I&#8217;m not sure how AppleScript could reliably distinguish which was which. 

So to use it, I select a contact in Quicksilver&#8217;s <del datetime="2013-04-27T02:20:26+00:00">first</del> third pane, then use the right arrow button to enter the contact&#8217;s info and select their iMessage email address or phone number. Note that the contact themselves will not work, you have to either select (or type in) an iMessage email address or phone number. For me, this works pretty well because I&#8217;ve been diligent about changing my friends&#8217; phone type to &#8220;iPhone&#8221; if they have one, so I can just enter a contact&#8217;s name, right arrow, type in &#8220;iph&#8221; and it selects the right one.

> **Update Jun 19, 2013:** I&#8217;ve made a second version of this script that allows you to make a &#8220;phonebook&#8221; that avoids the need to &#8220;arrow in&#8221; to contacts. Read more [here](http://n8henrie.com/2013/06/send-imessages-with-quicksilver-v2/).

In the second pane, select &#8220;Send with Messages&#8221; as the action, then in the <del datetime="2013-04-27T02:20:26+00:00">third</del> first pane hit period &#8220;.&#8221; to enter text mode and type in your message. Hit enter and it should send! If Messages.app is not running it will launch, if it is running, the message will send in the background without interrupting what you&#8217;re doing.

> ^^ Going to leave this mostly as is (except the two strikeouts) because the info is still mostly correct. Just reread the paragraphs in reverse order if you&#8217;re confused. First pane: text. Second pane: YourActionName.scpt. Third pane: Contact name -> iMessage number / address.

There are a few pending issues that I wish worked better, but may or may not be fixable without writing an actual Quicksilver plugin. Considering I don&#8217;t know any C, that might be an issue.

  * I would really like to put the message in the first pane and the recipient in the third to make it much quicker to [return something like a URL to Quicksilver](http://n8henrie.com/2013/03/bitly-applescript-url-shortener/) and message it to a friend. However, I can&#8217;t seem to get contacts as a valid indirect (3rd pane) object type, so this would break my &#8220;arrow into a contact&#8221; trick, and you&#8217;d have to manually type the phone number / email into the third pane.
  * I&#8217;d like to be able to index iMessage-able numbers &#8212; even if I had to do it manually &#8212; that indexed a number to a name, so I could just type in the name and not have to arrow into the contact and select the number.
  * Because it sends without bringing Messages.app into the foreground (which is kind of the point), I won&#8217;t see any message failure notifications unless I check manually. Scroll down below the script to see a workaround I&#8217;m curious about here.
  * I wish I didn&#8217;t have to hit the &#8220;period&#8221; to enter text mode in the 3rd pane. Some plugins have QS automatically enter text mode when text input is required, but I don&#8217;t know if this feature is available to AppleScript actions.

Here&#8217;s the script:



Okay, the workaround I mentioned above. If you open up the Messages.app AppleScript dictionary, you&#8217;ll notice it has a section of Events Handlers. Sure enough, you can open Messages.app, go to &#8220;Alerts,&#8221; and there are a whole series of events that you can have trigger scripts. If you check the &#8220;Run an AppleScript script:&#8221; alert, you can have it open the Messages.app scripts folder at `~/Library/Scripts/Messages/`. You can write and store scripts such as this there to have them run when certain events occur (logging in, sending a message, etc.):



I was thinking one could potentially use this to help ensure that messages are sent without errors. For example, at the end of the &#8220;Send with Messages&#8221; script above, add a command to run a second script that delays 30 seconds, then pops up a dialog box notifying you that there was an error. Then, in the events handler script, have it try to cancel the first script. Theoretically, I would hope this would make it so that the dialog only popped up if the message was not successfully. Unfortunately, this would only work for messages send with the script above, and it wouldn&#8217;t work if the handler script runs on failed messages as well as successful ones&#8230; Just a thought.

Anyway, if anyone has ideas on improving these, feel free &#8212; all posted as GitHub Gists, so have at it!