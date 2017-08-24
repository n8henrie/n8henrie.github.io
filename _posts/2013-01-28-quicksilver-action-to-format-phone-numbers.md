---
id: 1982
title: Quicksilver Action to Format Phone Numbers
date: 2013-01-28T17:46:00+00:00
author: n8henrie
excerpt: I hate how people format phone numbers in a million different ways. Just in the same way that I think YYYYMMDD is the best way to do dates, I prefer my phone numbers to be just 10 digits. No parentheses or dashes or spaces to get in the way, just numbers. I realize that they're harder to read this way, but to be honest I practically never need to actually "read" a phone number. I just put throw into my iPhone, Contacts.app, Google Contacts, Google Voice, or what have you. Most of them do a pretty good job of figuring out the formatting, but feeding them 10 straight digits always works. No funny special characters to choke on.
layout: post
guid: http://n8henrie.com/?p=1982
permalink: /2013/01/quicksilver-action-to-format-phone-numbers/
al2fb_facebook_exclude:
  -
al2fb_facebook_exclude_video:
  -
al2fb_facebook_link_id:
  - 506452318_10151366227582319
al2fb_facebook_link_time:
  - 2013-01-28T22:46:22+00:00
al2fb_facebook_link_picture:
  - featured=http://n8henrie.com/?al2fb_image=1
dsq_thread_id:
  - 1052049578
disqus_identifier: 1982 http://n8henrie.com/?p=1982
tags:
- applescript
- automation
- Mac OSX
- Quicksilver
- Terminal
categories:
- tech
---
**Bottom Line:** You can install this <a target="_blank" href="http://qsapp.com/">Quicksilver</a> action to automatically format phone numbers to your liking.

<!--more-->

I hate how people format phone numbers in a million different ways. Just in the same way that I think YYYYMMDD is the best way to do dates, I prefer my phone numbers to be just 10 digits. No parentheses or dashes or spaces to get in the way, just numbers. I realize that they're harder to read this way, but to be honest I practically _never_ need to actually "read" a phone number. I just put throw into my iPhone, Contacts.app, <a target="_blank" href="https://google.com/contacts">Google Contacts</a>, <a target="_blank" href="https://voice.google.com">Google Voice</a>, or what have you. Most of them do a pretty good job of figuring out the formatting, but feeding them 10 straight digits _always works_. No funny special characters to choke on.

That said, it drives me crazy to copy a phone number from the screen to the clipboard, then paste it (usually into Quicksilver), the manually arrow back to the parentheses and dashes and spaces and delete all the extra crap to turn `1 (505) 123—4567` into `5051234567`

So I wrote a script with bash, AppleScript, and Quicksilver to do it for me. To be honest, more than anything, writing this script was way to learn a bit more about string manipulation, passing variables back and forth between shell and AppleScript, and how to make custom <a target="_blank" href="http://qsapp.com/">Quicksilver</a> actions... but I figured I'd share it anyway.

I'll go through the workflow backwards, starting with the nuts and bolts of the bash part.

Here's the bash part. It takes input from and returns to AppleScript, which is how Quicksilver actions work. I've tried to do a decent job explaining steps in the comments. I set it to work with strings containing 7, 10, or 11 digits and spit out an error if there are more or less than that. It copies the formatted phone number to the clipboard (pbcopy) as well as returns it to Quicksilver ( echo $(pbpaste) ). I like having <a target="_blank" href="http://growl.info/extras.php#growlnotify">growlnotify</a> tell me what's going on, but I commented out those lines so if you don't have it installed the script hopefully won't choke.

```bash
#!/bin/bash -e
 
#Originally posted at http://n8henrie.com/2013/01/quicksilver-action-to-format-phone-numbers
#Corresponding AppleScript for integration with Quicksilver at http://pastebin.com/hKH9hyxn
 
# Uncomment the growlnotify lines if you've installed growlnotify (highly recommended, get it at http://growl.info/extras.php#growlnotify ).
 
#The "cat" here reads the input from the "echo " in the AppleScript action used by Quicksilver.
theNumber=$(cat);
#theNumber="0293209fjps9djf9s8dfu982392839ufsd89fu"; #comment the cat line and uncomment this for testing.
 
#Get rid of all non-digit characters
numberTrimmed=$(echo $theNumber | tr -cd "0123456789");
 
#If it's got 7 or 10 digits left, go with that.
if [[ ${#numberTrimmed} = 7 || ${#numberTrimmed} = 10 ]]
then
echo -n $numberTrimmed | pbcopy;
echo $(pbpaste);
# /usr/local/bin/growlnotify "n8henrie.com" -m "The phone number should be on your clipboard."
 
#If it's got 11 digits (like the preceding 1), take the last 10.
elif [[ ${#numberTrimmed} = 11 ]]
then echo -n $(echo -n $numberTrimmed | rev | cut -c 1-10 | rev) | pbcopy;
echo $(pbpaste);
# /usr/local/bin/growlnotify "n8henrie.com" -m "The phone number should be on your clipboard."
 
#Something went wrong.
else
growlMessage="I think something went wrong with fixPhoneNumbers.sh."$'\n\n'"Are you sure the string you sent it has either 7, 9, or 10 digits?"
#/usr/local/bin/growlnotify "n8henrie.com" -m "$growlMessage"
echo $growlMessage
fi
```

Quicksilver actions are written in AppleScript, and take in and return strings pretty intuitively. Sending and receiving variables and strings to and from bash requires some creating quoting, but seems to work great. Save this as

`~/Library/Application Support/Quicksilver/Actions/Clean phone number.scpt`

```applescript
--Originally posted at http://n8henrie.com/2013/01/quicksilver-action-to-format-phone-numbers
--Corresponding bash script at http://pastebin.com/Dje7s4A7
 
property pathToShellScript : "/Users/.../fixPhoneNumbers.sh"
 
using terms from application "Quicksilver"
        on process text str
               
                set result to do shell script "echo \\"" & str & "\\" | " & quoted form of pathToShellScript
               
                return result
               
        end process text
end using terms from
```

Once you've saved it there, you might need to restart Quicksilver (ctrl + cmd + Q) or at least refresh the catalog (opt + cmd + r while QS is open) to get Quicksilver to notice it... but after that you should be able to take a string from the first frame and run "Clean phone number" as the action. Here's how it works IRL — enjoy!

[<img src="{{ site.url }}/uploads/2013/01/20130128_20130128-ScreenShot-851-266x300.jpg" alt="Running in Quicksilver" width="266" height="300" class="aligncenter size-medium wp-image-1988" srcset="{{ site.url }}/uploads/2013/01/20130128_20130128-ScreenShot-851-266x300.jpg 266w, http://n8henrie.com/uploads/2013/01/20130128_20130128-ScreenShot-851.jpg 361w" sizes="(max-width: 266px) 100vw, 266px" />]({{ site.url }}/uploads/2013/01/20130128_20130128-ScreenShot-851.jpg)
