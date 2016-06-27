---
id: 2234
title: 'Import a Spreadsheet Schedule of Events to iCal or Google Calendar &#8212; Updated'
date: 2013-05-07T08:37:35+00:00
author: n8henrie
excerpt: Based on the popularity of my last post on getting a spreadsheet of events into your calendar, I’m apparently not the only person that occasionally wants to turn a spreadsheet into something my digital calendar can understand.
layout: post
guid: http://n8henrie.com/?p=2234
permalink: /2013/05/spreadsheet-to-calendar/
dsq_thread_id:
  - 1269596970
---
**Bottom Line:** Here&#8217;s an updated post on how to import a spreadsheet of events into iCal, Calendar.app, Google Calendar, or several other modern calendar apps.<!--more-->

Based on the popularity of my [last post on getting a spreadsheet of events into your calendar](http://n8henrie.com/2012/07/import-spreadsheet-schedule-of-events/), I&#8217;m apparently not the only person that occasionally wants to turn a spreadsheet into something my digital calendar can understand. For those of you that want to skip straight to the good stuff, this should help:

## Sections:

  1. [Updates and Miscellaneous](#Updates)
  2. [Background](#Background)
  3. [Formatting the spreadsheet](#Formatting)
  4. [My spreadsheet template](#template)
  5. [Making a .csv file from the spreadsheet](#csv)
  6. [Converting the .csv file to .ics format and importing](#Converting)
  7. [icsConverter and icsConverterWebapp](#icsConverter)
  8. [Importing the .ics file](#Importing)
  9. [Conclusion](#Conclusion)

#### 0. Updates and Miscellaneous<a id="Updates"></a>

Now a few years old, this continues to be my most popular post. Thank you to all those who have commented, made suggestions for improvement, helped me debug problems, and made donations to the coffee fund! It makes a big difference to me. I thought it would be a good idea to add a new section up top where I can periodically post updates or new information regarding my spreadsheet converters or the process in general, so here we are. Technical updates to the converters will go in their respective HISTORY.md in the source code, this will be just for general updates.

**May 10, 2015:** Major update to <a href="http://icw.n8henrie.com" target="_blank">icsConverterWebapp</a> (now just [icw.n8henrie.com](http://icw.n8henrie.com)). Whole new look a la <a href="http://getbootstrap.com/" target="_blank">Bootstrap</a>, now runs on <a href="http://flask.pocoo.org/" target="_blank">Flask</a>, updated to use the new Google Cloud Client Library, better error reporting so users can figure out what went wrong. Hope you like it!

**May 05, 2015:** I want to make clear that importing a calendar to Calendar.app on iOS or OSX will not automatically sync to your other devices. You&#8217;ll need to import on OSX, then move that calendar to iCloud to get it to sync. (Thanks to Art Parmet for prompting me to clarify.)
  


#### 1. Background<a id="Background"></a>

During my third year of medical school, I was frequently given my schedule for a rotation in a Excel spreadsheet format. It took a while, but I was eventually able to come up with a reasonable workflow for converting the spreadsheet into a format that I could import into either Google Calendar or iCal / Calendar.app, [which I wrote up here](http://n8henrie.com/2012/07/import-spreadsheet-schedule-of-events). Still, that process involves converting the spreadsheet into a .csv (comma separated value) format that Google Calendar will understand, uploading to Google Calendar, then optionally re-downloading to .ics format for importing into other calendar apps.

Earlier this week (edit May 05, 2013: it&#8217;s now been several months since I started the post), I decided to download <a target="_blank" href="https://itunes.apple.com/us/app/pythonista/id528579881?mt=8&#038;at=10l5H6" title="Pythonista">Pythonista</a> and see what I thought about Python. Given my recent interest in [bash and shell scripting](http://n8henrie.com/tag/terminal/), I thought it sounded reasonable. After a couple of days of tinkering, I decided I could probably write something in Python to automate a few of the steps of my .csv to .ics workflow. NB: I only bring up Pythonista for context, this script will not work on iOS AFAIK.

#### 2. Formatting the spreadsheet<a id="Formatting"></a>

If the formatting is not _just_ right, the conversion process will fail. This is definitely the hardest and most frustrating part, but if you can get it right, the rest is just a few clicks. I&#8217;ve put together a few tools in this section to help. A few of the spreadsheet formatting requirements are (feel free to skim these bullets now and come back when you&#8217;re actually reformatting your spreadsheet):

  * The spreadsheet will start with a row of headers that describe each column.
  * Each event will be a separate _row._ 
      * If your spreadsheet currently has its columns and rows reversed, don&#8217;t despair. Use [this transposition trick](#transpose).
  * The start date, start time, end date, and end time, must be in a separate columns; it won&#8217;t work if the date and time for an event are both crammed into a single cell.
  * Omitting quotes and commas, the headers must be _exactly_: &#8220;Subject&#8221;, &#8220;Start Date&#8221;, &#8220;Start Time&#8221;, &#8220;End Date&#8221;, &#8220;End Time&#8221;, &#8220;All Day Event&#8221;, &#8220;Description&#8221;, &#8220;Location&#8221;, &#8220;Private&#8221; 
      * I mean exactly, even capitalization.
      * Extra blank columns to the right are okay.
      * If you&#8217;re using [my icsConverter tools](#icsConverter), order does _not_ matter.
      * Even if you&#8217;re not using certain columns, you still need the header (and a blank column underneath).
  * The &#8220;Subject&#8221; column is the title of the event.
  * Both &#8220;Start Date&#8221; and &#8220;End Date&#8221; must be in **MM/DD/YYYY** format. 
      * With nearly any modern spreadsheeting app, you can very easily select an entire column and change its format, e.g. from &#8220;Sep 9, 2012&#8221; to &#8220;09/09/2012.&#8221;
      * In Google Docs Spreadsheets, for example, click the letter at the top of a column of dates to select the whole column at once, then go to format -> number -> date in the menu bar.
      * Leading zeros (09 instead of 9 for September) are optional.
  * &#8220;Start Time&#8221; and &#8220;End Time&#8221; can be either 24 hour time (13:45) or 12 AM/PM (01:45 PM)
  * &#8220;All Day Event&#8221; is evaluated on a &#8220;True&#8221; / &#8220;False&#8221; basis. 
      * If set to &#8220;True&#8221;, start and end **times** will be ignored and an all-day (or multi-day) event created.
      * If set to &#8220;True&#8221; with a blank &#8220;End Date&#8221;, a single all-day event will be created.
      * If &#8220;False&#8221;, left blank, or anything other than &#8220;True&#8221;, it does nothing, and all other start and end dates and times are required.
  * &#8220;Location&#8221; is just that.
  * The &#8220;Description&#8221; column will be put in the note field of the calendar event.
  * &#8220;Private&#8221; is another &#8220;True&#8221; / &#8220;False&#8221; column, but currently does nothing. However, **you still need the header**.
  * If you decide **not** to use [my icsConverter tools](#icsConverter), watch out for cells with leading or trailing spaces, and cells that contain commas; these have been okay in my testing so far, with Numbers and Google Docs, but I can&#8217;t speak to other programs and whether or not they properly handle these things.

How to transpose<a id="transpose"></a> a spreadsheet&#8217;s columns and rows: If you need to transpose your spreadsheet&#8217;s rows and columns, you can do so pretty easily in Google Docs (I think this also works in Excel, but to my knowledge does _not_ work in Numbers). 

  1. Create a brand new, blank spreadsheet (not just a new sheet).
  2. Copy pasta your existing spreadsheet into it. Make sure the columns and rows are long enough to fit all your data, extend them if necessary.
  3. Click the &#8220;+&#8221; button in the bottom left to create a second sheet.
  4. In the first cell of this second sheet, paste in `=TRANSPOSE( 'Sheet1'!A1:Z )` and the whole spreadsheet will turn into a transposed version of the first sheet. Highlight and copy.
  5. You should be able to paste this transposed version into a different spreadsheeting app without issues. However, if pasting back into another Google Docs spreadsheet, you&#8217;ll need to use **Edit -> Paste special -> Paste values only**, or else it will try to paste a reference to your temporary spreadsheet, and this reference will break if that spreadsheet changes or goes away.

#### 3. My spreadsheet template<a id="template"></a>

As you can see, you&#8217;ll need to convert the spreadsheet of events to a pretty rigid format, which in my opinion is the most frustrating part of entire ordeal. To facilitate this as much as possible, I&#8217;ve created <a target="_blank" href="https://docs.google.com/spreadsheet/ccc?key=0AlQMuv7LxtdpdHhVMVJad3F4NXhtV3haMkRoUzZGQUE&usp=sharing" title="n8henrie's Google Docs spreadsheet to calendar template">this Google Docs spreadsheet template</a>. _You won&#8217;t be able to edit my copy_, but I recommend downloading a copy to work from, or as a quick reference. 

  * If you&#8217;re an Excel or Numbers user, you should be able to open and **File -> Download as -> Microsoft Excel**, which should open nicely in either of these apps.
  * If you&#8217;re a Google Docs user, and you&#8217;re signed into your account, you can just **File -> Make a Copy**.

#### 4. Making a .csv<a id="csv"></a> file from the spreadsheet

This part couldn&#8217;t be much easier. 

  * Google Docs: **File -> Download as -> csv**
  * Numbers.app: **File -> Export -> csv**. You might end up with a folder with a couple of .csv files. If so, either use quick look (spacebar), open them with a text editor, or look at the filenames (if you&#8217;ve named your spreadsheets in Numbers) to find the right one.
  * Excel: **File -> Save as -> Format -> Comma separated values (.csv)**

#### 5. Converting<a id="Converting"></a> the .csv file to .ics format and importing

If you&#8217;re trying to get these events into Google Calendar, you should be able to upload the .csv file at this point. _Good luck._ They are extremely strict about the formatting requirements, and anything less than perfect will fail. I think [my icsConverter tools](#icsConverter) below are a little more lenient, so if you&#8217;re having trouble using the .csv directly, you can try using them and uploading the resulting .ics file instead.

If you want to import these events into iCal (now Calendar.app) or another application, you should convert the .csv file to an .ics file. As I described in [my first post on the topic](http://n8henrie.com/2012/07/import-spreadsheet-schedule-of-events/), one way to do this is to upload to Google Calendar and then re-download as .ics. However, as I&#8217;ve mentioned, Google can be a bit particular about the file formatting and has really unhelpful error messages if something is wrong. Also, this requires you to have a Google Calendar account, which isn&#8217;t the case for everyone. 

For these reasons, I wrote an app and a webapp to handle the conversion.

#### 6. icsConverter<a id="icsConverter"></a> and icsConverterWebapp

_Please see my [disclaimer](http://n8henrie.com/disclaimer/), and realize that I am **not** a real programmer. While I believe my apps below to be perfectly safe for normal use, I **do not** have the expertise to know. Make sure you have a complete and working backup of all your data before trying anything, ever. icsConverterWebapp uploads your data to Google Apps Engine, which I assume is reasonably secure and private. However, if you&#8217;re terribly concerned about the security and privacy of your calendar information&#8230; don&#8217;t use it, because I&#8217;m not smart enough to know for sure._

**icsConverter** is written in Python and relies on <a target="_blank" href="https://pypi.python.org/pypi/icalendar">the icalendar module</a> to work its magic. If you do Python, you&#8217;re almost certainly better than I am, so feel free to <a target="_blank" href="https://github.com/n8henrie/icsConverter">check out the code at GitHub</a>. In the repo, I&#8217;ve included the **requirements.txt** created by pip, so you should be able to clone the repo, `cd` in, `pip install -r requirements.txt`, and be up and running.

I&#8217;ve also used <a target="_blank" href="https://bitbucket.org/ronaldoussoren/py2app" title="py2app - Revision 105: /py2app/trunk/doc">py2app</a> to make icsConverter into a standard OSX app. Install by dragging into your Applications folder, like most other apps. I&#8217;ve also included in the .dmg an example **tester.csv** to show that icsConverter seems to work okay, even with some potentially tricky cases like special characters, extra spaces, commas, etc. that might trip up Google Calendar.

[Download icsConverter for OSX (intel only)](http://n8henrie.com/uploads/2014/01/icsConverter_v5_1.dmg)

For those of you that aren&#8217;t on an intel OSX device, I also tried my hand at Google Apps Engine and made **icsConverterWebapp**. This uses essentially the same code, but you don&#8217;t have to install anything; just upload the formatted .csv file, then click to download the converted .ics file. Here&#8217;s a copy of [tester.csv](http://n8henrie.com/uploads/2013/05/20130506_tester.csv) so you can give it a test run if you&#8217;d like. icsConverterWebapp&#8217;s code <a target="_blank" href="https://github.com/n8henrie/icsConverterWebapp">is on GitHub</a> as well.

<a target="_blank" href="http://icw.n8henrie.com/">Link to icsConverterWebapp</a>

Calling the exception handling in icsConverter and icsConverterWebapp &#8220;rudimentary&#8221; would be a huge overstatement. If you have trouble with a conversion, try the following:

  * Check your headers. Consider C&Ping mine from my Google Docs template above.
  * Check your &#8220;Start Date&#8221; format (remember, **MM/DD/YYYY**).
  * Check your &#8220;End Date&#8221; format (remember, **MM/DD/YYYY**).
  * Check your headers again.
  * Compare the overall format to my Google Docs template.
  * Just for fun, check your headers one more time.

If none of that works **and you are okay with me seeing your calendar events**, email me the .csv file at the address in my &#8220;Contact&#8221; link below. Put &#8220;icsConverter&#8221; or &#8220;icsConverterWebapp&#8221; in the subject, respectively. Include the error message (if any) in the body of the email, as well as what spreadsheet app you used to create the .csv file. If you&#8217;re terribly concerned about me seeing the calendar events in question, _please_ don&#8217;t bother emailing. I really don&#8217;t have time to try to debug an issue without being able to replicate the bug, which means I need your .csv file.

#### 7. Importing<a id="Importing"></a> the .ics file

Before importing the resulting .ics file to your calendar, I strongly recommend creating a new junk calendar that you can use to import and inspect the events. You can generally import the resulting .ics file by simply opening it with your calendar app of choice; on a Mac / OSX, try a double click, unless you know that you don&#8217;t use your default app. Hopefully it will ask which calendar to import to, and you should choose your junk calendar. 

If everything turned out okay, you can delete the junk calendar and re-import to your real calendar. If something didn&#8217;t turn out quite right, you can delete the junk calendar, tweak the .csv file, and try again. Without testing on the junk calendar, you risk importing hundreds of useless events into your calendar, which you might have to manually delete&#8230; you don&#8217;t want that.

If you do happen to need to edit a bunch of events, I recommend giving a shot to <a target="_blank" href="http://www.woodenbrain.com/products/calibrate/calibrate.html">Calibrate</a>, with which I&#8217;ve generally had very good luck manipulating dozens or even hundreds of calendar events at once. Great app.

#### 8. Conclusion<a id="Conclusion"></a>

As you can see, getting a spreadsheet into your calendar app can be quite an ordeal. I hope this helps you get through the process as smoothly as possible. While it is still more involved than I&#8217;d like, I think I&#8217;ve covered most of the major &#8220;gotchas&#8221; that I ran into, and I&#8217;ll try to keep this post (and the icsConverter apps) updated as I come across new info. Best of luck!