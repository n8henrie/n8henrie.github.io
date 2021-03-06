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
tags:
- automation
- Drafts
- iPad
- iPhone
- OmniFocus
- productivity
- Pythonista
categories:
- tech
---
**Bottom Line:** I often come up with several tasks I need to jot down at once, and this script helps me get them all into OmniFocus in one shot. <!--more-->

**Updated Jan 14, 2014: MultiLineOmniFocus V2 Available [here](http://n8henrie.com/2014/01/multilineomnifocus-v2-improved-launch-center-pro-and-callback-support-3/). Still recommended to read this post for background.**

**NB:** _The script in this post is set up to use <a target="_blank" href="https://itunes.apple.com/us/app/drafts/id502385074?mt=8&at=10l5H6" title="Drafts on iTunes">Drafts</a>, <a target="_blank" href="https://itunes.apple.com/us/app/pythonista/id528579881?mt=8&at=10l5H6" title="Pythonista on iTunes">Pythonista</a>, <a target="_blank" href="https://itunes.apple.com/us/app/omnifocus-2-for-iphone/id690305341?mt=8&at=10l5H6" title="OmniFocus iPhone on iTunes">OmniFocus</a>, access to the OmniGroup's Mail Drop Beta, and a <a target="_blank" href="http://gmail.com">Gmail</a> email address. It may be possible to use the basic principles with a different setup (esp. re: Gmail, shouldn't be hard to configure a different SMTP server), but you may need to get your hands dirty._

I do my best to keep the load of tasks "on my mind" to a minimum by getting them into <a target="_blank" href="https://itunes.apple.com/us/app/omnifocus/id402835630?mt=12&at=10l5H6" title="OmniFocus at Mac App Store">OmniFocus</a> on the fly. However, sometimes my thoughts race a bit, and I realize I'm juggling maybe 4 or 5 ideas that I really ought to get filed away before I forget them. On my Mac, it's a simple matter to invoke the OmniFocus Quick Entry box, type a task, and hold **Shift + Enter** to go directly to a second task, making it seamless to input as many as I need at once. _Protip: If you have your Quick Entry box set up to allow you to set Projects and Contexts, you can use **⌘ + d** to **d**uplicate a task, including title and context._

However, as the general rule goes, things on iOS are not quite this smooth. While OmniFocus does provide an in-app quick entry button, for entering a handful of tasks, the process is something like:

  1. Launch OmniFocus.
  2. Wait for for the sync to finish (usually pretty quick).
  3. Click the quick task button.
  4. Type task.
  5. Click save.
  6. Repeat 3-5 for each task.

Now this really isn't that bad — OmniGroup has done a great job making this process pretty darn low-friction. However, I have only [recently started playing around](http://n8henrie.com/tag/drafts/) with <a target="_blank" href="https://itunes.apple.com/us/app/drafts/id502385074?mt=8&at=10l5H6" title="Drafts on the App Store">Drafts</a>, and I really like how quick and responsive it is. It includes a built-in action to send a task to OmniFocus, which works great. Others have recommended using the OmniFocus Mail Drop Beta, an email-to-task feature the OmniGroup has been working on, as one of Drafts' "email actions," for an even smoother workflow, since the email is sent in the background without any app switching. This works great as well.

I've also [recently started playing](http://n8henrie.com/tag/pythonista/) with <a target="_blank" href="https://itunes.apple.com/us/app/pythonista/id528579881?mt=8&at=10l5H6" title="Pythonista at App Store">Pythonista</a>, and I came across <a target="_blank" href="https://gist.github.com/omz/4073599">a Python script written by the dev himself</a> that creates a little SMTP server and sends email directly from Pythonista. Between the two, I found it pretty easy — even for a beginner like me — to put together a combined Drafts / Pythonista workflow that makes for a superior way to import a bunch of tasks to OmniFocus at once (aka "brain dump").

#### They way it works

  * Open a new draft in Drafts.
  * Type in your tasks, one task per line, as fast as your thumbs can peck.
  * Hit the MultiLineOmniFocus action.
  * Pythonista will launch, you'll see some info about the SMTP server starting and each task getting sent.
  * It will return to Drafts when it's done.

Here's a quick video example of how it works. Apologies for the shoddy editing.

<iframe width="640" height="360" src="//www.youtube.com/embed/JC-_Gq0XAWk?rel=0" frameborder="0" allowfullscreen></iframe>

#### Setup

1. If you haven't already, get set up with the OmniFocus Mail Drop Beta, which provides an email address that will turn subject lines into tasks. Request access in your <a target="_blank" href="https://manage.sync.omnigroup.com/" title="Sign up for OmniFocus Mail Drop Beta">OmniSync management page</a>.
2. Install the URL action into Drafts:<br />

    - ```plaintext
    pythonista://MultiLineOmniFocus?action=run&argv=[[draft]]
    ```
    - Import the script below into Pythonista (here are [a few ways to import scripts](http://n8henrie.com/2013/02/quickly-import-pythonista-scripts-via-textexpander-or-bookmarklet/)).
    - Input your information in the **\### CHANGE THESE VALUES:** section.

```python
# More information:  http://n8henrie.com/2013/03/send-multiple-tasks-to-omnifocus-at-once-with-drafts-and-pythonista
# Script name: MultiLineOmniFocus
# Drafts "URL Action": pythonista://MultiLineOmniFocus?action=run&argv=[[draft]]
 
# Modified from email script by OMZ: https://gist.github.com/omz/4073599
 
import smtplib
from email.mime.multipart import MIMEMultipart
from email import encoders
import sys
import webbrowser
import console
 
def main():
 
        tasks = sys.argv[1].splitlines()
 
        ### CHANGE THESE VALUES:
        to = 'Your_OmniFocus_Mail_Drop_Email_Address'
        gmail_user = 'Your_Gmail_Address'
        gmail_pwd = 'Your_Gmail_Pass (or OTP if using 2FA)'
 
        console.clear()
        print 'Starting SMTP Server'
       
        smtpserver = smtplib.SMTP("smtp.gmail.com", 587)
        smtpserver.ehlo()
        smtpserver.starttls()
        smtpserver.ehlo
        smtpserver.login(gmail_user, gmail_pwd)
 
        for task in tasks:             
                outer = MIMEMultipart()
                outer['Subject'] = task
                outer['To'] = to
                outer['From'] = gmail_user
                outer.preamble = 'You will not see this in a MIME-aware email reader.\n'
 
                composed = outer.as_string()
               
                print 'Sending Task ' + str(tasks.index(task) + 1)
                smtpserver.sendmail(gmail_user, to, composed)
 
        smtpserver.close()
        print 'Done'
        console.clear()
       
if __name__ == '__main__':
        main()
 
webbrowser.open('drafts://')
```

I'm also trying to figure out what in the world GitHub is all about, so I put this (and a bunch of my other scripts) into a repo. Here is the link for this one: <a target="_blank" href="https://github.com/n8henrie/n8pythonista/blob/master/MultiLineOmniFocus.py">https://github.com/n8henrie/fromPastebin/blob/master/MultiLineOmniFocus.py</a>. Maybe you can branch it and tweak it or whatever people do with GitHub stuff.

I'm not convinced that this method actually saves _time_ compared to just inputting the actions directly into OmniFocus. Even if it did, the time saved would be minimal, because there are already fairly quick methods for doing this. For me, the benefit is that it minimizes the disruption between dumping tasks — that I can put down everything in one go without having to pause in between each task to hit "save" and "new task." If you're trying to get 5 ideas out of your head and into OmniFocus, saving 10 clicks is saving 10 clicks. Especially if those clicks are before you've gotten the ideas written down.

#### Pending issues

Currently, I have Drafts set up to delete the contents of the draft when the action is called so I don't have to do it manually later. However, this could present a problem if, for example, I didn't have internet access at the time. In this case, I'm guessing Drafts would delete all the tasks I'd just typed out, and the Pythonista script would fail, and I'd have to start over. One idea that I haven't yet tried but would probably take minimal effort would be to have Drafts _not_ delete the contents at the time the action is called, but to change the final Pythonista **webbrowser.open(‘drafts://')** to call the Drafts "delete" action. That way, hopefully the contents would only be deleted if the action succeeded. If Pythonista eventually implements <a target="_blank" href="http://x-callback-url.com/">x-callback-url</a>, this might be even easier (just have an x-success argument call the delete action).

I'd love to hear your feedback or suggestions for improvement in the comments section. I've only discovered Python in the last couple of weeks, so I'm definitely going for "functional" and not necessarily "elegant" here, but I'd love to hear how it could be done better.

**Update Apr 11, 2013:** A reader and fellow Pythonista in training, Jon Kameya, sent in <a href="http://pastebin.com/GzwEet0F" title="MultiLine OmniFocus w/ Newline" target="_blank">this modification</a> that uses `|` to separate email subject and body, which translates into task title and note in OmniFocus, as well as a check for blank lines. Thanks!
