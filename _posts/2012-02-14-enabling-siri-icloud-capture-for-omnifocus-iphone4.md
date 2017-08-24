---
id: 28
title: Enabling Siri / iCloud Capture for OmniFocus on an iPhone 4
date: 2012-02-14T17:52:00+00:00
author: n8henrie
layout: post
guid: http://www.n8henrie.com/?p=28
permalink: /2012/02/enabling-siri-icloud-capture-for-omnifocus-iphone4/
blogger_blog:
  - www.n8henrie.com
blogger_author:
  - Nathan Henrie
blogger_permalink:
  - /2012/02/enabling-siri-icloud-capture-on.html
geo_latitude:
  - 35.0844909
geo_longitude:
  - -106.6511367
geo_address:
  - 315-317 Central Ave NW, Albuquerque, NM 87102, USA
dsq_thread_id:
  - 811565502
blogger_images:
  - 1
disqus_identifier: 28 http://n8henrie.com/?p=28
tags:
- iPhone
- mobile
- OmniFocus
- productivity
- Siri
categories:
- tech
---
I got an email request for followup regarding a <a href="http://forums.omnigroup.com/showthread.php?t=23266" target="_blank">post I made on an OmniGroup Forum</a>.  Basically, people running OmniFocus on the iPhone 4S have a cool option that allows OmniFocus for iPhone to retrieve <a href="http://www.omnigroup.com/blog/entry/omnifocus_is_now_on_speaking_terms/" target="_blank">reminders made through Siri and pull them into OmniFocus</a>.  It's not perfect, but it's pretty cool.  For people that depend on OmniFocus for nearly everything (who, me?), this is a _huge_ bonus.  As a matter of fact, I was planning on upgrading to the iPhone 4S at my earliest available date, largely because of this single feature.  For some reason, this is _only_ enabled on the iPhone 4S, even though the iPhone 4 is running the exact same app.

However, AT&T got in the way by pushing back my upgrade availability date 3 weeks before my time was up.  Not very considerate of them, which is why my current plan is to let my AT&T contract expire and upgrade to an iPhone 5 (assuming it's been released by them) with Verizon.  We'll see how that works out.

In the meantime, I decided to check out how I could make the best of my remaining time with the iPhone 4.  To make a long story short(er), <a href="http://www.urbandictionary.com/define.php?term=swim" target="_blank">SWIM</a> got Siri running on SWIM's jailbroken iPhone 4, and found a way to enable OmniFocus's Siri / iCloud Capture option.  I probably wouldn't want to risk jailbreaking my iPhone, and I don't recommend it to others, but here are the steps SWIM took.

But first, one additional consideration.  The OmniGroup really seem like good people, and their products are of exceptionally high quality.  I strongly recommend anyone using an unpurchased version of their software to consider whether or not their work enhances your life.  If so, purchase a license.  You'll feel better about yourself afterwards. 

That said, they've <a href="http://forums.omnigroup.com/showthread.php?t=22688" target="_blank">explicitly stated that they left the Siri / iCloud Capture intentionally disabled</a> on all devices except the iPhone 4S.  I imagine they have good reasons for doing so, and anyone trying to circumvent this setting probably runs the risk of breaking their phone, losing the good standing of their OF license, angering the Omni gods, and possibly death.  Maybe.  Additionally, the process to enable the feature is currently very simple, but it needs to be re-enabled with each update of the app (the .plist change isn't preserved), and there's no guarantee that future updates won't make it much more difficult or impossible to do this.  Okay, with those disclaimers and warnings in mind, here goes.

First, this assumes that we're starting with a jailbroken iPhone 4 with Siri running well.  I am not interested in writing yet another how-to on this topic, Google has thousands of guides for getting to this point.  Once you've got Siri running, you'll need to download iFile from Cydia.  Although SWIM suggests you can also SSH in with something like <a href="http://cyberduck.ch/" target="_blank">Cyberduck</a>, and it works just as well, iFile makes the process slightly easier.  Additionally, with iFile you can do it all on your iPhone instead of needing a computer or second device.  Here are the steps that SWIM gave me:

 <span style="white-space: pre;"></span>1. <span style="white-space: pre;"></span>Just to be safe, start by closing out all backgrounded apps from the task manager  
 <span style="white-space: pre;"></span>2. <span style="white-space: pre;"></span>Open iFile  
 <span style="white-space: pre;"></span>3. <span style="white-space: pre;"></span>Navigate to /var/mobile/Applications  
 <span style="white-space: pre;"></span>4. <span style="white-space: pre;"></span>Scroll to OmniFocus*  
 <span style="white-space: pre;"></span>5. <span style="white-space: pre;"></span>Once in OmniFocus, open the "OmniFocus.app" folder  
 <span style="white-space: pre;"></span>6. <span style="white-space: pre;"></span>Pull down on the list of files to reveal a search box up top and use to find "info.plist"  
 <span style="white-space: pre;"></span>7. <span style="white-space: pre;"></span>Click on info.plist and choose "property list viewer"  
 <span style="white-space: pre;"></span>8. <span style="white-space: pre;"></span>Again, pull down slightly to reveal a search box and search for "Siri"  
 <span style="white-space: pre;"></span>9. <span style="white-space: pre;"></span>Turn on "DebugSiriCapture"**  
 <span style="white-space: pre;"></span>10. <span style="white-space: pre;"></span>Once you've turned it on, clear the search box and click somewhere to reveal a "done" button in the top right, and click it  
 <span style="white-space: pre;"></span>11. <span style="white-space: pre;"></span>That's it!  Close iFile and give it a shot.  You may need to either clear OmniFocus from the task manager and / or reboot, but hopefully you should now have the iCloud Reminders button in your in-app OF settings.

* If all the names look like gobbledygook, click the settings gear in the lower left corner and turn on "Application Names."  
** No need to mess with anything else.  <strike>Specifically, you can leave "EnableSiriOverride" off, I don't know what this does.</strike> Update: Was brought to my attention that this may not be true for everyone or every version of OF iPhone.  Apparently one of the recent OF iPhone updates has changed this, and I now find that I need to turn on the DebugEnableSiriOverride switch as well. —n8henrie Sat Feb 18 17:07:51 MST 2012

From here, follow the OmniGroup's instructions for setup.  Lots of setup bugs have been reported, and the forums (fora?) at http://forums.omnigroup.com/ are full of helpful tips.  Look for a followup post [insert future link here] on a few ideas how the iCloud Capture feature might be handy, even if you don't have Siri.

Update: Today OmniGroup released an update that enables Siri / iCloud Capture for OmniFocus iPad. The method above does \*not\* seem to be working; it enables the button to turn the feature on (in "Settings"), but if you click that button the app crashes. Does not appear to be making the app otherwise unstable. This is on my JB iPad 2 on 5.1. I'm wondering if it needs iOS 6, but I don't think my Siri port works on iOS 6 yet, so can't test. Today (Sep 17, 2012) OmniGroup released an update that enables Siri / iCloud Capture for OmniFocus iPad (v1.6). The method above does \*not\* seem to be working; it enables the button to turn the feature on (in "Settings"), but if you click that button the app crashes. Does not appear to be making the app otherwise unstable. This is on my JB iPad 2 on 5.1. I'm wondering if it needs iOS 6, but I don't think my Siri port works on iOS 6 yet, so can't test. Today's update for OF iPhone (1.15) doesn't seem to have affected this tweak, still working perfectly.
  
—n8henrie Mon Sep 17 22:25:50 MDT 2012