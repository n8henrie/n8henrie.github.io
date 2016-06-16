---
id: 19
title: Applescript for Numbered Tasks in OmniFocus
date: 2012-04-30T16:00:00+00:00
author: n8henrie
layout: post
guid: http://www.n8henrie.com/?p=19
permalink: /2012/04/applescript-for-numbered-tasks-in/
blogger_blog:
  - www.n8henrie.com
blogger_author:
  - Nathan Henrie
blogger_permalink:
  - /2012/04/applescript-for-numbered-tasks-in.html
geo_latitude:
  - 35.0729762
geo_longitude:
  - -106.6173415
geo_address:
  - 515 Columbia Dr SE, Albuquerque, NM 87106, USA
blogger_images:
  - 1
dsq_thread_id:
  - 812154017
---
I&#8217;ve <a href="http://www.n8henrie.com/search/label/OmniFocus" target="_blank">written a few times about OmniFocus</a>, my task manager of choice.  One of the things I love about it is that you can expand its impressive toolset with <a href="https://en.wikipedia.org/wiki/Applescript" target="_blank">Applescript</a>, which comes built-in to every Mac.  You can drag and drop your scripts into ~/Library/Scripts/Applications/OmniFocus and OmniFocus will even make them into handy buttons that you can put on your toolbar.

For example, in my medical school rotations, I am frequently assigned tasks that I have to accomplish a certain number of times.  To keep track of my progress, what I&#8217;ve previously done is the following.

  1. Create a task and give it a descriptive name
  2. Duplicate the task however many times I need to do it
  3. Append a number to each
  4. Group the tasks (edit -> outlining -> group)
  5. Set the group to &#8220;sequential&#8221; instead of parallel

<div>
  If I were assigned to do 10 History and Physicals by the end of a rotation, my resulting tasks might look something like this.
</div>

<div>
  <ul>
    <li>
      History and Physical 1
    </li>
    <li>
      History and Physical 2
    </li>
    <li>
      History and Physical 3
    </li>
  </ul>
  
  <div>
    Since I set them to <i>sequential</i>, OmniFocus will automatically hide all the unavailable ones so that only the &#8220;next&#8221; one shows up in my active perspective (assuming I have the filter set to &#8220;available&#8221;).  This makes it as simple as can be to see that I need to work on &#8220;History and Physical 7&#8221; without crowding my active tasks with 8-10.  Without the numbering, I&#8217;d only see &#8220;History and Physical&#8221; tasks without the number to remind me how far along I am, how many more are left (I suppose I could number them 7 / 10 or something).
  </div>
</div>

<div>
</div>

<div>
  I use this workflow of creating numbered tasks often enough that I decided to try to write a little script for it.  10 tasks isn&#8217;t so bad to do manually, but this seemed easy to automate.  Perhaps I&#8217;ll use it more often now for tasks that may need to be done 100s of times.
</div>

<div>
</div>

<div>
  I don&#8217;t know a whole lot of Applescript, so please forgive me if this is horribly written, but it seems to work.  It simply prompts for a task name, how many times the task needs to be done, and has the option to include a task note, since I often include hyperlinks in tasks that have to be done online (like virtual cases).  The tasks are simply placed in the inbox, since I find it just as fast to &#8220;select all&#8221; and use the inspector or drag-and-drop to group, assign projects, contexts, time estimates, etc.  <i>Suggestions for improvement are much appreciated.  Please leave them in the comments section below.</i>
</div>

<div style="text-align: center;">
  <a href="http://cl.ly/2i0q1U1e1s0c322X3X2k" target="_blank">Download this Applescript</a>
</div>



<div style="text-align: center;">
</div>

<div style="text-align: left;">
  Feel free to use and modify.  If you do, I appreciate links back to my blog / original posts.  Hope some of you find this useful!
</div>