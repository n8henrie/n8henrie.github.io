---
id: 2542
title: How to Get a Spreadsheet of Tasks into Reminders.app
date: 2014-05-26T12:35:21+00:00
author: n8henrie
excerpt: "Here's how to batch import tasks into Reminders.app on your Mac."
layout: post
guid: http://n8henrie.com/?p=2542
permalink: /2014/05/how-to-get-a-spreadsheet-of-tasks-into-reminders-app/
dsq_thread_id:
  - 2714336802
---
**Bottom Line:** Here&#8217;s how to batch import tasks into Reminders.app on your Mac.<!--more-->

I don&#8217;t really use Reminders.app as a tasklist, but I _do_ use it for other things. Its integration with iOS apps like <a target="_blank" href="http://n8h.me/1k3MCmB" title="Drafts">Drafts</a> and <a target="_blank" href="https://itunes.apple.com/us/app/omnifocus-2-for-iphone/id690305341?mt=8&#038;at=10l5H6" title="OmniFocus 2 for iPhone">OmniFocus</a> make it actually fairly useful. For example, I use it to get <a target="_blank" href="https://www.omnigroup.com/blog/omnifocus_is_now_on_speaking_terms/" title="OmniFocus is now on speaking terms… - The Omni Group">Siri to add tasks to OmniFocus</a>.

Because Reminders.app uses an iCalendar format for syncing, a commenter [recently asked me](http://n8henrie.com/2013/05/spreadsheet-to-calendar/#comment-1404817065) if there is a way to use my <a target="_blank" href="http://icsconverterwebapp.n8henrie.com/" title="icsConverterWebapp - n8henrie.com">icsConverter</a> with Reminders. An interesting question!

Right now, there isn&#8217;t a way to use it directly. However, with a few (okay, several) extra steps, it seems like it wouldn&#8217;t be too difficult to batch convert a large spreadsheet of tasks and import into Reminders.app.

Before I get started, I&#8217;ll say that <a target="_blank" href="https://gist.github.com/n8henrie/c3a5bf270b8200e33591">AppleScript may be an easier way to get this done</a>, and there are almost certainly ways to abbreviate the process for users familiar with tools like `sed`, `perl`, etc. The process as I&#8217;ve outlined below is quite a bit of manual work, and it could be simplified and automated considerably. However, _it&#8217;s a task that I will probably never need to do_, and most folks will need to do only on rare occasion. The post below will be most useful to folks that need to import hundreds (or more) of tasks as a time. If you only need to import a dozen or so tasks, or if you need to do so any more frequently than once a month, you should probably look for a better way.

If you&#8217;re still with me, here goes:

The first step would be to get the spreadsheet into an acceptable format. <a target="_blank" href="https://docs.google.com/spreadsheet/ccc?key=0AlQMuv7LxtdpdERibWVJeHFPSDdkamNoNy1NUDJkanc&usp=sharing">Here</a> is my new template. No, you can&#8217;t edit mine, you&#8217;ll have to `File -> Make a copy`, or `File -> Download as` and open in your spreadsheet editor of choice. 

As with converting a spreadsheet to a calendar, preparing the spreadsheet correctly is the most important part. Triple check that of your headers are exactly right, and triple check that your dates and times are formatted correctly. **Do not delete any of the columns from the template, even if the values are optional.** For importing reminders, here are the fields:

  * `Subject`: **Required.** The task name.
  * `Start Date` and `Start Time`: **Required**, but don&#8217;t matter as far as I know. I left these in in case start dates are supported in a future version.
  * `Description`: **Optional.** A note to go along with the task.
  * `Location`: **Optional.** Does not work (yet) and will be deleted from the file. Leave blank or fill with junk.
  * `Private`: **Optional.** Just leave as `TRUE`.

For tasks with &#8220;reminder times&#8221; (the closest equivalent of a due date):

  * Set `All Day Event` to `FALSE`
  * `End Date` and `End Time` are **required** and will be the reminder time.

For tasks _without_ &#8220;reminder times&#8221;:

  * Set `All Day Event` to `TRUE`
  * Leave `End Date` and `End Time` blank

When you&#8217;re done editing, `download as` or export to `.csv` and run it through <a target="_blank" href="http://icsconverterwebapp.n8henrie.com/">icsConverterWebapp</a>. If you&#8217;re confused or have problems, please read through my [icsConverter instructional post](http://n8henrie.com/2013/05/spreadsheet-to-calendar/) before contacting me for help. If you&#8217;ve been through this post a time or two and still can&#8217;t figure it out, I&#8217;m happy to help you as time permits.

Next, after you&#8217;ve downloaded the converted `.ics` file, you&#8217;ll need to open it up in a text editor that supports regex find and replace. I highly recommend <a target="_blank" href="http://www.barebones.com/products/textwrangler/" title="Bare Bones Software - TextWrangler">TextWrangler</a>, and my examples will be regexes in TextWrangler format.

Once you have `converted.ics` open in TextWrangler, open the `Search -> Find` box from the menu. Run the following search and replace commands with the `grep` option checked. 

  * Find: `(?<=^BEGIN:|^END:)VEVENT$` Replace: `VTODO`
  * Find: `^DTSTART;VALUE=DATE(-TIME)?:([0-9T]+)$` Replace: `CREATED:\2`
  * Find: `^DTEND;VALUE=DATE:([0-9T]+)$\r` Replace: **Leave blank** (this will delete the line entirely)
  * Find: `^(LOCATION|TRNSP):.*?$\r` Replace: **Leave blank**
  * Find: `^DTEND;VALUE=DATE-TIME:([0-9T]+)$` Replace: `DTSTART;TZID=America/Denver:\1\rDUE;TZID=America/Denver:\1`
  * Yes, you can appropriately change the `TZID` if you know how, otherwise we&#8217;ll do it in the next step.

Here&#8217;s a screenshot of what the first regex should look like in TextWrangler:


![](http://n8henrie.com/wp-content/uploads/2014/05/20140526_20140526-ScreenShot-312.jpg) 

Next, take an _existing_ list from Reminders.app with _at least one task_ and `File -> Export`. Open this `.ics` file up in the text editor as well. Find the section 4 or so rows down starting with `BEGIN:VTIMEZONE` and ending at line 20 or so with `END:VTIMEZONE`. Copy this section into your `converted.ics` file right below `PRODID:n8henrie.com`.

In that copied section, find the line beginning with `TZID:`, and copy everything after that into the following, final regex:

  * Find: `(?<=^DTSTART;TZID=)(.*?)(:[0-9T]+)$` Replace: `COPIED_TZID\2`. That&#8217;s your copied value with `\2` at the end, e.g. `America/Denver\2`.

With all of that out of the way, you should now be able to save the `.ics` file, right click and `Open with` Reminders.app. As with importing a new `.ics` file to your calendar, I recommend first importing into a temporary, throw-away Reminders list to make sure everything looks right, because otherwise you&#8217;ll probably have to manually sort out and delete tasks that didn&#8217;t work right.

There are probably some more advanced applications that some readers may be interested in. If so, I exported an example task list from Reminders.app with tasks featuring due date reminders, priorities, location-based reminders, titles, notes, etc., and uploaded it as a gist. You may see potential for something interesting based on its format.



Well, that&#8217;s it. Should you have questions or suggestions for improvement, leave them in the comments section below. Honestly, unless this post gets a lot of attention, I doubt that I&#8217;ll invest much time in improving this process, since it is kind of a pain.