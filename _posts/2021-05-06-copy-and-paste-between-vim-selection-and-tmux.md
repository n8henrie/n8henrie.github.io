---
title: Copy and Paste Between Vim Selection and Tmux
date: 2021-05-06T10:44:10-06:00
author: n8henrie
layout: post
permalink: /2021/05/copy-and-paste-between-vim-selection-and-tmux/
categories:
- tech
excerpt: "Use this mapping to copy and paste between vim selection and tmux"
tags:
- linux
- vim
- Terminal

---
**Bottom Line:** Use this mapping to copy and paste between vim selection and tmux
<!--more-->

I like to keep the system clipboard and tmux clipboard separate, especially
since I'm frequently working on headless machines that have tmux but no system
clipboard (and vim is therefore compiled without clipboard support).

I used the mappings from [this Reddit
comment](https://www.reddit.com/r/vim/comments/8mnu4a/vimtmuxlinux_users_before_i_lose_my_mind_how_do_i/dzqehwb?utm_source=share&utm_medium=web2x&context=3)
for a while, which worked well, but they only yanked *whole lines* due to how
vim filters work.

I've modified it slightly so that it now faithfully respects the vim selection,
including visual block mode or single words instead of just full lines. I'm
quite happy with how it works now.

With these lines in your vimrc, you can make a visual selection in vim and
while still in visual mode use `<leader>tc` to copy your selection to the tmux
clipboard / buffer. When in normal mode, `<leader>tp` will paste your tmux
buffer into vim at the current cursor location and then restore the cursor to
the *beginning* of your pasted content. Both of these preserve your system
clipboard, but they will overwrite your `@0` register. This makes it so you can
access the copied or pasted content with e.g. `"0p`, like you might for other
yanked text.

```vimscript
vnoremap <leader>tc y<cr>:call system("tmux load-buffer -", @0)<cr>gv
noremap <leader>tp :let @0 = system("tmux save-buffer -")<cr>"0p<cr>g;
```
