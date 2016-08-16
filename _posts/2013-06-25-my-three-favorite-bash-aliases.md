---
id: 2296
title: My Three Favorite Bash Aliases
date: 2013-06-25T13:24:22+00:00
author: n8henrie
excerpt: 'As a *nix novice, I’ve enjoyed learning about aliases, which are little shortcuts you can write to make working in Terminal faster, easier, and more personalized.'
layout: post
guid: http://n8henrie.com/?p=2296
permalink: /2013/06/my-three-favorite-bash-aliases/
dsq_thread_id:
  - 1435041184
disqus_identifier: 2296 http://n8henrie.com/?p=2296
tags:
- Mac OSX
- nix
- Terminal
categories:
- tech
---
**Bottom Line:** Three Bash aliases that help me deal with aliases.<!--more-->

As a \*nix novice, I’ve enjoyed learning about aliases, which are little shortcuts you can write to make working in Terminal faster, easier, and more personalized. I’ll recommend Googling for more information, because there is more excellent-quality free information on \*nix than you could ever hope for. However, I will say that it probably involves creating a file called .bash\_profile in your home directory that will get read every time you log into a terminal, creating a file called .bash\_aliases in the same directory, then adding something like this to .bash_profile:

```bash
########
# source bash aliases
if [ -f ~/.bash_aliases ]; then
source ~/.bash_aliases
fi
########
```

The square brackets basically mean “a true/false condition is inside,” -f means “this file exists” (excellent overview of these types of operators <a target="_blank" href="http://tldp.org/LDP/abs/html/fto.html">here</a>), and source basically means “read this file.” So .bash\_profile gets read every time you log in, and in it you’re saying “and if .bash\_aliases exists, read it, too.” Regarding the “source” thing, you’ll have to “source” a file after it is changed to make sure it is re-read with the changes you just made.

Then you can fill .bash_aliases with all kinds of handy shortcuts. One simple example could be something like `alias n8home='cd ~'`. This would be a silly alias, since it’s actually longer to write the alias than the command, but sometimes the commands are just hard to remember. For example, `stat -f "%Mp%Lp %N"` returns the permissions for a file or directory in numerical format. That’s hard to remember for me, so I use `alias n8stat='stat -f "%Mp%Lp %N"'`, and I can just `n8stat example_file.txt`. I recommend adding in a #comment on the line above to remind you what the alias does (as I’ve done in the code “Add bash aliases” code block above).

As a note, you can test an alias out or use it temporarily by entering it directly into the Terminal instead of putting it into a file, and it will not persist between Terminal sessions.

**Okay, so on to my three favorites…**

  * `alias addalias='vim ~/.bash_aliases'` :: This one does nothing but open my .bash_aliases file in my preferred editor (<a target="_blank" href="http://www.vim.org/" title="welcome home : vim online">vim</a>), yet I think it’s the one I use most.
  * `alias sourceme="source ~/.bash_profile; source ~/.bash_aliases; source ~/.bashrc"` :: Again, very simple. Just type “sourceme” and three of the files I’m often changing related to aliases are re-read, so their changes are reflected.
  * `alias n8commands='cat ~/.bash_aliases | ack -o "(?<=^alias\s).*?(?=(=))"; cat ~/.bash_aliases | ack -o "^function\s.*?(?=(\s|{))";'` :: This one is a bit longer. Basically, I have a bunch of aliases (and some functions in the same files), and sometimes I forget what I called them. I start most of them with “n8” to make sure I won’t mix them up with some important system command. Anyway, this alias reads the .bash_aliases file then uses <a target="_blank" href="http://beyondgrep.com/" title="Beyond grep: ack 2.04, a source code search tool for programmers">ack</a> to search it for my alias and function names and print them out as a list, to remind me what I called them.

Note in that last one, ack in Linux is named ack-grep, but just ack in OSX.
