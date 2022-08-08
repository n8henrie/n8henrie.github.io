---
title: OpenSCAD in Neovim
date: 2022-05-17T15:56:10-06:00
author: n8henrie
layout: post
permalink: /2022/05/openscad-in-neovim/
categories:
- tech
excerpt: "Basic configuration to use Neovim for OpenSCAD development."
# grep -oP '(?<=>Posts tagged with ).*?(?=<)' ~/git/n8henrie.com/_site/tags/index.html
tags:
-
---
**Bottom Line:** Basic configuration to use Neovim for OpenSCAD development.
<!--more-->

I recent made my first not-entirely-trivial [OpenSCAD] model:
<https://www.thingiverse.com/thing:5382521>. It's an adapter for the hard drive
tray of the [Lenovo M93P](https://amzn.to/39UXicB) that converts it to accept
2 x 2.5" drives (SSDs in a ZFS mirror in my case) instead of the 3.5" HDD with
which it originally came.

I enjoyed exploring OpenSCAD, but for me, coding in its built-in
editor was not as pleasant as neovim. I wanted to see what options were
available to improve the situation.

In the process, I discovered a few things:

1. neovim doesn't yet recognize `.scad` files as a valid filetype
2. the most promising linter I came across is
   [SCA2D]
3. I use [ALE] for linting, and ALE
   does not yet have any linters for openscad files.
4. there doesn't seem to be a great formatter for openscad files, either; the
   [one I found][0] relies on `clang-format` under the hood for the heavy
   lifting
5. one can close the code editor in OpenSCAD and enable automatic reloading
   (under `Design` in the menu bar), so with every write done by neovim the
   preview window updates automatically

## 1: Getting neovim to recognize OpenSCAD files

**Future readers:** this part may soon be unnecessary, as it looks like there's a
commit that should accomplish the same thing in an upcoming release:
<https://github.com/neovim/neovim/commit/6e6f5a783333d1bf9d6c719c896e72ac82e1ae54>

Recent versions of neovim allow one to configure filetype settings in lua by
enabling `vim.g.do_filetype_lua = 1`. It didn't work for me until I put this at
the very top of my `init.lua`, likely some conflict with a plugin that I
couldn't sort out. Relevant discussion at reddit:
<https://www.reddit.com/r/neovim/comments/rvwsl3/comment/i8gjzzk/>

With this setting enabled, one now needs to create `filetype.lua`, in the same
directory as their `init.lua`, with contents similar to the following:

```lua
vim.filetype.add({
  extension = {
    scad = "openscad",
  },
})
```

Instead of enabling `do_filetype_lua`, one can accomplish the same thing with
the following (or in vim by only using the part in quotes):

```lua
vim.cmd("au BufRead,BufNewFile *.scad set filetype=scad")
```

Once this is figured, one should be able to `nvim foo.scad` and run `:set
filetype?` and see `filetype=openscad` at the bottom.

## 2 and 3: Linting

**Future readers:** this part may soon be unnecessary, as I've made a pull
request to get this into ALE; hopefully it can be merged soon!
<https://github.com/dense-analysis/ale/pull/4205>

**Update 20220808:** The pull request has been merged!

Next, I wanted to figure out how to hook up [ALE] with [SCA2d] so that I could
see warnings and errors as usual. This ended up being a litte bigger task than
I realized at the time. I found a [very helpful post][1] that walked me through
the basics. Between that and the in-neovim help for ALE, I floundered my way
through the process.

The short version is that one needs to:
1. place the code below into `ale_linters/openscad/sca2d.vim`, where
   `ale_linters/` is in the same directory as one's `init.lua` / `init.vim`
2. make sure to set `vim.b.ale_linters = { "SCA2D" }` somewhere (`~/.vim/after/ftplugin/openscad.lua` in my case)
3. `nvim foo.scad` to open a test file
4. make sure you've enabled `ALE` (however you've configured that)

```vimscript
call ale#linter#Define('openscad', {
            \   'name': 'SCA2D',
            \   'alias': ['sca2d'],
            \   'executable': 'sca2d',
            \   'command': '%e %t',
            \   'callback': 'SCA2D_callback',
            \   'lint_file': 1,
            \ })

function! SCA2D_callback(bufnr, lines) abort
    let filename_re = '^\([^:]*\):'
    let linenum_re = '\([0-9]*\):'
    let colnum_re = '\([0-9]*\):'
    let err_id = '\([IWEFU][0-9]\+\):'
    let err_msg = '\(.*\)'
    let pattern =  filename_re .
                \ linenum_re .
                \ colnum_re .
                \ ' ' .
                \ err_id .
                \ ' ' .
                \ err_msg

    let result = []
    let idx = 0
    for line in a:lines

        let matches = matchlist(line, pattern)
        if len(matches) > 0

            " option: Info, Warning, Error, Fatal, Unknown
            if index(["I", "W"], matches[4][0]) >= 0
                let type = 'W'
            else
                let type = 'E'
            endif

            let lnum = matches[2]
            let col = matches[3]

            " Better locations for some syntax errors
            if matches[4][0] == "F"
                let syntax_error_re = ', at line \([0-9]\+\) col \([0-9]\+\)$'
                let next_line = a:lines[idx+1]
                let syn_err_matches = matchlist(next_line, syntax_error_re)

                if len(syn_err_matches) > 0
                    let lnum = syn_err_matches[1]
                    let col = syn_err_matches[2]
                endif
            endif

            let element = {
                        \ 'lnum': lnum,
                        \ 'col': col,
                        \ 'end_lnum': lnum,
                        \ 'end_col': col,
                        \ 'text': matches[5],
                        \ 'detail': matches[4] . " " . matches[5],
                        \ 'filename': fnamemodify(matches[1], ':p'),
                        \ 'type': type
                        \ }
            call add(result, element)
        endif
        let l:idx += 1
    endfor
    return result
endfun
```

Hopefully, if you write `cube(10)` in your test file and `:w`, you should see a
syntax error (due to the missing `;`). Add the `;` at the end, and the syntax
error should go away. If you don't see this, the default ALE behavior is to
ignore everything if there was an error, which unfortunately can make it hard
to debug problems. You might try sprinkling some `echom 'foo!'` around and
checking `:messages` for some print debugging.

It's still early days for `SCA2D`, but I think the codebase looks well
organized and readible. It's written in Python, which should make it relatively
easy to make contributions, and the maintainer seems friendly. I think it has a
promising future.

## 4: Formatting

As I mentioned, OpenSCAD is a little light on auto-formatters, which is a
bummer. As the [other tool I found][0] seems to be relying on `clang-format`,
for now I'm just using `clang-format` directly. It looks like there is
*probably* some incompatibility with importing modules, but I haven't gotten
that far yet ¯\\\_(ツ)_/¯.

I was able to get it functional with the following in
`~/.vim/after/ftplugin/openscad.lua`:

```lua
vim.b.ale_c_clangformat_executable = "/opt/homebrew/opt/llvm/bin/clang-format"
vim.b.ale_c_clangformat_style_option = [[{
  IndentWidth: 4,
}]]
vim.b.ale_fixers = { "clang-format", unpack(vim.g.ale_fixers or {}) }
```

Notes:
- MacOS doesn't link LLVM stuff like `clang-format` into `PATH` by default, so
  I used the full path above, yours may differ (especially if you're on an
  x86_84 machine)
- `clang-format` accepts a whole host of formatting / configuration options;
  check them out with `clang-format --dump-config`

## 5: Leveraging autoreload

The last step I took was to give myself a keyboard shortcut (`F10`) that launches
OpenSCAD in the background, open to the current file:

Again, in `~/.vim/after/ftplugin/openscad.lua`:

```lua
vim.api.nvim_buf_set_keymap(
  0,
  "n",
  "<F10>",
  ":w<cr> :call system('/Applications/OpenSCAD.app/Contents/MacOS/OpenSCAD ' . expand('%:p') . ' 2> /dev/null &')<cr>",
  {
    noremap = true,
    silent = true,
  }
)
```

Once `F10` opens OpenSCAD, you can place its window to the side of your editor
and watch the preview update with every write to disk.

## Conclusion

With all of this out of the way, I'm pretty pleased with my upgraded situation
for coding with OpenSCAD. I open `example.scad` file in neovim, and the
filetype is properly detected, enabling my configuration preferences from
above. I enable `ALE`, and with each write to disk I get lint suggestions from
`SCA2D`, generally taking me to the line to (and in some cases the column) of
the problem. Additionally, the code is automatically reformatted to maintain
consistency (though I'll admit that I'm not a huge fan of `clang-format`'s
style so far, especially regarding one-op OpenSCAD modifiers that don't require
curly braces). I hit `F10` and get a live preview that I can put alongside my
neovim window to see how my project is progressing. I get to use all my usual
neovim macros and shortcuts, which really makes my day.

[OpenSCAD]: https://openscad.org/
[0]: https://github.com/Maxattax97/openscad-format/issues/11#issuecomment-1120058858
[1]: https://dhilst.github.io/2021/03/27/Adding-linters-to-ALE.html
[ALE]: https://github.com/dense-analysis/ale/
[SCA2D]: https://gitlab.com/bath_open_instrumentation_group/sca2d
