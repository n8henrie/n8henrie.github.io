---
id: 2403
title: 'Use Chrome&#8217;s Cookies for Easier Downloading with Python Requests'
date: 2013-11-02T11:56:06+00:00
author: n8henrie
excerpt: Load Chrome’s cookies into Requests to make scripting bulk downloads much easier.
layout: post
guid: http://n8henrie.com/?p=2403
permalink: /2013/11/use-chromes-cookies-for-easier-downloading-with-python-requests/
yourls_shorturl:
  - http://n8henrie.com/n8urls/5z
dsq_thread_id:
  - 1930288178
---
**Bottom Line:** Load Chrome&#8217;s cookies into <a target="_blank" href="http://www.python-requests.org/" title="Requests: HTTP for Humans — Requests 2.0.1 documentation">Requests</a> to make scripting bulk downloads much easier.<!--more-->

**Update Feb 03, 2014:** I have slightly updated the script to make it easier to just copy and paste. It is now a function that can be placed into your code, and called with the URL as an argument. It returns the cookies in a format that Requests understands. The old code is still available <a href="https://gist.github.com/n8henrie/7273731" target="_blank">here</a>. This format can be placed in the same directory as your code and imported (as in the example in the code comments). If you&#8217;re an <a href="http://ipython.org/" target="_blank">iPython</a> user, you can get the &#8220;raw&#8221; link from the Gist and load it directly with the `%load` magic. Enjoy! </update>

I really dig <a target="_blank" href="http://www.python-requests.org/" title="Requests: HTTP for Humans — Requests 2.0.1 documentation">Requests</a>; it&#8217;s definitely one of the most useful Python libraries I&#8217;ve come across. I use it all the time to automate tasks that depend on data from a remote website. An example might be a script that every morning logged onto your favorite news site and grabbed all the headlines and emailed them to you. That kind of stuff.

It has _very_ good built-in support for authentication. Unfortunately, sometimes the website you&#8217;d like to log into makes the process&#8230; difficult. You can&#8217;t always just feed it a username and password, sometimes you need hidden form fields and other stuff designed to enhance security.

Luckily, most sites use temporary files called &#8220;cookies&#8221; that essentially tell a website that you&#8217;ve already successfully log in, so you don&#8217;t have to re-log in every time you refresh a page. For example, if you jump on a friend&#8217;s computer and go to Facebook, you&#8217;ll probably be able to post whatever you want to their feed without having to log in&#8230; because the cookies are already set. You have to manually hit the &#8220;log out&#8221; to make sure to clear those cookies.

As you can imagine, there are definitely some ramifications for privacy. On a positive note, you can take advantage of these cookies to make life easier. For example, recently I wanted to download a series of 73 PDF articles divided across 4 webpages. To make things even more difficult, it was from a medical journal that required authentication; if I just tried to write a script to grab the files, I got an error because I wasn&#8217;t logged in.

Luckily, I discovered that I could log in with Chrome, which made the necessary cookies, then grab those cookies with an <a target="_blank" href="http://www.sqlite.org/" title="SQLite Home Page">sqlite3</a> query and load them into Requests, and have Requests automate the downloading using the session that Chrome authenticated.

While this process will likely need to be tweaked for each specific case, I&#8217;m pretty sure that my batch-downloading needs will be satisfied much quicker from here on out by just logging in via GUI with a web browser, then stealing those cookies for my script. It&#8217;s kind of cheating, but for single-use scripts it sure beats trying to figure out all the hidden POST fields. Maybe there&#8217;s someone else out there that might find this handy, so I thought I&#8217;d share. I&#8217;ve tried to markup the code since several parts (like iterating through multiple pages) might be unnecessary for others. If you have questions or suggestions for improvement, please speak up in the comments!