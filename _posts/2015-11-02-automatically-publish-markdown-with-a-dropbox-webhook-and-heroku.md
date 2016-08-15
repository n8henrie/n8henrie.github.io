---
id: 2761
title: Automatically Publish Markdown with a Dropbox Webhook and Heroku
date: 2015-11-02T09:41:25+00:00
author: n8henrie
excerpt: "Here's how to write in Markdown using an editor of your choice and publish  publicly accessible HTML to your Dropbox."
layout: post
guid: http://n8henrie.com/?p=2761
permalink: /2015/11/automatically-publish-markdown-with-a-dropbox-webhook-and-heroku/
dsq_thread_id:
  - 4283171220
disqus_identifier: 2761 http://n8henrie.com/?p=2761
---
**Bottom Line:** Here’s how to write in Markdown using an editor of your choice and publish publicly accessible HTML to your Dropbox.<!--more-->

A few weeks ago, I was looking to give away several small appliances I had laying around in our garage. I figured I’d first offer then to my coworkers and friends, and the easiest way to notify them would probably be by email. However, I figured some of the stuff would go quickly — hours, maybe minutes — while other stuff might take days for a response. Instead of having to deal with sending and receiving dozens of “Do you still have ?”… “No, sorry, but I still have…” emails, I thought — I know, I’ll just send the email with a link to a published webpage that I can update.

I was envisioning something simple, where I could write a little webpage in <a href="https://daringfireball.net/projects/markdown/" target="_blank" title="Daring Fireball: Markdown">Markdown</a>, get a publicly accessible link to the rendered HTML, then update the page on my iPhone as items were taken. That way, everyone could see what was left in almost real-time, and hopefully I could save myself a lot of emailing. I envisioned editing a plaintext file in one of my (several) existing iOS text editors and at most having to click a “sync” button to update the published HTML. It seemed like this would already have an existing solution, and I was surprised to have a hard time finding exactly what I wanted.

A few options I considered:

  * <a href="https://gist.github.com/" target="_blank">GitHub Gist</a> 
      * This _almost_ fits the bill, but there’s no way to get directly to the rendered HTML. Instead, readers would be stuck with the GitHub backdrop.
      * Also, would be difficult to update using my current iOS apps, especially since my handful of gist-centric ones are now defunct.
  * <a href="https://pages.github.com/" target="_blank">GitHub Pages</a> 
      * Would eliminate the above problem of directly rendering the HMTL, but would still be somewhat difficult to update from my iPhone.
  * <a href="https://notehub.org" target="_blank">NoteHub</a>, <a href="http://dillinger.io" target="_blank">Dillinger</a>, <a href="https://stackedit.io" target="_blank">StackEdit.io</a> 
      * These all seem like really great webapps, but I’m not totally clear about how to publish with them, whether the published link is static, whether I have to log in or add a password to resume editing a document, and how well they work on mobile, especially in a poor internet connectivity state (currently I’m out of town and hardly have enough signal to use vim over SSH).
      * Honestly, this may have been a good way to go, but I kept looking.
  * <a href="https://github.com/an0/Letterpress" target="_blank">LetterPress</a> 
      * This seems like a cool option overall but would require running on an always-on server to make sure my updates were pushed out quickly. Could have probably worked on one of my Raspberry Pis, but still not quite as simple as I’d been hoping.
  * Write an <a href="https://itunes.apple.com/us/app/editorial/id673907758?mt=8&uo=4&at=10l5H6" target="_blank" title="Editorial">Editorial</a> workflow using Python and an existing API 
      * Just seems like more hassle than I wanted.
  * Write Markdown in a text file on Dropbox, use my existing iOS and OS X apps to export to HTML as needed, manually update an HTML file in my Dropbox public folder 
      * Also just seems like more hassle than I wanted.
  * Use Google Docs or Apple Pages, both of which support publishing publicly viewable documents 
      * Probably would have worked fine, I just prefer Markdown to rich text, and I’m not a huge fan of either of these iOS apps.

Finally, after modifying my Google query dozens of times and thinking that there _had_ to be something out there, I came across <a href="https://github.com/dropbox/mdwebhook" target="_blank">mdwebhook</a>, which is an example app put out by the Dropbox team to demonstrate how to create a web app that takes advantage of <a href="https://www.dropbox.com/developers/reference/webhooks#tutorial" target="_blank">webhooks</a>. You can think of webhooks as basically a “push notification” that Dropbox will send to a webapp when a file changes in that app’s Dropbox folder. That app can then be triggered to process the list of changes and possibly act on them. Their example app, mdwebhook, just so happens to do almost _exactly_ what I was looking for — it processes the changed files in a folder (as triggered by a webhook), and it takes any changed markdown files (whose names end in `.md`) and converts them to a matching HTML file. Perfect! I especially liked that it means you’re totally in control of the code being used for the webapp, so you can customize it as needed and help make sure it runs as intended.

Better yet, the Dropbox team had set everything up so that all you need to do is click a button in the GitHub README to deploy your own copy to Heroku. I hadn’t worked with Heroku much before this, but it seems like everybody thinks it’s great, so I wanted to give it a shot. It ended up being surprisingly easy to do, and in fact it worked well enough that I decided to fork mdwebhook and make <a href="https://github.com/n8henrie/natedown" target="_blank">a Python 3 version with a few minor customizations</a>. Here’s how you can get set up (with either one, depending on your preference for Python 2 or Python 3).

  1. Set up a Dropbox API app: <https://www.dropbox.com/developers/apps>.
  2. The app name will be the name of the folder that shows up in your `Dropbox/Apps/` directory.
  3. For security purposes, set its permissions to only have access to its own folder.
  4. You’ll need the **app key** and **app secret** in the following steps.
  5. Fork the GitHub repo: <a href="https://github.com/n8henrie/natedown" target="_blank">natedown (Python 3)</a> or <a href="https://github.com/dropbox/mdwebhook" target="_blank">mdwebhook (Python 2)</a>.
  6. Click the `Deploy to Heroku` button from the rendered README in _your_ repo.
  7. Fill in the values from step 4 and deploy.
  8. Visit the webapp, give it permissions to its own folder in Dropbox, and test it out.

Now, you should be able to clone your GitHub repo locally and make changes. If you install the <a href="https://toolbelt.heroku.com" target="_blank">Heroku Toolbelt</a>, you should be able to `heroku login`, then `git remote add heroku https://git.heroku.com/natedown.git` (obviously replacing `natedown` with your Heroku app’s name) and push changes directly to heroku: `git push heroku master`, or `git push heroku mybranch:master` (since Heroku only publishes its `master` branch).

## Other notes

For local testing and development, you may need to add the local URL hosting the Flask app (e.g. `127.0.0.1:5000`) to the `Redirect URIs` section of the Dropbox App.

In my slightly modified version, the app:

  * is updated for Python 3
  * supports <a href="https://help.github.com/articles/github-flavored-markdown/" target="_blank" title="GitHub Flavored Markdown - User Documentation - GitHub Help">Github Flavored Markdown</a>
  * retrieves a publicly available link to the HTML file and includes it as an HTML comment at the top of the file, so if you wait a few seconds, you can just copy the link at the top of your Markdown (or in the HTML if you `show source`) to share with others. 

In the end, you should have an extremely simple and functional way to write Markdown in a Dropbox folder using your app of choice on the platform of your choice and have an automatically updating HTML version of that file appear alongside. Additionally, you can customize and tweak to your liking with a little bit of Python. Big thanks to the Dropbox team for creating `mdwebhook` and providing an excellent service that supports webhooks!