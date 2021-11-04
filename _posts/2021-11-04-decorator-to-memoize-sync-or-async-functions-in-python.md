---
title: Decorator to Memoize Sync or Async Functions in Python
date: 2021-11-04T10:32:45-06:00
author: n8henrie
layout: post
permalink: /2021/11/decorator-to-memoize-sync-or-async-functions-in-python/
categories:
- tech
excerpt: ""
# grep -oP '(?<=>Posts tagged with ).*?(?=<)' ~/git/n8henrie.com/_site/tags/index.html
tags:
- python
- tech

---
**Bottom Line:** I wrote a simple decorator that can memoize a sync or async
python function.
<!--more-->

Many pythonistas will be familiar with the idea of the [`memoize`
decorator][0]; it's essentially a decorator that keeps an internal dictionary
mapping the arguments used to call a function to the result of calling the
function with those arguments. When a function is decorated with this
decorator, calling the function results in a lookup in the dictionary. If the
dictionary already has a `key:value` pair where the `key` is a set of identical
arguments, it simply returns the associated `value`. If that `key:value` pair
does *not* exist, it runs the (potentially expensive) function, stores the
result in the dictionary for next time, then returns the value. Dan Bader has
done a great job going through this in greater detail at the link above. He
also notes that the standard library has a built-in tool that serves this
purpose, and is probably a better go-to than rolling your own decorator:
<https://docs.python.org/3/library/functools.html#functools.cache>.

One issue is that this `@memoize` decorator only works for sync functions;
async functions immediately return an awaitable coroutine, and so this
decorator would store that instead of the *result* of awaiting the coroutine,
which is probably what a user intends.

In order to memoize an async function, one can use third-party libraries such
as <https://github.com/aio-libs/async-lru>. Unfortunately, this can only be
used with *async* functions; passing it a regular function results in an error.

I wanted to see if I could come up with a simple, stdlib-only memoize
decorator that could work for both sync and async functions, and actually it
wasn't that difficult. Hopefully the code below is reasonably easy to
understand and copy and paste into your own simple project.

Please note that there are probably *lots* of edge cases that will trip this
up, and for production code it's probably a better idea to use
`functools.cache` and `alru_cache` to decorate your functions with the
applicable decorator. One big "gotcha" is that as written this code has
unlimited cache size and no simple method for cache invalidation, which could
lead to e.g. running out of memory if you were caching a large number of calls
with differing arguments, or functions that return memory-hungry objects.

However, for quick or simple projects, I've found it handy and simple to use.

```python
import asyncio
import time


def memoize(func):
    """
    (c) 2021 Nathan Henrie, MIT License
    https://n8henire.com/2021/11/decorator-to-memoize-sync-or-async-functions-in-python/
    """
    cache = {}

    async def memoized_async_func(*args, **kwargs):
        key = (args, frozenset(sorted(kwargs.items())))
        if key in cache:
            return cache[key]
        result = await func(*args, **kwargs)
        cache[key] = result
        return result

    def memoized_sync_func(*args, **kwargs):
        key = (args, frozenset(sorted(kwargs.items())))
        if key in cache:
            return cache[key]
        result = func(*args, **kwargs)
        cache[key] = result
        return result

    if asyncio.iscoroutinefunction(func):
        return memoized_async_func
    return memoized_sync_func


@memoize
async def asyncmain(foo, bar="bar"):
    await asyncio.sleep(2)
    return (42, bar)


@memoize
def syncmain(foo, bar="bar"):
    time.sleep(2)
    return (42, bar)


if __name__ == "__main__":
    # Should print 3 times after 2 seconds; once for the initial call, twice
    # more right afterwards with the cached result. 
    for _ in range(3):
        print(asyncio.run(asyncmain(23)))
        
    # Should print 3 times after 2 seconds; once for the initial call, twice
    # more right afterwards with the cached result. 
    for _ in range(3):
        print(syncmain(23))
    
    # Should print immediately as it was cached above
    print(asyncio.run(asyncmain(23)))
    
    # Should print after 2 seconds due to the addition of a kwarg
    print(asyncio.run(asyncmain(23, bar="bar")))
    
    # Should print after 2 seconds due to the modification of a kwarg
    print(asyncio.run(asyncmain(23, bar="qux")))
```



[0]: https://dbader.org/blog/python-memoization
