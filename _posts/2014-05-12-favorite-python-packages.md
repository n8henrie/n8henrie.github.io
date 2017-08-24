---
id: 2516
title: Pip and a Few of My Favorite Python Packages
date: 2014-05-12T10:39:33+00:00
author: n8henrie
layout: post
guid: http://n8henrie.com/?p=2516
permalink: /2014/05/favorite-python-packages/
dsq_thread_id:
  - 2679734909
disqus_identifier: 2516 http://n8henrie.com/?p=2516
tags:
- Mac OSX
- python
categories:
- tech
---
**Bottom Line:** A brief look at `pip` and a few _sweet_ python3 modules.<!--more-->

This post started out as an email to a close buddy of mine, but I realized it would also make a pretty good post with a few small tweaks. He has a computer science background and is thinking about giving Python a shot (with my persistent nagging). I've already emailed him about my recommended way of installing Python (<a target="_blank" href="http://brew.sh/">homebrew</a>, since he's on OSX), and my recommended version of Python (<a target="_blank" href="https://docs.python.org/3/">python3</a>).

The best way to install modules is with `pip`, which will be symlinked from `pip3` if you're using a `python3` installation from homebrew. You used to have to install it separately (`brew install python3-pip` or `sudo apt-get python3-pip` or `sudo pacman -S python-pip` (since Arch uses python3 as default)), but it should now be pre-installed as of 3.4 or later.

Once you have it, you can `pip search` and it will search <a target="_blank" href="https://pypi.python.org/pypi">PyPI</a> (the python package index?), then you can `pip install` whatever package you're interested in (e.g. `pip install requests`). You can also `pip uninstall`, which is a big advantage over `easy_install` or several other Python package installation solutions — it keeps track of your installed packages. For that same reason, you can also `pip list --outdated` to see what packages have available updates, then `pip install -U` a specific package to update. Don't forget that you'll probably need to replace `pip` with `pip3` in all of these examples, assuming you installed from homebrew.

To avoid breaking things, it's probably better to upgrade individually, but you can also do a little bash scripting to batch upgrade all outdated packages. For example

```shell_session
pip3 list --outdated | ack "\(Current.*?\d+\)" | cut -d ' ' -f 1 | xargs -I{} bash -c "pip3 install -U {} || true"
```

<a target="_blank" href="http://beyondgrep.com/" title="Beyond grep: ack 2.12, a source code search tool for programmers">ack</a> is pretty great (`brew install ack`), but `grep` would also work. Here I'm just using it to filter out error messages from the pip output and only grab the lines that should reflect an upgradeable package. The `cut` strips out just the package name, and the rest upgrades the packages while always returning True (because otherwise `xargs` will stop the entire process if one of the packages has an error.

So, with that behind, here are a handful of my favorite packages, including links, and even a little code snippet for several showing why they're so awesome. (Sorry to the devs if I get your capitalization wrong.)

### <a target="_blank" href="http://docs.python-requests.org/" title="Requests: HTTP for Humans — Requests 2.2.1 documentation">Requests</a>

Makes accessing / form submitting / downloading a webpage as simple as possible, even if the page involves `POST` and cookies and authentication and all sorts of mumbo jumbo.

```python
# Returns the source code of my home page.
html = requests.get('http://n8henrie.com').content
```

```python
# A more complex GET request with simple auth
auth = ('user', 'pass')
payload = { 'query': 'my search term'}
html = requests.get('http://example.com', params = payload, auth = auth).content
```

```python
# A "session" which preserves cookies, so you can log in with a POST form, then
# GET data
payload = { 'username': 'n8henrie', 'password': 'hunter2'}
s = requests.Session()
s.post('http://example.com', data = payload)
html = s.get('http://example.com/loggedinuser').content
```

### <a target="_blank" href="http://www.crummy.com/software/BeautifulSoup/" title="Beautiful Soup: We called him Tortoise because he taught us.">BeautifulSoup</a>

Parses HTML.

```python
# Find the title from the n8henrie.com source code from above...
soup = bs4.BeautifulSoup(html)
title = soup.title.text

# Get the URL of each link on the page
links = soup.find_all('a')
urls = [link['href'] for link in links]

# Find the next paragraph element after the fourth link on the page (remember it starts at zero)
links[3].find_next('p')
```

### <a target="_blank" href="https://pypi.python.org/pypi/keyring" title="keyring 3.7 : Python Package Index">Keyring</a>

Provides access to the OSX Keychain, so you can keep your secure / encrypted passwords out of your scripts. Especially handy if you're sharing the code with others — you don't have to worry about editing out your passwords.

```python
# Set a password, either from the IDE or from a script, however you want.
# It will show up in Keychain.app immediately.
keyring.set_password('example.com', 'n8henrie', 'my_password')
```

```python
# Retrieve it later
pass = keyring.get_password('example.com', 'n8henrie')
```

```python
# Or, if you want to also mask your username
user = keyring.get_password('example.com', 'user')
pass = keyring.get_password('example.com', user)
```

### <a target="_blank" href="http://ipython.org/" title="Announcements — IPython">iPython</a>

I have a hard time describing it, but it's fundamental to my workflow. iPython provides an excellent IDE with code completion, history, autoindentation, access to the shell, logging your work (at any point `%logstart ~/Desktop/my_script.py` and your hard work will be preserved). The iPython Notebook is entirely different, but even more exciting — provides the in-browser IDE that you can work on piece by piece, running each segment of your script to get it right, displaying images and plots inline... just unreal. Then you can export your entire masterpiece as html and share it in a way that anyone can not only read like any other website, but if they also have iPython (and you provide a link to the notebook) they can also execute and tweak the code you used to make it. I probably read the thoughts of a hundred people trying to explain why they thought it was so awesome before I finally gave it a shot... and it to me it really every bit as amazing as they tried to convey.

### <a target="_blank" href="http://pandas.pydata.org/" title="Python Data Analysis Library — pandas: Python Data Analysis Library">Pandas</a> (including its implementations of matplotlib, numpy, etc.)

Code-based spreadsheeting on steroids. Imports excel, csv, and html based tables in a flash. Transform then, do some basic stats, and make some plots in no time. _Highly recommended_ to use with iPython Notebook. For example, even at my amateurish level, in under 15 minutes I was able to figure out how to import my entire <a target="_blank" href="https://mint.com">Mint</a> transaction history (conveniently downloadable as a .csv) and plot my spending history at a given establishment over time for the last several years.

```python
# My monthly spending on the iTunes Store.
# Axes intentionally omitted :S
import pandas as pd
df = pd.DataFrame.from_csv('mint_transactions.csv')
apple = df[df['Description'].str.contains('iTunes')]
monthly = apple.resample(rule = 'M', how = 'sum')
monthly.plot(kind = 'bar', legend = None)
```


![]({{ site.url }}/uploads/2014/05/20140511_20140511-ScreenShot-307.jpg)

### <a target="_blank" href="https://github.com/jgorset/facepy" title="jgorset/facepy · GitHub">facepy</a>

Wrapper for Facebook API

```python
# Get my most recent Facebook posts
graph = facepy.GraphAPI(my_api_key)
graph.get('me/posts')

# How many FB friends do I have?
len(graph.get('me/friends')['data'])
```

### <a target="_blank" href="https://pypi.python.org/pypi/icalendar/3.6.2" title="icalendar 3.6.2 : Python Package Index">icalendar</a>

The basis from my <a target="_blank" href="http://icsConverterWebapp.n8henrie.com">icsConverterWebapp</a> stuff. Lets me import / manipulate / export iCalendar files (the file format, not talking about Apple iCal).

### <a target="_blank" href="https://pypi.python.org/pypi/mutagenx" title="mutagenx 1.22.1 : Python Package Index">mutagenx</a>

Manipulate audio file metadata. _Really_ nice for batch file renaming when you have 300 files from some podcast that are all named `file_1.mp3 file_2.mp3`... and yet in iTunes you can **see** that they have descriptive titles embedded in the file somewhere...

```python
from mutagex.easyid3 import EasyID3

audio = EasyID3('my_file.mp3')

# Show all metadata
audio.pprint()

# Show specific metadata bits
print(audio['title'])
print(audio['genre'])

# Manipulate
audio['title'] = "New Title"
audio.save()
```

### <a target="_blank" href="http://pythonhosted.org/python-pushover/" title="Python-pushover documentation — python-pushover">Pushover</a>

Wrapper for the <a target="_blank" href="https://pushover.net/" title="Pushover: Simple Notifications for Android, iOS, and Desktop">Pushover</a> API, which I use to have my scripts send me push notifications. Note that URLs in the push notifications are clickable, making for a whole world of possibilities with <a target="_blank" href="http://x-callback-url.com/" title="x-callback-url">x-callback-url</a> schemes.

## Libraries that I want to learn to use at some point

### <a target="_blank" href="http://flask.pocoo.org/" title="Welcome - Flask (A Python Microframework)">Flask</a>

Lightweight web framework

### <a target="_blank" href="https://github.com/seatgeek/fuzzywuzzy" title="seatgeek/fuzzywuzzy · GitHub">FuzzyWuzzy</a>

Fuzzy string matching

### <a target="_blank" href="http://vincent.readthedocs.org/" title="Vincent: A Python to Vega Translator — Vincent 0.4 documentation">Vincent</a>

Pretty graphs and Python map making.
