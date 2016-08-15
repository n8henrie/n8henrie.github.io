---
id: 2713
title: How to Control Your Raspberry Pi by SMS
date: 2015-03-31T08:31:41+00:00
author: n8henrie
excerpt: "Here's how to control your Raspberry Pi with text messages!"
layout: post
guid: http://n8henrie.com/?p=2713
permalink: /2015/03/how-to-control-your-raspberry-pi-by-sms/
dsq_thread_id:
  - 3642951467
disqus_identifier: 2713 http://n8henrie.com/?p=2713
---
**Bottom Line:** Here’s how to control your Raspberry Pi with text messages!<!--more-->

Several months ago, I <a href="http://www.reddit.com/r/homeautomation/comments/2ds21z/how_to_trigger_raspberry_pi_with_sms_xpost/" target="_blank">set out</a> to figure out how to control my Raspberry Pi by SMS / text messages. It took a while, but I think I eventually came up with a pretty good system. Here is how I got there, and some of the hurdles I faced along the way.

## First, a little background: Why SMS?

I decided to get a little <a href="http://www.amazon.com/gp/product/B00LPESRUK/ref=as_li_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=B00LPESRUK&linkCode=as2&tag=n8henriecom-20&linkId=NXE73QV4KBZYS7AA" target="_blank">Raspberry Pi B+</a> and learn how to use <a href="http://flask.pocoo.org/" target="_blank">Flask</a> and the RPi GPIO to make a dedicated home automation server. I decided on a webapp-based solution like Flask mostly for the universality — I could make a CSS3 responsive interface that would look good and work on practically _any_ device I happen to have handy. Since I could use the URL endpoints to trigger actions, I could set up bookmark shortcuts on my iPhone to be one-button triggers for certain actions. However, it was really the fact that it would work just as well on my iPhone as it would on my Arch Linux Chromebook that made the decision.

With universality in mind, I wanted a way to be able to control things remotely. While I could certainly set up SSH forwarding with pubkey authentication on <a href="https://itunes.apple.com/us/app/remoter-vnc-remote-desktop/id369626098?mt=8&uo=4&at=10l5H6" target="_blank" title="Remoter VNC - Remote Desktop">Remoter</a>, that tends to require a handful of clicks and several seconds to connect on my iPhone. Additionally, it’s not terribly user friendly for my wife, and it exposes an additional SSH port to the world. Finally, anyone that somehow got SSH access to the machine would have full control of my GPIO and home automation — a major potential security hazard.

In contrast, using SMS seems like a pretty good way to go. It’s platform agnostic, so it doesn’t tie me to my iPhone. It’s extra convenient given modern phone’s voice-to-text capabilities (e.g. “Hey Siri*, tell the house to turn on the front porch light”). My wife already knows how to use it. It requires no extra software. And finally, it could probably be made reasonably secure by limiting the phone numbers that were “acceptable senders” (though this almost certainly could be spoofed), but more importantly by limiting the processing of commands to a set of “known commands” or even by requiring a password in the SMS message. In other words, you should have very granular control over what the Pi can do based on a text message — you’ll be manually programming in things like “If the text message says ‘turn on the light’ then turn on the light.” Now if you are bold enough to do something like having a command that runs the content of the text message as a shell script… you’re opening yourself up to a world of hurt. Regardless, if nothing else, the 160 character limit on SMS would probably prevent certain attempts at code injection and contribute to some level of security. (**NB**: I’m certainly not trying to argue that this is _more_ secure than properly set up port forwarding and pubkey authentication.)

* In fact, although there are other method involving a proxy (which only work on a local network unless you jailbreak), I’d say this is probably the easiest way to control your Raspberry Pi with Siri.

## First Solution: Nokia Phone and Gnokii

At first, I wanted a cheap way to experiment and see if this was even feasible. I started out by looking for promising software, and I came across <a href="http://wammu.eu/gammu/" target="_blank">Gammu</a> and its <a href="http://wammu.eu/phones/" target="_blank">phone database</a>. I decided to try to find a compatible phone at a local thrift shop. Without much trouble, I found an old <a href="http://www.amazon.com/gp/product/B002IZJ5PQ/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=B002IZJ5PQ&linkCode=as2&tag=o5284-20" target="_blank" title="Nokia-Camera-Bluetooth-Speaker-QuadBand">Nokia 6133</a> for $3. For another $10 or so I was able to get a USB cable and a charging cable off Amazon.

Next was getting the phone activated. Luckily, I was able to get a free T-mobile SIM card during a promotion, and I purchased a pre-paid <a href="http://prepaid-phones.t-mobile.com/pay-as-you-go" target="_blank">“pay as you go”</a> plan that got me 30 text messages per month for just $3 (with extra SMS messages available at $0.10 apiece thereafter). I figure less than $10 for 3 months of service is more than worth it, and I don’t really see myself using this much more than that. (Some people might use more than this, but to me the SMS will just be for the occasional “Did I leave the heater on?” or “Can you turn on the crock pot?” type thing, with the local Flask interface for most day-to-day stuff.)

Unfortunately, after hours and days of fiddling, I couldn’t get the phone working quite right with Gammu, or should I say with its built in daemon, `gammu-smsd`. I could read the text messages just fine, but the daemon I planned to have wait for new messages in the background was having issues. I filed some bug reports and decided to try Gnokii, which I believe was <a href="http://wammu.eu/docs/manual/project/motivation.html" target="_blank">Gammu’s predecessor</a>. Fortunately I found it worked pretty darn well. Without too much difficulty, I was able to get Gnokii to read an incoming text message send to the Nokia phone, process its content, and trigger a (Python) script based on that content.

Important points that I needed to get this setup working include my Gnokii config file and my supervisor config.

### Gnokii Config

Here are the key points from my `/etc/gnokiirc` file:

    [global]
    port = 1
    model = series40
    initlength = default
    connection = dku2libusb
    use_locking = yes
    serial_baudrate = 19200
    authentication_type = none
    smsc_timeout = 10

### Supervisor setup

I decided to use the excellent <a href="http://supervisord.org/" target="_blank">Supervisord</a> to make sure the SMS daemon started on reboot and stayed running. Its config file, complete with arguments to make Gnokii monitor for incoming SMS messages:

    [program:smsd]
    command=/usr/sbin/smsd -m file -b IN -u /path/to/sms.py
    user=gnokii
    startretries=1000

### Run on SMS Script

Finally, here’s the `sms.py` script I ran on receiving a text:

    #! /path/to/venv/bin/python3
    '''sms.py
    Python script called by Gnokii smsd to process incoming texts.
    Be sure to change the shebang if calling from a virtualenv.
    '''
    
    import datetime
    import sys
    import re
    from fake_library import run_script
    
    def process_message(sender, sms_date, message):
        '''How to handle "safe" message.'''
    
        print('sms.py got a message at {} from {}. Message says: {}'.format(sms_date, sender, message))
    
        if message == "Turn on switch 3.":
            run_script(3)
    
        if re.search(r'.*?turn on.*?christmas lights', message, flags=re.IGNORECASE):
            run_script(4)
        if re.search(r'.*?turn off.*?christmas lights', message, flags=re.IGNORECASE):
            run_script(5)
    
    
    def main():
    
        known_phones = ['+1234567890', '+19876543210']
    
        phone_number = sys.argv[1]
        sms_date = sys.argv[2]
    
        if phone_number in known_phones:
            sms_body = sys.stdin.read()
    
            process_message(phone_number, sms_date, sms_body)
    
        else:
          # Maybe a push notification with Pushover?
            pass
    
    
    if __name__ == '__main__':
        main()

## Second Solution: Huawei E220 and Gammu

My Nokia and Gnokii solution worked pretty well, but I decided to try something different. For one, I wanted something _slightly_ faster — the previous solution sometimes took 20 or even 30 seconds for an SMS to be sent, received, and processed, and I figure at least _some_ of that time is due to Gnokii being so old (it hasn’t been actively maintained in quite a while, 2011 or so). Additionally, I just wanted to be going forward with a project that was being actively developed, like Gammu.

Unfortunately, as I’ve mentioned, I couldn’t get my Nokia working with Gammu, so I had to find another SMS capable device. To this end, I picked up a <a href="http://www.amazon.com/gp/product/B004UIVIBS/ref=as_li_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=B004UIVIBS&linkCode=as2&tag=n8henriecom-20&linkId=KVBKO272RGMCAE7M" target="_blank">Huawei E220</a> for about $20, and it has worked well with Gammu.

Key lines from my `/etc/gammu-smsdrc`:

    [gammu]
    device = /dev/ttyUSB1
    connection = at19200
    synchronizetime = yes
    logformat = textalldate
    use_locking = yes
    [include_numbers]
    number1 = +11234567890
    number2 = +10987654321
    [smsd]
    service = SQL
    logfile = /var/log/gammu-smsd.log
    debuglevel = 1
    runonreceive = venv/bin/python3 sms/process_sms.py
    driver = sqlite3
    database = gammu.db
    dbdir = /var/www/gammu/sms/db/

And from my supervisor startup file for the gammu-smsd daemon:

    [program:sms-daemon]
    command=/usr/bin/gammu-smsd
    user=gammu
    directory=/var/www/gammu
    startretries=1000

Gammu has pretty good documentation online and default config templates to help you figure out the above settings, but feel free to comment below if any part of my setup doesn’t make sense to you.

As you can see, gammu-smsd has a `runonreceive` directive, which is really the only part you need to run a script when you get a text. Just for kicks, I have additionally enabled the SQLite backend. Also, in contrast to Gnokii, where I had to programmatically filter “acceptable” incoming phone numbers (as you can see above), Gammu lets you specify acceptable incoming numbers with the `[include_numbers]` section of your config file.

    """process_gammu.py
    Called by gammu-smsd to process incoming sms messages.
    No need to filter by phone number, as safe numbers are set up in /etc/gammu-smsdrc.
    """
    
    import os
    import re
    
    def process_message(sender, message):
        """Handle the message content."""
    
        lamp_regex = re.compile(r"turn (on|off) the lamp", flags=re.IGNORECASE)
        lamp_search = re.search(lamp_regex, message)
    
        if lamp_search:
            toggle = lamp_search.group(1)
            if toggle.lower() == 'on':
                # do some stuff
            elif toggle.lower() == 'off':
                # do different stuff
    
    def main():
        for i in range(int(os.environ['SMS_MESSAGES'])):
            i += 1
            message = os.environ['SMS_{}_TEXT'.format(i)]
            sender = os.environ['SMS_{}_NUMBER'.format(i)]
    
            process_message(sender, message)
    
    if __name__ == '__main__':
        main()

Unfortunately, I didn’t have much luck debugging things with `logging` or `print()` statements, so in my testing I resorted to making my example script open and write a timestamp to a local file (make sure you have proper permissions for this, especially if you are running the daemon as a separate user). Initially I did a lot of testing by actually sending a text to the Pi, but this ended up using up my small allotment of prepaid texts pretty quickly. I found that I could simulate an incoming text for Gammu by setting some environmental variables and running the script like so:

    sudo -u gammu \
    SMS_MESSAGES=1 \
    SMS_1_TEXT='Turn off the lamp' \
    SMS_1_NUMBER='+3216540987' \
    venv/bin/python3 sms/process_sms.py

I think this should be enough info to help get you up and running with one of these methods, though it will still likely take some tweaking to get right. Feel free to comment below with any issues you run into trying to get set up. With any luck, you’ll be triggering scripts by SMS in no time!

Also, stay tuned for a couple of future posts where I go over using these scripts (as well as my Flask local interface) and the Raspberry Pi GPIO to control devices around the house — **without running as root**.