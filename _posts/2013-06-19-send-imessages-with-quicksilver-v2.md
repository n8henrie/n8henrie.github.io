---
id: 2273
title: Send iMessages with Quicksilver v2
date: 2013-06-19T12:15:38+00:00
author: n8henrie
excerpt: I’ve been pretty pleased with my Quicksilver action for sending iMessage messages. It’s seen a couple of improvements since I published it, but I thought this change deserved a second post.
layout: post
guid: http://n8henrie.com/?p=2273
permalink: /2013/06/send-imessages-with-quicksilver-v2/
dsq_thread_id:
  - 1412899344
disqus_identifier: 2273 http://n8henrie.com/?p=2273
---
**Bottom Line:** An improvement on my [AppleScript action](http://n8henrie.com/2013/03/template-for-writing-quicksilver-actions-in-applescript/) for [sending iMessages with Quicksilver](http://n8henrie.com/2013/04/send-imessage-messages-with-quicksilver/) that allows sending to a name instead of having to “arrow in” to manually choose a phone number.<!--more-->

Update 20140330: As Noam Ross has pointed out in the comments below, I have incorrectly described being able to “arrow in” to a contact in the third pane. This doesn’t work; Quicksilver doesn’t seem to allow third pane arrow-ins. I have the script set so that you can arrow in to select a valid email / phone from the _first_ pane. To use the “text in first pane, contact in third pane” you have to set up a dictionary file like I’ve described below, which just takes the name from the third pane contact and searches for the appropriate number from the file. Sorry for the confusion!

## Contents

  * [Background](#Background)
  * [Usage](#Usage)
  * [Installation](#Installation)
  * [Limitations](#Limitations)
  * [Code](#Code)

#### Background<a id="Background"></a>

I’ve been pretty pleased with [my Quicksilver action for sending iMessage messages](http://n8henrie.com/2013/04/send-imessage-messages-with-quicksilver/). It’s seen a couple of improvements since I published it, but I thought this change deserved a second post.

One thing that bugged me about the script was having to “arrow in” to a contact and select either their iPhone or Apple ID email address to get the message to send, as opposed to just selecting their name (and having it recognize the appropriate address). I have now written a workable solution using a little Python.

Luckily, Python comes pre-installed on OSX, so this should probably work just fine for anyone using Quicksilver. Also, I’ve been diligent about selecting “iPhone” as the phone type for contacts that I know use iPhones, so I was able to write a second script that automatically extracts the information for any contact that has an iPhone listed in Address Book / Contacts.app.

#### Usage<a id="Usage"></a>

The basic usage is the same as before:

  * First pane: Text to be sent (convenient as you can send content that has been returned to QS, such as URLs)
  * Second pane: Select the action `Send with Messages.scpt`
  * Third pane: Choose your recipient.
      * Either “arrow in” and select an iMessage compatible phone number or email address, or…
      * Name alone is sufficient if you’ve put the person into your phonebook, as per below.

The script now searches a .txt file, `messages_phonebook.txt`, which is a simple list of the pattern `name, address` where `name` is the name that Quicksilver pulls from Address Book / Contacts, and `address` is the iMessage-compatible phone number or email address. For simplicity sake, I use the 10-digit phone number without any non-digit characters, but it should work with a few different formats, and email addresses should also work.

For example, Jonathan Doe, whose iMessage phone number is 123-456-7890, and **who appears in Quicksilver as “Jon Doe”** would get placed on his own line in messages_phonebook.txt as `Jon Doe, 1234567890`. If it isn’t working with specific individuals, I recommend searching for them in Quicksilver and make sure you have their name identical to the Quicksilver catalog entry.

The action should continue to work fine if you “arrow into” a contact and put their phone number or email address in the third pane, but if the third pane doesn’t “look like” an email address or valid phone number, it will search the phonebook to see if it’s a contact there. Also, I think the action should continue to work like this even with a broken Python install, so I could theoretical just overwrite the old script with this one, but I think it may be a touch slower than before, so I decided to give it its own post and Gist.

If you’ve set contacts’ phone type to “iPhone” in Address Book / Contacts.app, you can run the included automator action to populate `messages_phonebook.txt` with all these. If not, you’ll need to manually add people, one per line. I chose to make the phonebook plain text to make this a simple process.

#### Installation<a id="Installation"></a>

I’ve put everything you need into [this DMG]({{ site.url }}/uploads/2013/06/qs_messages.dmg), (or you can get most of it from the GitHub Gist that I’ve embedded below).

If you have listed contacts as having an “iPhone,” this step will populate a phonebook (if you haven’t feel free to skip this paragraph). The DMG contains an automator action `Create messages_phonebook.app`; as stated, it will populate a phonebook with any contacts that are listed as having an iPhone. It exports your address book to a .vcf file on your desktop, prompts you to select that file, then generates the phonebook and deletes the .vcf. I included the code for the import part of this automator action as `Create messages_phonebook.py` [below](#Code).

Find somewhere you can store away `qs_messages.py` and `messages_phonebook.txt` and move them there. Don’t forget that you’ll likely want to add and delete people from the phonebook, so keep it somewhere out-of-the-way but easy to remember.

Open `Send with Messages.scpt` in AppleScript Editor (at /Applications/Utilities/AppleScript Editor.app — I’ve had people try to open scripts with a text editor, doesn’t work). If you’ve downloaded the script from GitHub, it will probably have a `.applescript` extension — I think you need to rename it to .scpt for it to work. Once you’ve got it open, you’ll see a few properties up top that you’ll need to fix:

  * your Apple ID is probably an email address.
  * the default path to python is usually `/usr/bin/python`, but you can change this if you know otherwise.
  * the two path properties correspond to wherever you put the respective items.

Once you’ve set these, save the script and move it to `~/Library/Application Support/Quicksilver/Actions`, then restart quicksilver `^⌘Q`. Give it a shot! (I test by adding my own name and phone number to the phonebook.)

#### Limitations<a id="Limitations"></a>

I chose to keep the phonebook file as plain text instead of something like a <a target="_blank" href="http://docs.python.org/2/library/pickle.html">pickle</a> to keep it easy to edit for end users. However, that means there is also significant room for issues. For example, it currently separates the name from number / email by just looking for a comma followed by a space. So if the person’s name somehow had a comma in it, that would trip up the script. This could be resolved by splitting the fields with something like `####`, but I thought the comma separated list was easier to look at and may give room for future parsing with spreadsheet apps as a .csv or something. The code is there — feel free to modify to suit your purposes!

I will probably change my personal setup to be a pickled dictionary, which should avoid this issue and also allow me to modify values for a given key (unlike a tuple).

Also, I don’t know of a way to validate a phone number or email address as iMessage-compatible before trying to send.

Finally, it would be _great_ to be able to export a current list of recipients in Messages.app conversations to the phonebook (for people that haven’t been setting “iPhone” as phone type in Address Book / Contacts), but I haven’t found a way yet using its AppleScript dictionary. Hit me up if you have an idea here.

#### Code<a id="Code"></a>
