---
id: 10
title: Import a Spreadsheet Schedule of Events to iCal or Google Calendar
date: 2012-07-11T04:23:00+00:00
author: n8henrie
layout: post
guid: http://www.n8henrie.com/?p=10
permalink: /2012/07/import-spreadsheet-schedule-of-events/
blogger_blog:
  - www.n8henrie.com
blogger_author:
  - Nathan Henrie
blogger_permalink:
  - /2012/07/import-spreadsheet-schedule-of-events.html
geo_latitude:
  - 35.0729762
geo_longitude:
  - -106.6173415
geo_address:
  - 515 Columbia Dr SE, Albuquerque, NM 87106, USA
dsq_thread_id:
  - 811565485
blogger_images:
  - 1
disqus_identifier: 10 http://n8henrie.com/?p=10
tags:
- automation
- Mac OSX
- productivity
categories:
- tech
---
**Bottom line:** You can batch import events from a spreadsheet to iCal or Google Calendar by formatting the headers correctly, exporting / import as .csv, then export / import as .ics.

<!--more-->

> **Update May 07, 2013:** This post has been completely rewritten and updated here: [http://n8henrie.com/2013/05/spreadsheet-to-calendar](http://n8henrie.com/2013/05/spreadsheet-to-calendar/ "Import a Spreadsheet Schedule of Events to iCal or Google Calendar — Updated"). Feel free to reference this post as well, but the new post is much more thorough and has a few new tools that I wrote to facilitate the process of getting spreadsheet events into your calendar app of choice.

_NB: This process works for me using Numbers.app, Google Calendar, and iCal. I think it should also work with Excel or Google Docs spreadsheets, but I can't say for sure._

I try to keep all of my appointments in a digital calendar that syncs across all my devices. It's a big deal for me – I _really_ like to be able to look in one place to find out where I ought to be at any given moment. Getting a syncing, mobile-accessible calendar for the lecture-based years of medical school was actually a major objective leading to the creation of <a target="_blank" href="http://smrt.posterous.com" title="SMRT Blog">our medical student group, SMRT</a>. I previously used Google Calendar but have recently converted to iCal / iCloud (mostly due to issues deleting events from Google Calendar with my iPhone – a bug that persisted for years and drove me nuts).

Over the last year or so, I've been handed a new schedule every month or two on my rotations. Unfortunately, these have almost always been in some kind of spreadsheet format (or they're printed from a spreadsheet, which I request be emailed to me). Because calendaring software doesn't know how to interpret spreadsheet information directly, I've developed a workflow that is a bit circuitous but not terribly onerous and allows me to bulk convert and import my spreadsheet schedules.

This process _requires_ a <a target="_blank" href="https://accounts.google.com/ServiceLogin?service=cl&passive=1209600&continue=http://www.google.com/calendar/render&followup=http://www.google.com/calendar/render&scc=1">Google Calendar</a> account to process one of the files and spit out another format. **You don't have to use it for calendaring,** but you can. This whole process may take from 10 minutes to an hour depending on your skill with spreadsheets and a bit of luck.

### Main Idea

  1. Give the spreadsheet the appropriate headers and format it to make Google Calendar happy
  2. Export as <a target="_blank" href="http://en.wikipedia.org/wiki/Comma_separated_values">comma separated values</a> (csv)
  3. Import to Google Calendar (stop here if you're a GCal user, continue if iCal user)
  4. Use Google Calendar to export to iCalendar format (.ics, <a target="_blank" href="http://en.wikipedia.org/wiki/Icalendar">iCalendar is <em>not</em> the same as iCal</a>)
  5. Import the .ics to iCal

### 1. Headers and Spreadsheet Formatting

This is the hardest and most important step. In order for step 3 to work, you have to get the spreadsheet set up correctly. First, open up a copy of my spreadsheet template, which you can

  * <a target="_blank" href="http://cl.ly/131e3z420Y3v3P2N101G">download in Numbers.app format</a>
  * <a target="_blank" href="http://cl.ly/1R2f0g3l3v023v2G3I2S">download in Excel format</a>
  * <a target="_blank" href="https://docs.google.com/spreadsheets/d/1k0eJMoytqFNn6G2QS3cEo2Of350lKF6x3gbEvbfMnkA/copy">make a copy in Google Docs</a>

Please note that the Numbers.app version also has some embedded instructions in
rough draft format (nothing not posted here). I think these also show up in the
Excel version, but not in the GDocs version.

Basically, it's just a spreadsheet with the headers that Google Calendar will
recognize (<a target="_blank"
href="https://support.google.com/calendar/bin/answer.py?hl=en&answer=45656">source</a>).
These are:

```csv
Subject,Start Date,Start Time,End Date,End Time,All Day Event,Description,Location,Private
```


You should take your spreadsheet schedule and copy and paste the information into the appropriate columns. Keep in mind that Numbers can convert date and time formats pretty well by selecting the column in question and opening up Inspector ("command option i" or view -> inspector) to "cells" (a box with "42" on my version). Makes converting a bunch of "Jan 5 2002" to "01/05/2002" a snap. Leave the columns in the order you found them. Other formatting info:

  * Subject: The event title
  * Dates: MM/DD/YYYY format seems to work for me.
  * Times: both "7:00 PM" and "19:00" formats seem to work
  * All day event: Will be true / false (checked or unchecked in Numbers)
  * Description: The "notes" part, optional
  * Location: Optional
  * Private: Another true / false checkbox, will make events on a shared calendar private to everyone but "owners." I _think_ this is also optional / no response required.

### 2. Export as .csv

File -> export in Numbers, unicode seems to work fine. AFAIK, the equivalent functions in Excel and Google Docs should work just as well. If you have multiple sheets in Numbers, it will export to a folder with multiple .csv files. Figure out which one has the data you need with Quick Look or a text editor, you can delete the other .csv files.

### 3. Import to Google Calendar

Head over to <a target="_blank" href="https://accounts.google.com/ServiceLogin?service=cl&passive=1209600&continue=http://www.google.com/calendar/render&followup=http://www.google.com/calendar/render&scc=1">Google Calendar</a>. If this is home base for you, you can import the events directly to your calendar. If this is just an intermediary step, I recommend creating a new temporary / junk calendar for this purpose.

**Optional: How to create a temporary calendar:** Click the down arrow to the right of "My Calendars" in the left hand column to create a new calendar. Name it "junk," or "osdifj," or whatever you want, you can delete it later.

<div style="clear: both; text-align: center;">
  <a href="{{ site.url }}/uploads/2012/08/ScreenShot2012-07-10at9.51.48PM1.jpg" style="margin-left: 1em; margin-right: 1em;"><img border="0" height="68" src="{{ site.url }}/uploads/2012/07/ScreenShot2012-07-10at9.51.48PM.jpg" width="320" /></a>
</div>

Next, head to your main calendar settings by clicking the same right arrow mentioned above. Towards the middle of the screen, look for the import calendar button. Click it, make sure you have the right calendar selected in the bottom box, then navigate to the file and click "import."

<div style="clear: both; text-align: center;">
  <a href="{{ site.url }}/uploads/2012/08/ScreenShot2012-07-10at9.56.48PM1.jpg" style="margin-left: 1em; margin-right: 1em;"><img border="0" height="35" src="{{ site.url }}/uploads/2012/07/ScreenShot2012-07-10at9.56.48PM.jpg" width="320" /></a>
</div>

You will now either get an error message, which probably means you need to go back to Step 1 and make sure everything is formatted correctly (can you tell this has happened to me a few times?), or you will have imported your schedule. Look through GCal to make sure everything looks right. If so, congrats! Google Calendar users can end their journey here, thanks for reading. If you want to import to iCal, you're getting close.

### 4. Export to iCalendar Format

A couple of options here. Either

  * Click the "export calendars" button immediately to the right of the "import calendar" button from above, downloading a .zip of _all_ your Google Calendars in .ics format (haven't tried this but appears to work), or
  * Still in Google Calendar settings, click the name of the calendar, then click the **private** "ICAL" button on the next screen, then click the link one more time to download the .ics file. If you have trouble, try option + click, which tries to download a link as a file (on a Mac).

Once you have the .ics file, you can...

### 5. Import the .ics to iCal

Easy as can be. In iCal's menu, File -> Import -> Import, and select the .ics file. Choose to import to whichever calendar you please. Should sync to iCloud just fine, assuming that you import to an iCloud synced calendar. Also, I recommend you go back to Google Calendar's settings and delete the temporary calendar you created in Step 3. Keeps everything cleaned up.

### Phew.

Seems like a lot of work, but goes quickly once you've done it a few times. It's especially worthwhile when you have lots of events or lots of "description" info in your spreadsheet that you don't want to retype. On the other hand, if you don't have that many events, I highly recommend <a target="_blank" href="http://quickcalapp.com/">QuickCal</a> for inputting events to iCal on the Mac. Not only is it a solid, user-friendly, lightweight app, but the devs just seem like good people. They have directly incorporated my feedback into their updates a few times now; their customer support is top notch.

Let me know in the comments if this works out, if you run into issues, or most importantly if you find an easier way to get your spreadsheet schedule into iCal.

<div>
</div>
