---
id: 2289
title: 'Quickly Add a Gmail Thread’s Contacts to a Filter'
date: 2013-06-24T14:51:46+00:00
author: n8henrie
excerpt: To build a Gmail filter for all participants in a thread, use Reply All to get a list of addresses that you can copy, parse, and format.
layout: post
guid: http://n8henrie.com/?p=2289
permalink: /2013/06/quickly-add-a-gmail-threads-contacts-to-a-filter/
dsq_thread_id:
  - 1431555410
disqus_identifier: 2289 http://n8henrie.com/?p=2289
tags:
- email
- productivity
categories:
- tech
---
**Bottom Line:** To build a Gmail filter for all participants in a thread, use Reply All to get a list of addresses that you can copy, parse, and format.<!--more-->

I fairly frequently take part in a thread with 10 or 15 recipients that I’d like to add to a Gmail filter, usually in order to “label” all conversations with them for easier searching later. Many of you will already know how to set up a filter, and that you can put `from:{example@email.com, him@email.com, her@email.com}` in the “has the words” box as the match condition for the filter, and “label: YourLabel” as the action to accomplish this. (Note the curly braces to designate **OR**, instead of regular parenthesis, which would mean **AND**.)

Many of you will also know about the “filter messages like these” button, hidden in the menu revealed by clicking the small down-pointing triangle in the upper right hand corner.


![]({{ site.url }}/uploads/2013/06/20130624_20130621-ScreenShot-194.jpg) 

However, the “filter messages like these” only grabs the “from” field, so here’s a little trick to get all of the _recipients_: Just **Reply All** (or hit `A` if you have keyboard shortcuts enabled), then Select All (command A or control A, depending on your OS). There may be some addresses in the CC field and others in the To: field, so make sure you get them all (there’s often only one in the To: field, so I often just drag it to the CC field with the rest of them, then Select All).

Once they’re all selected, use the keyboard shortcut to Copy (command C or control C, depending on OS), then paste into a text editor like <a target="_blank" href="https://itunes.apple.com/us/app/textwrangler/id404010395?mt=12&at=10l5H6" title="TextWrangler">TextWrangler</a>. You’ll probably end up with something that looks something like this:

> John Doe <johndoe@email.com>, Jane Doe <janedoe@email.com>, Jim Doe <jimdoe@email.com>, etc…

Now you can manually get rid of everything but the email addresses, but if you’ve pasted into a text editor that supports <a target="_blank" href="http://en.wikipedia.org/wiki/RegEx" title="RegEx">RegEx</a> search and replace, you can get what you need like this: 


![]({{ site.url }}/uploads/2013/06/20130624_20130621-ScreenShot-195.jpg) 

NB: there is a space after the comma in the replace box. Explanation: `.*?<` means “anything up to and including the <“, `(.*?)` means “remember this group of stuff”, `>.*?` means “anything after and including the >”. (The ?s indicate “take the shortest match possible,” otherwise it could just take everything between the first < and the last > as a possible solution). In the second box, `\1,` means replace (everything matched) with (the first group remembered from above), followed by a comma and a space.

The output after one run should be something like:

> johndoe@email.com, janedoe@email.com, jimdoe@email.com…

You can then take this comma separated list, put `from:{` at the beginning and `}` at the end and paste it into Gmail’s “has the words” box for a perfect filter that will find any email from anyone in that conversation and perform whatever action you’d like (e.g. Label: my_label).

(If you are on Linux or don’t want to use a GUI text editor, you can use `echo "stuff copied from gmail in quotes" | perl -pi -e "s/.*?<(.*?)>.*?/\1,\ /g"` in Terminal to do the same thing. Add `| pbcopy` to the end to automatically copy to the clipboard on OSX.)