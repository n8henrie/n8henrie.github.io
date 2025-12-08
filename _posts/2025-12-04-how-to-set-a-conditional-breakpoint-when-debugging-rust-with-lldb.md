---
title: How to Set a Conditional Breakpoint When Debugging Rust with LLDB
date: 2025-12-04T21:01:58-07:00
author: n8henrie
layout: post
permalink: /2025/12/how-to-set-a-conditional-breakpoint-when-debugging-rust-with-lldb/
categories:
- tech
excerpt: "A little Python can help LLDB break on `String` contents in Rust."
tags:
- rust
- debugging
---
**Bottom Line:** A little Python can help LLDB break on `String` contents in Rust.

A few months ago I was trying to debug some Rust code that was misbehaving.
The bug was in a function that was run hundreds of thousands of times, but I had made a logic error somewhere that only seemed to manifest in a very small fraction of the cases.
I had gathered a few examples that were reliably misbehaving, so I wanted to set a breakpoint in this function, but have it **only break depending on the contents of a specific variable** (a `String` in this case).

I do a fair amount of work on my Macbook, so I *try* to use LLDB as my debugger, since it runs on both MacOS and Linux.
Unfortunately for me, it seems far more popular to debug Rust with a Linux + GDB setup, and it's relatively difficult to find LLDB-specific content.
Thankfully I have the option to switch to a Linux + GDB workstation when needed, but I prefer to sort things out with LLDB when possible.
This post describes my journey sorting out the process of establishing a conditional breakpoint for Rust code, using LLDB.

As a very brief introduction, I can compile this code in debug mode with an unpretentious `cargo build`:

```rust
fn main() {
    let var = String::from("asdf");
    println!("{:?}", var);
}
```

`rustup` provides a `rust-lldb` helper script, often found at `~/.cargo/bin/rust-lldb`, and invoking `lldb` this way sets up some pretty printers and helpers to make the Rust experience more ergonomic.
I recommend using it.
To debug this executable (in this case creatively named `foo`), I'll run `rust-lldb target/debug/foo`.
Once LLDB is set up, I can print the value of `var` by:

1. setting a breakpoint at the function named `foo::main`
1. `run` to run the executable until the breakpoint is hit, at which point `var` will not yet be defined
1. `n` to step to the "next" line (after which `var` is defined)
1. `p` to print `var`

Here's how this looks:

```
$ rust-lldb target/debug/foo
...skipping some lldb output...
(lldb) break set --name foo::main
Breakpoint 1: where = foo`foo::main::hf5da6d1ecd5155fc + 20 at main.rs:2:15, address = 0x0000000100000ef8
(lldb) run
Process 63389 launched: '/path/to/foo/target/debug/foo' (arm64)
Process 63389 stopped
* thread #1, name = 'main', queue = 'com.apple.main-thread', stop reason = breakpoint 1.1
    frame #0: 0x0000000100000ef8 foo`foo::main::hf5da6d1ecd5155fc at main.rs:2:15
   1    fn main() {
-> 2        let var = String::from("asdf");
                      ^
   3        println!("{:?}", var);
   4    }
(lldb) n
Process 63389 stopped
* thread #1, name = 'main', queue = 'com.apple.main-thread', stop reason = step over
    frame #0: 0x0000000100000f10 foo`foo::main::hf5da6d1ecd5155fc at main.rs:3:5
   1    fn main() {
   2        let var = String::from("asdf");
-> 3        println!("{:?}", var);
            ^
   4    }
(lldb) p var
(alloc::string::String) "asdf" {
  [0] = 'a'
  [1] = 's'
  [2] = 'd'
  [3] = 'f'
}
```

LLDB supports conditional breakpoints by adding `-c 'my condition'` to the `break set` (in addition to breaking on a specific line in a file, as opposed to in a function, via `-f path/to/file.rs -l line_number`).
Unfortunately, attempting to break on a condition like `var.contains("asdf")` fails:

```
(lldb) b -f foo/src/main.rs -l 3 -c 'var.contains("asdf")'
(lldb) run
...
error: stopped due to an error evaluating condition of breakpoint 4.1: "var.contains("asdf")"
Couldn't parse conditional expression:
error: <user expression 3>:1:5: no member named 'contains' in 'alloc::string::String'
    1 | var.contains("asdf")
      | ~~~ ^
```

With some help from Claude I eventually found a way to cast into a type that worked, but it's not very ergonomic:

```
(lldb) b -f foo/src/main.rs -l 3 -c '(char*)strstr((char*)var.vec.buf.inner.ptr.pointer.pointer, "asdf")'
(lldb) run
Process 7605 launched: '/path/to/foo/target/debug/foo' (arm64)
Process 7605 stopped
* thread #1, name = 'main', queue = 'com.apple.main-thread', stop reason = breakpoint 19.1
    frame #0: 0x0000000100000d8c foo`foo::main::h5c931762e824ef5f at main.rs:3:5
   1    fn main() {
   2        let var = String::from("asdf");
-> 3        println!("{var}");
            ^
   4    }
```

By far the easiest approach that I came up with was just modifying the source code to do the searching, and then adding a fitting breakpoint.
For example, if one is able to modify the source and is searching for the string `NEEDLE` in variable `haystack`, just add:

```rust
if haystack.contains("NEEDLE") {
    dbg!(&haystack); // <- breakpoint here
}
```

Done.

However, my [interest was piqued][1], so I kept digging for other ways to accomplish this with LLDB.
I asked for suggestions [on the Rust user forum][0].
Nobody chimed in to point out an obvious easy way, but one user was kind enough to suggest that I look into creating custom functions.

I found the official documentation to be interesting and fairly approachable.
These pages were particularly helpful:

- <https://lldb.llvm.org/use/tutorials/breakpoint-triggered-scripts.html>
- <https://lldb.llvm.org/use/tutorials/writing-custom-commands.html>
- <https://lldb.llvm.org/use/map.html>

For context, I'm using:

```console
$ lldb --version
lldb version 21.1.2
```

I decided to use this Rust code as my test case, ensuring that I can search within a nested structure:

```rust
#[derive(Debug)]
struct Parent {
    child: Child,
}

#[derive(Debug)]
struct Child {
    data: String,
}

fn main() {
    let parent = Parent {
        child: Child {
            data: String::from("hello"),
        },
    };

    println!("{:?}", parent.child.data);
}
```

LLDB supports a couple of scripting language options for conditional breakpoints.
I know Python best, so that was an easy choice in my case.
The conditional breakpoint script I eventually got to work is:

```python
def break_if_contains(frame, bp_loc, extra_args, internal_dict):
    """Break if a Rust string contains a substring

    NB: Returning `False` means "do *not* break". Anything else (including
        `return None`, empty return, or no return value specified) means
        *do* break

    Usage:
        (lldb) command script import /path/to/filename.py
        (lldb) # set a breakpoint however you like
        (lldb) break set -f foo/src/main.rs -l 13
        (lldb) break command add --python-function filename.break_if_contains \
            -k haystack -v UNQUOTED_VAR_NAME \
            -k needle -v UNQUOTED_STRING \
            BREAKPOINT_NUMBER
        (lldb) run

    Example:
        (lldb) break command add -F strcompare.break_if_contains \
            -k haystack -v self.description \
            -k needle -v Hello \
            1
    """
    needle = str(extra_args.GetValueForKey("needle"))
    haystack = str(extra_args.GetValueForKey("haystack"))

    parts = haystack.split(".")
    current = frame.FindVariable(parts[0])
    if not current.IsValid():
        return False

    for part in parts[1:]:
        current = current.GetChildMemberWithName(part)
        if not current.IsValid():
            return False

    summary = current.summary.strip('"')
    return needle in summary
```

Hopefully I've made the setup and usage fairly clear in the docstring.
Passing variables to the function is a little odd; the most obvious way I could find is by passing key-value pairs, specified by `-k` and `-v` respectively.
The values are then accessible via `extra_args.GetValueForKey()` as shown.

Writing and debugging this function was made easier by a few strategies:

- one can use `breakpoint()` in the Python script to drop into PDB (from LLDB) at runtime, just like a normal Python script
- lldb (or `rust-lldb`) accepts a `-o` / `--one-line` flag that will automatically run an LLDB command at launch time
  - `-o 'another command'` can be repeated to run multiple commands in series
- the same Python file that contains the `break_if_contains` function can also define a `__lldb_init_module(debugger, internal_dict)` function that can then automatically run LLDB code at `command script import` time via `debugger.HandleCommand("lldb command here")`
  - for my purposes, using `-o 'some lldb command'` from bash vs `debugger.HandleCommand("some lldb command")` within the body of `__lldb_init_module()` seems to be different routes to accomplish the same task

For example, I used a bash script that I would run after each iteraction of the Python function to launch LLDB and import the script:

```bash
#!/usr/bin/env bash

cargo build
rust-lldb target/debug/foo \
    -o 'command script import /path/to/strcompare.py'
```

In the imported Python script, I included this function, which automatically sets a breakpoint, modifies the breakpoint to conditionally break based on the result of the Python function, then tells LLDB to proceed with running the binary:

```python
def __lldb_init_module(debugger, internal_dict):
    debugger.HandleCommand("break set -f foo/src/main.rs -l 13")
    debugger.HandleCommand(
        " ".join(
            [
                "breakpoint command add --python-function strcompare.break_if_contains",
                "-k haystack -v parent.child.data",
                # "-k haystack -v parent",
                "-k needle -v hello",
            ]
        )
    )
    debugger.HandleCommand("run")
```

As you can see, this can simplify commenting out parts of the script (in this case I was ensuring that it works for simple variables like `String::from("foo")` as well as layered structs).
You may also notice that specifying the number of the breakpoint to modify is optional; if omitted, it defaults to the most recently added breakpoint.
I could have done this in the bash script, but the complexities of line continuation in bash made Python a little more comfortable for this task.

Finally, because it feels a little clumsy to have to *first* set a breakpoint and then *separately* modify it with the conditional script, here is an example of how to write an LLDB "custom command" that can accept all required arguments, set up the breakpoint, modify it, and `run`, all in one fell swoop:

```python
def run_break(debugger, command, exe_ctx, result, internal_dict):
    """Helper to run `break_on_contains`

    All arguments are required:
        `-f`: file for breakpoint
        `-l`: line for breakpoint
        `-n`: needle
        `-h`: haystack

    example:
        (lldb) run_break -f foo/src/main.rs -l 17 -n hello -h parent.child.data
    """
    args = command.split()
    args.reverse()
    while True:
        try:
            arg = args.pop()
        except IndexError:
            break
        match arg:
            case "-f":
                file = args.pop()
            case "-l":
                line = args.pop()
            case "-n":
                needle = args.pop()
            case "-h":
                haystack = args.pop()
    debugger.HandleCommand(f"break set -f {file} -l {line}")
    debugger.HandleCommand(
        " ".join(
            [
                "breakpoint command add --python-function strcompare.break_if_contains",
                f"-k haystack -v {haystack}",
                f"-k needle -v {needle}",
            ]
        )
    )
    debugger.HandleCommand("run")


def __lldb_init_module(debugger, internal_dict):
    debugger.HandleCommand(
        "command script add -f strcompare.run_break run_break"
    )
```

Clearly this could be cleaned up with `argparse` and maybe `shlex`.
However, it accomplishes my goal of a conditional breakpoint based on `String` contents in Rust!
At this point, the process is as simple as this:

```
$ rust-lldb target/debug/foo
(lldb) command script import /path/to/strcompare.py
(lldb) run_break -f foo/src/main.rs -l 17 -n hello -h parent.child.data
Breakpoint 1: 2 locations.
Process 64567 launched: '/path/to/foo/target/debug/foo' (arm64)
Process 64567 stopped
* thread #1, name = 'main', queue = 'com.apple.main-thread', stop reason = breakpoint 1.1
    frame #0: 0x0000000100000f74 foo`foo::main::hf5da6d1ecd5155fc at main.rs:18:5
   15           },
   16       };
   17
-> 18       println!("{:?}", parent.child.data);
            ^
   19   }
```


Finally, as one last convenience, if one wanted all of this to be automatically loaded at LLDB startup, one can create a file at `~/.lldbinit` with the following contents:

```text
command script import /path/to/strcompare.py
```

After that, one should be able to invoke `rust-lldb` and subsequently the `run_break` helper function is ready to rock!

Here is my final (proof of concept) code:

````python
"""strcompare.py

Adds Rust string comparison breakpoint to lldb

Usage:

```
$ rust-lldb target/debug/my_binary
(lldb) command script import /path/to/strcompare.py
(lldb) break set -f project_name/src/main.rs -l 42
(lldb) break command add -F strcompare.break_if_contains -k haystack -v self.description -k needle -v hello 1
(lldb) run
```

Alternatively, using the `run_break` helper:

```
$ rust-lldb target/debug/my_binary
(lldb) command script import /path/to/strcompare.py
(lldb) run_break -f project_name/src/main.rs -l 42 -n hello -h self.description
```

Further reading:

<https://n8henrie.com/2025/12/how-to-set-a-conditional-breakpoint-when-debugging-rust-with-lldb/>
<https://lldb.llvm.org/use/tutorials/writing-custom-commands.html>
<https://lldb.llvm.org/use/tutorials/breakpoint-triggered-scripts.html>
"""


def break_if_contains(frame, bp_loc, extra_args, internal_dict):
    """Break if a Rust string contains a substring

    Usage:
        (lldb) break command add -F filename.break_if_contains \
            -k haystack -v UNQUOTED_VAR_NAME \
            -k needle -v UNQUOTED_STRING \
            BREAKPOINT_NUMBER

    Example:
        (lldb) break command add -F strcompare.break_if_contains \
            -k haystack -v self.description \
            -k needle -v Hello \
            1
    """
    needle = str(extra_args.GetValueForKey("needle"))
    haystack = str(extra_args.GetValueForKey("haystack"))

    parts = haystack.split(".")
    current = frame.FindVariable(parts[0])
    if not current.IsValid():
        return False

    for part in parts[1:]:
        current = current.GetChildMemberWithName(part)
        if not current.IsValid():
            return False

    summary = current.summary.strip('"')
    return needle in summary


def run_break(debugger, command, exe_ctx, result, internal_dict):
    """Helper to run `break_on_contains`

    All arguments are required:
        `-f`: file for breakpoint
        `-l`: line for breakpoint
        `-n`: needle
        `-h`: haystack

    example:
        (lldb) run_break -f foo/src/main.rs -l 17 -n hello -h parent.child.data
    """
    args = command.split()
    args.reverse()
    while True:
        try:
            arg = args.pop()
        except IndexError:
            break
        match arg:
            case "-f":
                file = args.pop()
            case "-l":
                line = args.pop()
            case "-n":
                needle = args.pop()
            case "-h":
                haystack = args.pop()
    debugger.HandleCommand(f"break set -f {file} -l {line}")
    debugger.HandleCommand(
        " ".join(
            [
                "breakpoint command add --python-function strcompare.break_if_contains",
                f"-k haystack -v {haystack}",
                f"-k needle -v {needle}",
            ]
        )
    )
    debugger.HandleCommand("run")


def __lldb_init_module(debugger, internal_dict):
    debugger.HandleCommand(
        "command script add -f strcompare.run_break run_break"
    )
````


[0]: https://users.rust-lang.org/t/rust-lldb-conditional-breakpoint-on-string-value
[1]: https://xkcd.com/356/
