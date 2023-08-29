---
title: Hacking on nixpkgs with nix develop
date: 2023-08-02T12:53:23-06:00
author: n8henrie
layout: post
permalink: /2023/08/hacking-on-nixpkgs-with-nix-develop/
categories:
- tech
excerpt: "Learning to modify `nixpkgs` using `nix develop`"
tags:
- linux
- Mac OSX
- MacOS
- nix
- tech
---
**Bottom Line:** Failing to add MPS support to nixpkgs.python310Packages.torch.
<!--more-->

I've been using nix / nixpkgs / NixOS on and off for a year or two now. I've
been genuinely impressed at how open and welcome the community is to
contributions, so I'd like to start taking advantage of that by contributing
back.

I'm writing this post as I go, in the spirit of this (highly recommended)
series: <https://ianthehenry.com/posts/how-to-learn-nix/>.

The issue I'd like to work on is adding MPS support to the pytorch derivation:
<https://github.com/NixOS/nixpkgs/issues/243868>; NB: the `torch-bin`
derivation already has it.

(SPOILER: I was not successful, but I did learn a few things along the way.)

commit (though one would normally stay on `master` in order to contribute a
PR).

```console
$ git clone https://github.com/NixOS/nixpkgs.git
$ cd nixpkgs
$ git checkout 7d053c812bb59bbb15293f9bb6087748e7c21b1a
```

First we'll make sure we can build and run the current derivation (some
[context][1] for this command):

```console
$ nix shell "$(
    nix eval --raw --apply '
        py: (py.withPackages (pp: [ pp.torch ])).drvPath
    ' .#python310
)"
$ type -p python
/nix/store/1sgzgqbfyj8sn7rjzhvrzy1nj38cwfi1-python3-3.10.12-env/bin/python
$ python -c 'import torch; print(torch.__version__, torch.backends.mps.is_available())'
2.0.1 False
$ exit
$
```

Cool.

The nix build process is documented in a few places, to get an idea of what's
going on above:

- <https://nixos.org/guides/nix-pills/fundamentals-of-stdenv.html#id1466>
- <https://nixos.org/manual/nixpkgs/stable/#chap-stdenv>
- <https://nixos.org/manual/nixpkgs/stable/#sec-building-stdenv-package-in-nix-shell>

> While inside an interactive nix-shell, if you wanted to run all phases in the
> order they would be run in an actual build, you can invoke genericBuild
> yourself.

So basically, it looks like the process is:
- run `nix-shell -A foo` <- this sources `$stdenv/setup`, which defines a bunch
  of phases
- run `genericBuild` <- this was defined in the step above

Let's try it:

```console
$ # show that e.g. buildPhase and stdenv are undefined:
$ declare -p stdenv
bash: declare: stdenv: not found
$ declare -f buildPhase
$
$ nix-shell -A python3Packages.torch
Sourcing python-remove-tests-dir-hook
Sourcing python-catch-conflicts-hook.sh
Sourcing python-remove-bin-bytecode-hook.sh
Sourcing setuptools-build-hook
Using setuptoolsBuildPhase
Using setuptoolsShellHook
Sourcing pip-install-hook
Using pipInstallPhase
Sourcing python-imports-check-hook.sh
Using pythonImportsCheckPhase
Sourcing python-namespaces-hook
Sourcing python-catch-conflicts-hook.sh
Executing setuptoolsShellHook
Finished executing setuptoolsShellHook
$
$ # we can see that stdenv and buildPhase are now defined:
[nix-shell:~/git/nixpkgs]$ declare -p stdenv
declare -x stdenv="/nix/store/lplcqh67ldaj5f4pg4js2sgf860nn4iz-stdenv-darwin"
[nix-shell:~/git/nixpkgs]$ declare -f buildPhase
buildPhase ()
{
    runHook preBuild;
    if [[ -z "${makeFlags-}" && -z "${makefile:-}" && ! ( -e Makefile || -e makefile || -e GNUmakefile ) ]]; then
        echo "no Makefile or custom buildPhase, doing nothing";
    else
        foundMakefile=1;
        local flagsArray=(${enableParallelBuilding:+-j${NIX_BUILD_CORES}} SHELL=$SHELL);
        _accumFlagsArray makeFlags makeFlagsArray buildFlags buildFlagsArray;
        echoCmd 'build flags' "${flagsArray[@]}";
        make ${makefile:+-f $makefile} "${flagsArray[@]}";
        unset flagsArray;
    fi;
    runHook postBuild
}
[nix-shell:~/git/nixpkgs]$
[nix-shell:~/git/nixpkgs]$ # we can see where buildPhase is defined:
[nix-shell:~/git/nixpkgs]$ grep '^buildPhase' $stdenv/setup
buildPhase() {
```

Now we'll try with the `nix develop` environment. You can add the `--debug`
flag for a lot of extra information on what it's doing.

```console
$ # show that stdenv and buildPhase are undefined:
$ declare -p stdenv
bash: declare: stdenv: not found
$ declare -f buildPhase
$
$ nix develop .#python310Packages.pytorch
$ # it looks like the same environment is available:
$ declare -p stdenv
declare -x stdenv="/nix/store/lplcqh67ldaj5f4pg4js2sgf860nn4iz-stdenv-darwin"
$ declare -f buildPhase
buildPhase ()
{
    runHook preBuild;
    if [[ -z "${makeFlags-}" && -z "${makefile:-}" && ! ( -e Makefile || -e makefile || -e GNUmakefile ) ]]; then
        echo "no Makefile or custom buildPhase, doing nothing";
    else
        foundMakefile=1;
        local flagsArray=(${enableParallelBuilding:+-j${NIX_BUILD_CORES}} SHELL=$SHELL);
        _accumFlagsArray makeFlags makeFlagsArray buildFlags buildFlagsArray;
        echoCmd 'build flags' "${flagsArray[@]}";
        make ${makefile:+-f $makefile} "${flagsArray[@]}";
        unset flagsArray;
    fi;
    runHook postBuild
}
```

If we look at the definition of `genericBuild` in `$stdenv/setup`, we can see
the list of `phases` that the manual keeps talking about:

```bash
if [ -z "${phases[*]:-}" ]; then
    phases="${prePhases[*]:-} unpackPhase patchPhase ${preConfigurePhases[*]:-} \
        configurePhase ${preBuildPhases[*]:-} buildPhase checkPhase \
        ${preInstallPhases[*]:-} installPhase ${preFixupPhases[*]:-} fixupPhase installCheckPhase \
        ${preDistPhases[*]:-} distPhase ${postPhases[*]:-}";
fi
```

In this case `phases` doesn't seem to be defined...

```console
$ declare | grep '^phases'
$
```

... so I assume it's using the default phases listed above.


Let's see what happens if we manually follow those phases:

```console
$ ${prePhases[*]}
$ unpackPhase
unpacking source archive /nix/store/dxqxfw4r00s0v033w7yam3bkblynrad7-source
source root is source
setting SOURCE_DATE_EPOCH to timestamp 315644400 of file source/version.txt
$ patchPhase
$ ${preConfigurePhases[*]}
$ configurePhase
no configure script, doing nothing
$ ${preBuildPhases[*]}
$ buildPhase
/nix/store/bq1q4gk52gsx4fg4pf07f2kxqgazkcls-python3-3.10.12/bin/python3.10: can't open file '/Users/n8henrie/git/nixpkgs/setup.py': [Errno 2] No such file or directory
CMake Error: The source directory "/Users/n8henrie/git/nixpkgs/build" does not exist.
Specify --help for usage, or press the help button on the CMake GUI.
no Makefile or custom buildPhase, doing nothing
bash: pushd: dist: No such file or directory
Bad wheel filename 'torch-2.0.1*.whl'
sed: can't read unpacked/torch-2.0.1/torch-2.0.1.dist-info/METADATA: No such file or directory
Traceback (most recent call last):
  File "/nix/store/bq1q4gk52gsx4fg4pf07f2kxqgazkcls-python3-3.10.12/lib/python3.10/runpy.py", line 196, in _run_module_as_main
    return _run_code(code, main_globals, None,
  File "/nix/store/bq1q4gk52gsx4fg4pf07f2kxqgazkcls-python3-3.10.12/lib/python3.10/runpy.py", line 86, in _run_code
    exec(code, run_globals)
  File "/nix/store/gdh5vg1j8b4qmri26hzl520asq9j3h8a-python3.10-wheel-0.38.4/lib/python3.10/site-packages/wheel/__main__.py", line 23, in <module>
    sys.exit(main())
  File "/nix/store/gdh5vg1j8b4qmri26hzl520asq9j3h8a-python3.10-wheel-0.38.4/lib/python3.10/site-packages/wheel/__main__.py", line 19, in main
    sys.exit(wheel.cli.main())
  File "/nix/store/gdh5vg1j8b4qmri26hzl520asq9j3h8a-python3.10-wheel-0.38.4/lib/python3.10/site-packages/wheel/cli/__init__.py", line 91, in main
    args.func(args)
  File "/nix/store/gdh5vg1j8b4qmri26hzl520asq9j3h8a-python3.10-wheel-0.38.4/lib/python3.10/site-packages/wheel/cli/__init__.py", line 25, in pack_f
    pack(args.directory, args.dest_dir, args.build_number)
  File "/nix/store/gdh5vg1j8b4qmri26hzl520asq9j3h8a-python3.10-wheel-0.38.4/lib/python3.10/site-packages/wheel/cli/pack.py", line 25, in pack
    for fn in os.listdir(directory)
FileNotFoundError: [Errno 2] No such file or directory: 'unpacked/torch-2.0.1'
bash: popd: directory stack empty
```

Huh, a bunch of errors there.

`unpackPhase` seems to create a directory `./source`. My guess is that we're
supposed to `cd` here at some point. Sure enough, looking at the end of
`genericBuild`, we see:

```console
if [ "$curPhase" = unpackPhase ]; then
    [ -z "${sourceRoot}" ] || chmod +x "${sourceRoot}";
    cd "${sourceRoot:-.}";
fi;
```

So let's try again:

```console
$ declare -p sourceRoot
declare -- sourceRoot="source"
$ cd $sourceRoot
$ buildPhase
```

After which we see lots of build output, ending in a few errors:

```
-- Build files have been written to: /Users/n8henrie/git/nixpkgs/source/build
make[1]: Entering directory '/Users/n8henrie/git/nixpkgs/source/build'
make[1]: *** No targets specified and no makefile found.  Stop.
make[1]: Leaving directory '/Users/n8henrie/git/nixpkgs/source/build'
make: *** [Makefile:6: all] Error 2
bash: pushd: dist: No such file or directory
Bad wheel filename 'torch-2.0.1*.whl'
sed: can't read unpacked/torch-2.0.1/torch-2.0.1.dist-info/METADATA: No such file or directory
Traceback (most recent call last):
  File "/nix/store/bq1q4gk52gsx4fg4pf07f2kxqgazkcls-python3-3.10.12/lib/python3.10/runpy.py", line 196, in _run_module_as_main
    return _run_code(code, main_globals, None,
  File "/nix/store/bq1q4gk52gsx4fg4pf07f2kxqgazkcls-python3-3.10.12/lib/python3.10/runpy.py", line 86, in _run_code
    exec(code, run_globals)
  File "/nix/store/gdh5vg1j8b4qmri26hzl520asq9j3h8a-python3.10-wheel-0.38.4/lib/python3.10/site-packages/wheel/__main__.py", line 23, in <module>
    sys.exit(main())
  File "/nix/store/gdh5vg1j8b4qmri26hzl520asq9j3h8a-python3.10-wheel-0.38.4/lib/python3.10/site-packages/wheel/__main__.py", line 19, in main
    sys.exit(wheel.cli.main())
  File "/nix/store/gdh5vg1j8b4qmri26hzl520asq9j3h8a-python3.10-wheel-0.38.4/lib/python3.10/site-packages/wheel/cli/__init__.py", line 91, in main
    args.func(args)
  File "/nix/store/gdh5vg1j8b4qmri26hzl520asq9j3h8a-python3.10-wheel-0.38.4/lib/python3.10/site-packages/wheel/cli/__init__.py", line 25, in pack_f
    pack(args.directory, args.dest_dir, args.build_number)
  File "/nix/store/gdh5vg1j8b4qmri26hzl520asq9j3h8a-python3.10-wheel-0.38.4/lib/python3.10/site-packages/wheel/cli/pack.py", line 25, in pack
    for fn in os.listdir(directory)
FileNotFoundError: [Errno 2] No such file or directory: 'unpacked/torch-2.0.1'
bash: popd: directory stack empty
$
```

Huh. Let's dig deeper.

```console
$ declare -p buildPhase
declare -- buildPhase="setuptoolsBuildPhase"
$ declare -f setuptoolsBuildPhase
setuptoolsBuildPhase ()
{
    echo "Executing setuptoolsBuildPhase";
    local args;
    runHook preBuild;
    cp -f /nix/store/fscd8f71wmpwphcmi5mx8qnif2402x9m-run_setup.py nix_run_setup;
    args="";
    if [ -n "$setupPyGlobalFlags" ]; then
        args+="$setupPyGlobalFlags";
    fi;
    if [ -n "$enableParallelBuilding" ]; then
        setupPyBuildFlags+=" --parallel $NIX_BUILD_CORES";
    fi;
    if [ -n "$setupPyBuildFlags" ]; then
        args+=" build_ext $setupPyBuildFlags";
    fi;
    eval "/nix/store/bq1q4gk52gsx4fg4pf07f2kxqgazkcls-python3-3.10.12/bin/python3.10 nix_run_setup $args bdist_wheel";
    runHook postBuild;
    echo "Finished executing setuptoolsBuildPhase"
}
$ cd $sourceRoot
$ setuptoolsBuildPhase
$ # this fails with the same error, obviously
```

Bummer. Digging into this a bit, it looks like `nix develop` may just not be
[quite ready for primetime](https://github.com/NixOS/nix/issues/7265) with some
differences in behavior compared to `nix-shell`.

Further, reading in [this issue][2], it looks like sometimes a particular phase
may be a variable and other times a function, sometimes with one overriding the
other. This means that running `buildPhase` and `eval  "$buildPhase"` may
produce totally different results, which is why [the manual suggests][3]
running these interactively as `eval "${buildPhase:-buildPhase}"`.

I had to run an example to wrap my head around this:

```console
$ # define a variable `foo`
$ foo='echo bar'
$ # define a function `foo`
$ foo() { echo baz; }
$ # `type` calls `foo` a function -- is this just because it was defined last?
$ type -t foo
function
$ # `eval` seems to run the variable, as if we had run `$ "${foo}"` or `$ $foo`
$ eval "${foo:-foo}"
bar
$ # plain `foo` runs the function
$ foo
baz
$ foo='echo bar'
$ type -t foo
function
$ asdf() { echo asdfasdf; }
$ eval "${asdf:-asdf}"
asdfasdf
$ declare | grep '^foo'
foo='echo bar'
foo ()
```

I'm a little embarrassed that it wasn't immediately obvious to me, but clearly
`eval "${foo:-foo}"` means "run the variable if it's defined, otherwise run the
function," so the variable should take priority if present.

Going back to our nix-shell, we can see which functions seem to be overridden:

```console
$ declare | grep -o '^\w[^= ]\+' | sort | uniq -d
buildPhase
checkPhase
installCheckPhase
installPhase
```

So it looks like `buildPhase` should be our first phase that we need to `echo
$buildPhase"` to see in this case; e.g. `type checkPhase` should work for the
preceding phases. Unfortunately, this doesn't solve our issue, as manually
running each phase as `eval "${thePhase:-thePhase}"` also fails.

Looking closer at the errors, there are several errors about protobuf paths:

```plaintext
source/third_party/protobuf/src/google/protobuf/implicit_weak_message.cc:31:10: fatal error: 'google/protobuf/implicit_weak_message.h' file not found
#include <google/protobuf/implicit_weak_message.h>
```

The file exists:

```console
$ find . -name implicit_weak_message.h
./third_party/protobuf/src/google/protobuf/implicit_weak_message.h
```

Interestingly, it looks like `nix-shell` *also* fails if I run from this `bash
--norc` environment:

```console
$ nix-shell --pure \
    -I nixpkgs=https://github.com/nixos/nixpkgs/archive/nixpkgs-unstable.tar.gz \
    -A python310Packages.pytorch \
    '<nixpkgs>' \
    --command 'bash --norc'
```

I'm not sure what to make of this, other than that there may be some impurities
in this derivation that are requiring paths or environment variables outside
the nix store?

Let's try cleaning the `nix develop` environment's `PATH` of all non-`/nix`
elements:

```console
$ nix develop ~/git/nixpkgs#python310Packages.pytorch
$ # prints path delimited by linebreak instead of :
$ printf "${PATH//:/'\n'}\n"
$ export PATH=$(awk -v RS=: -v ORS=: '$0 ~ /^\/nix\/.*/' <<<"$PATH")
$ # verify it worked
$ printf "${PATH//:/'\n'}\n"
$ genericBuild
$ ls ../outputs/dist/
torch-2.0.1-cp310-cp310-macosx_11_0_arm64.whl
```

Huh, so getting rid of the non-nix paths allowed it to succeed. Let's try with
the `--ignore-environment` flag:

```console
$ nix develop -i ~/git/nixpkgs#python310Packages.pytorch
$ export PATH=$(awk -v RS=: -v ORS=: '$0 ~ /^\/nix\/.*/' <<<"$PATH")
$ genericBuild
$ ls ../outputs/dist/
torch-2.0.1-cp310-cp310-macosx_11_0_arm64.whl
```

Sure enough that also works. I don't know why building fails with `bash
--norc`.

I *think* that removing the non-`/nix` paths allows it to succeed because it
finds `xcrun` at `/usr/bin/xcrun`, which points it to the system MacOS SDK:

```console
$ xcrun --sdk macosx --show-sdk-path
/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX13.3.sdk
```

where it finds the `MetalPerformanceShaders` framework and tries to enable
`MPS` (one can see `USE_MPS` is enabled in the build logs). However, this
framework (which seems to lives within nixpkgs at
`nixpkgs#darwin.apple_sdk.frameworks`) isn't passed into the derivation, so it
fails with `ld: framework not found MetalPerformanceShaders`.

Let's try patching nixpkgs to pass in this framework:

```diff
diff --git a/pkgs/development/python-modules/torch/default.nix b/pkgs/development/python-modules/torch/default.nix
index 912628bf9497..eb452442201d 100644
--- a/pkgs/development/python-modules/torch/default.nix
+++ b/pkgs/development/python-modules/torch/default.nix
@@ -10,7 +10,7 @@

   # Build inputs
   numactl,
-  Accelerate, CoreServices, libobjc,
+  Accelerate, CoreServices, MetalPerformanceShaders, libobjc,

   # Propagated build inputs
   filelock,
@@ -27,6 +27,9 @@
   # this is also what official pytorch build does
   mklDnnSupport ? !(stdenv.isDarwin && stdenv.isAarch64),

+  # Use MPS on M1 machines
+  mpsSupport ? (stdenv.isDarwin && stdenv.isAarch64),
+
   # virtual pkg that consistently instantiates blas across nixpkgs
   # See https://github.com/NixOS/nixpkgs/pull/83888
   blas,
@@ -294,7 +297,8 @@ in buildPythonPackage rec {
     ++ lib.optionals rocmSupport [ openmp ]
     ++ lib.optionals (cudaSupport || rocmSupport) [ magma ]
     ++ lib.optionals stdenv.isLinux [ numactl ]
-    ++ lib.optionals stdenv.isDarwin [ Accelerate CoreServices libobjc ];
+    ++ lib.optionals stdenv.isDarwin [ Accelerate CoreServices libobjc ]
+    ++ lib.optionals mpsSupport [ MetalPerformanceShaders ];

   propagatedBuildInputs = [
     cffi
diff --git a/pkgs/top-level/python-packages.nix b/pkgs/top-level/python-packages.nix
index 088b79d86c37..1b91ef99a445 100644
--- a/pkgs/top-level/python-packages.nix
+++ b/pkgs/top-level/python-packages.nix
@@ -12681,7 +12681,7 @@ self: super: with self; {
       if pkgs.config.cudaSupport
       then pkgs.magma-cuda-static
       else pkgs.magma;
-    inherit (pkgs.darwin.apple_sdk.frameworks) Accelerate CoreServices;
+    inherit (pkgs.darwin.apple_sdk.frameworks) Accelerate CoreServices MetalPerformanceShaders;
     inherit (pkgs.darwin) libobjc;
     inherit (pkgs.llvmPackages_rocm) openmp;
   };
```

With this patch, the build succeeds, but MPS is still not present:

```console
$ nix develop -i ~/git/nixpkgs#python310Packages.pytorch
$ export PATH=$(awk -v RS=: -v ORS=: '$0 ~ /^\/nix\/.*/' <<<"$PATH")
$ genericBuild
$ # ... build succeeds ...
$ ls ../outputs/dist
torch-2.0.1-cp310-cp310-macosx_11_0_arm64.whl
```

It would save a lot of time to figure out how to run the phases independently
so that I can avoid needing to e.g. download / unpack the source code
repeatedly (which requires replaying any modifications repeatedly). Reading
`nix develop --help`, it seemed like I should be able to take advantage of
built-in flags to run the appropriate phase, for example starting with `nix
develop --unpack ~/git/nixpkgs#python310Packages.torch`. I struggled with this
for a day or two because i kept trying to run this from a clean working
directory (first running `cd $(mktemp -d)`) and ran into weird errors that
referenced the code code's root directory (at `~/git/nixpkgs` in this case).
Reading the `nix develop` manpage didn't help much.

I eventually figured out a few gotchas that -- to me -- were nonobvious:
- that these commands should be run from the flake's root directory, which in
  this case is the `nixpkgs` repo, which I've cloned to `~/git/nixpkgs`
- runnning `unpackPhase` twice in a row fails because `./source` (and maybe
  `./outputs`) already exists
- running with a specified phase does **not** drop you into a nix environment
  for subsequent commands (such as manually running `genericBuild`)
    - `nix develop ~/git/nixpkgs#python310Packages.torch` followed by `echo
      $IN_NIX_SHELL` prints `impure`
    - `nix develop --configure ~/git/nixpkgs#python310Packages.torch` doesn't
      print anything
    - the same is true for e.g. `nix develop
      ~/git/nixpkgs#python310Packages.torch --command bash -c 'echo
      $IN_NIX_SHELL'`, which prints `impure` when the command is run, but
      if run a second time the result is empty, shows that you are not left in
      that environment after the `nix develop` command completes
- running `nix develop -i ~/git/nixpkgs#python3Packages.pytorch --unpack` from
  *any* directory creates `source` at `~/git/nixpkgs/source`, **not** in the
  current directory
    - this really confused me, as the command leaves you in your current
      directory, so unless you're in the root directory, `./source` never
      appears in your current working directory, but running the command twice
      fails with an error suggesting that it exists

Demonstrating the last point, and how behavior differs between entering the
develop environment and manually running `unpackPhase` vs using flags like
`--unpack`:

```console
$ # Go to a clean temporary directory
$ cd $(mktemp -d)
$ ls -ld ./source ~/git/nixpkgs/source
ls: cannot access './source': No such file or directory
ls: cannot access '/Users/n8henrie/git/nixpkgs/source': No such file or directory
$ nix develop -i ~/git/nixpkgs#python3Packages.pytorch
$ ls -ld ./source ~/git/nixpkgs/source
ls: cannot access './source': No such file or directory
ls: cannot access '/Users/n8henrie/git/nixpkgs/source': No such file or directory
$ eval "${unpackPhase:-unpackPhase}"
$ # source is unpacked to PWD, not to ~/git/nixpkgs
$ ls -ld ./source ~/git/nixpkgs/source
ls: cannot access '/Users/n8henrie/git/nixpkgs/source': No such file or directory
drwxr-xr-x 80 n8henrie staff 2560 Jan  2  1980 ./source
```

contrast that with:

```console
$ # Go to a clean temporary directory
$ cd $(mktemp -d)
$ ls -ld ./source ~/git/nixpkgs/source
ls: cannot access './source': No such file or directory
ls: cannot access '/Users/n8henrie/git/nixpkgs/source': No such file or directory
$ nix develop -i ~/git/nixpkgs#python3Packages.pytorch --unpack
$ ls -ld ./source ~/git/nixpkgs/source
ls: cannot access './source': No such file or directory
drwxr-xr-x 80 n8henrie staff 2560 Jan  2  1980 /Users/n8henrie/git/nixpkgs/source
```

Keep in mind, this means that with the former approach, one can change to a
clean workdir and repeat the exact same steps without error, but with the
second approach, you'll get an error if you don't first remove
`~/git/nixpkgs/source`:

```console
$ cd "$(mktemp -d)"
$ ls
$ nix develop -i ~/git/nixpkgs#python3Packages.pytorch --unpack
Executing setuptoolsShellHook
Finished executing setuptoolsShellHook
unpacking source archive /nix/store/dxqxfw4r00s0v033w7yam3bkblynrad7-source
Cannot copy /nix/store/dxqxfw4r00s0v033w7yam3bkblynrad7-source to source: destination already exists!
Did you specify two "srcs" with the same "name"?
do not know how to unpack source archive /nix/store/dxqxfw4r00s0v033w7yam3bkblynrad7-source
```

Note that the error above doesn't mention anything about `~/git/nixpkgs`, which
threw me off.

Other notes worth mentioning:
- the phases are *not* already defined within the context of `--command` (with
  or without `-i`), so one needs to `source $stdenv/setup` to get much done
- `--command` runs within the context of the current working directory (not the
  flake root)

```console
$ cd "$(mktemp -d)"
$ ls
$ nix develop ~/git/nixpkgs#python3Packages.pytorch \
    --command bash -c 'eval "${unpackPhase:-unpackPhase}"'
Executing setuptoolsShellHook
Finished executing setuptoolsShellHook
bash: line 1: unpackPhase: command not found
$ nix develop ~/git/nixpkgs#python3Packages.pytorch --command bash -c '
    source $stdenv/setup
    eval "${unpackPhase:-unpackPhase}"
'
Executing setuptoolsShellHook
Finished executing setuptoolsShellHook
Sourcing python-remove-tests-dir-hook
Sourcing python-catch-conflicts-hook.sh
Sourcing python-remove-bin-bytecode-hook.sh
Sourcing setuptools-build-hook
Using setuptoolsBuildPhase
Using setuptoolsShellHook
Sourcing pip-install-hook
Using pipInstallPhase
Sourcing python-imports-check-hook.sh
Using pythonImportsCheckPhase
Sourcing python-namespaces-hook
Sourcing python-catch-conflicts-hook.sh
unpacking source archive /nix/store/dxqxfw4r00s0v033w7yam3bkblynrad7-source
source root is source
setting SOURCE_DATE_EPOCH to timestamp 315619200 of file source/version.txt
$ ls
source
```

- commands like `--configure` don't seem to respect overridden phases (such as a
custom `configurePhase`) and run their phase within the context of the flake's
root directory. For example, I manually added to the torch derivation:
`configurePhase = ''echo "I am in configure!"; ls -l'';`. With that change:

```console
$ cd "$(mktemp -d)"
$ nix develop -i ~/git/nixpkgs#python310Packages.torch --configure
Executing setuptoolsShellHook
Finished executing setuptoolsShellHook
no configure script, doing nothing
$ # Add a fake executable named `./configure`:
$ touch ~/git/nixpkgs/configure
$ chmod +x !$
$ nix develop -i ~/git/nixpkgs#python310Packages.torch --configure
Executing setuptoolsShellHook
Finished executing setuptoolsShellHook
configure flags: --prefix=/private/var/folders/kb/tw_lp_xd2_bbv0hqk4m0bvt80000gn/T/tmp.aZbb96cCot/outputs/out --bindir=/private/var/folders/kb/tw_lp_xd2_bbv0hqk4m0bvt80000gn/T/tmp.aZbb96cCot/outputs/out/bin --sbindir=/private/var/folders/kb/tw_lp_xd2_bbv0hqk4m0bvt80000gn/T/tmp.aZbb96cCot/outputs/out/sbin --includedir=/private/var/folders/kb/tw_lp_xd2_bbv0hqk4m0bvt80000gn/T/tmp.aZbb96cCot/outputs/dev/include --oldincludedir=/private/var/folders/kb/tw_lp_xd2_bbv0hqk4m0bvt80000gn/T/tmp.aZbb96cCot/outputs/dev/include --mandir=/private/var/folders/kb/tw_lp_xd2_bbv0hqk4m0bvt80000gn/T/tmp.aZbb96cCot/outputs/out/share/man --infodir=/private/var/folders/kb/tw_lp_xd2_bbv0hqk4m0bvt80000gn/T/tmp.aZbb96cCot/outputs/out/share/info --docdir=/private/var/folders/kb/tw_lp_xd2_bbv0hqk4m0bvt80000gn/T/tmp.aZbb96cCot/outputs/out/share/doc/python3.10-torch --libdir=/private/var/folders/kb/tw_lp_xd2_bbv0hqk4m0bvt80000gn/T/tmp.aZbb96cCot/outputs/lib/lib --libexecdir=/private/var/folders/kb/tw_lp_xd2_bbv0hqk4m0bvt80000gn/T/tmp.aZbb96cCot/outputs/lib/libexec --localedir=/private/var/folders/kb/tw_lp_xd2_bbv0hqk4m0bvt80000gn/T/tmp.aZbb96cCot/outputs/lib/share/locale
$
$ nix develop -i ~/git/nixpkgs#python310Packages.torch \
    --command bash -c '
        source $stdenv/setup
        eval "${configurePhase:-configurePhase}"
    '
Executing setuptoolsShellHook
Finished executing setuptoolsShellHook
Sourcing python-remove-tests-dir-hook
Sourcing python-catch-conflicts-hook.sh
Sourcing python-remove-bin-bytecode-hook.sh
Sourcing setuptools-build-hook
Using setuptoolsBuildPhase
Using setuptoolsShellHook
Sourcing pip-install-hook
Using pipInstallPhase
Sourcing python-imports-check-hook.sh
Using pythonImportsCheckPhase
Sourcing python-namespaces-hook
Sourcing python-catch-conflicts-hook.sh
I am in configure!
total 0
```

So I'm not exactly sure how `nix develop ... --configure` is supposed to work,
since it seems to look for `./configure` at `~/git/nixpkgs/configure`, while it
seems that `--unpack` is going to put it at `~/git/nixpkgs/source/configure`,
and `unpackPhase` puts it at `$PWD/source/configure`.

Perhaps the most reliable approach is just to run the following:

```console
$ nix develop -i ~/git/nixpkgs#python310Packages.torch \
    --command bash -c '
        source $stdenv/setup
        eval "${unpackPhase:-unpackPhase}"
        cd $sourceRoot
        eval "${patchPhase:-patchPhase}"
        eval "${configurePhase:-configurePhase}"
    '
Executing setuptoolsShellHook
Finished executing setuptoolsShellHook
Sourcing python-remove-tests-dir-hook
Sourcing python-catch-conflicts-hook.sh
Sourcing python-remove-bin-bytecode-hook.sh
Sourcing setuptools-build-hook
Using setuptoolsBuildPhase
Using setuptoolsShellHook
Sourcing pip-install-hook
Using pipInstallPhase
Sourcing python-imports-check-hook.sh
Using pythonImportsCheckPhase
Sourcing python-namespaces-hook
Sourcing python-catch-conflicts-hook.sh
unpacking source archive /nix/store/dxqxfw4r00s0v033w7yam3bkblynrad7-source
source root is source
setting SOURCE_DATE_EPOCH to timestamp 315619200 of file source/version.txt
I am in configure!
total 612
-rw-r--r--   1 n8henrie staff  4103 Jan  2  1980 BUCK.oss
-rw-r--r--   1 n8henrie staff 64723 Jan  2  1980 BUILD.bazel
$ # ... lots of other files, truncated...
```

Ok, so I think we're back in business, realizing that we should probably either
work from the rootdir of the repo in question or manually `cd` there
beforehand. Note that we can't necessarily `cd $sourceRoot` in the context of
our `--command`, because in this case `sourceRoot` is defined somewhere during
`unpackPhase`, so if we're not running that phase, `sourceRoot` is undefined.

Let's start again, from the beginning:

```console
$ nix develop -i ~/git/nixpkgs#python310Packages.torch \
    --command bash -c '
        source $stdenv/setup
        eval "${unpackPhase:-unpackPhase}"
        cd $sourceRoot
        eval "${patchPhase:-patchPhase}"
    '
Executing setuptoolsShellHook
Finished executing setuptoolsShellHook
Sourcing python-remove-tests-dir-hook
Sourcing python-catch-conflicts-hook.sh
Sourcing python-remove-bin-bytecode-hook.sh
Sourcing setuptools-build-hook
Using setuptoolsBuildPhase
Using setuptoolsShellHook
Sourcing pip-install-hook
Using pipInstallPhase
Sourcing python-imports-check-hook.sh
Using pythonImportsCheckPhase
Sourcing python-namespaces-hook
Sourcing python-catch-conflicts-hook.sh
unpacking source archive /nix/store/dxqxfw4r00s0v033w7yam3bkblynrad7-source
```

Cool, so far so good.

```console
$ cd source
$ nix develop -i ~/git/nixpkgs#python310Packages.torch \
    --command bash -c '
        source $stdenv/setup
        eval "${configurePhase:-configurePhase}"
    '
Checking if build backend supports build_editable ... done
Preparing editable metadata (pyproject.toml) ... |
```

This seems to hang here indefinitely. SMH. Adding `export sourceRoot=.` doesn't
help, nor does re-running `patchPhase`. Adding `eval
"${unpackPhase:-unpackPhase}"` works, which is a pain since that's what I'm
trying to avoid running over and over again.

For whatever reason `export sourceRoot=source` works (and running from the
parent directory):

```console
$ ls -ld ./source
drwxr-xr-x 82 n8henrie staff 2624 Aug 18 11:03 ./source
$ nix develop ~/git/nixpkgs#python310Packages.torch     --command bash -c '
        source $stdenv/setup
        export sourceRoot=source
        eval "${patchPhase:-patchPhase}"
        eval "${configurePhase:-configurePhase}"
    '
Executing setuptoolsShellHook
Finished executing setuptoolsShellHook
Sourcing python-remove-tests-dir-hook
Sourcing python-catch-conflicts-hook.sh
Sourcing python-remove-bin-bytecode-hook.sh
Sourcing setuptools-build-hook
Using setuptoolsBuildPhase
Using setuptoolsShellHook
Sourcing pip-install-hook
Using pipInstallPhase
Sourcing python-imports-check-hook.sh
Using pythonImportsCheckPhase
Sourcing python-namespaces-hook
Sourcing python-catch-conflicts-hook.sh
no configure script, doing nothing
```

Phew, finally on to the buildphase!

```console
$ nix develop ~/git/nixpkgs#python310Packages.torch     --command bash -c '
        source $stdenv/setup
        export sourceRoot=source
        eval "${buildPhase:-buildPhase}"
    '
...
FileNotFoundError: [Errno 2] No such file or directory: 'setup.py'
...
```

Huh, so this expects to already be in `source`. Let's try again:

```console
$ cd source
nix develop ~/git/nixpkgs#python310Packages.torch     --command bash -c '
    source $stdenv/setup
    export sourceRoot=source
    eval "${buildPhase:-buildPhase}"
'
Preparing editable metadata (pyproject.toml) ... -
```

This hangs indefinitely at this step again. I am so frustrated. Leaving
`sourceRoot` undefined or `export sourceRoot=.` hangs at the same place. Going
through the `PATH` fixes from above and using `-i` make no difference.

However, if I both export `sourceRoot` *and* `cd` there, we make progress
(meaning I probably should go back and rerun `patchPhase` and `configurePhase`,
since they would have run in the wrong directory):


```console
$ nix develop -i ~/git/nixpkgs#python310Packages.torch \
    --command bash -c '
        source $stdenv/setup
        export sourceRoot=source
        cd $sourceRoot
        eval "${patchPhase:-patchPhase}"
        eval "${configurePhase:-configurePhase}"
    '
Executing setuptoolsShellHook
Finished executing setuptoolsShellHook
Sourcing python-remove-tests-dir-hook
Sourcing python-catch-conflicts-hook.sh
Sourcing python-remove-bin-bytecode-hook.sh
Sourcing setuptools-build-hook
Using setuptoolsBuildPhase
Using setuptoolsShellHook
Sourcing pip-install-hook
Using pipInstallPhase
Sourcing python-imports-check-hook.sh
Using pythonImportsCheckPhase
Sourcing python-namespaces-hook
Sourcing python-catch-conflicts-hook.sh
no configure script, doing nothing
$
$
$ nix develop -i ~/git/nixpkgs#python310Packages.torch \
    --command bash -c '
        source $stdenv/setup
        export sourceRoot=source
        cd $sourceRoot
        eval "${buildPhase:-buildPhase}"
    '
... tries to build...
fatal error: 'google/protobuf/any.h' file not found
#include <google/protobuf/any.h>
... and many other similar errors ..
```

Oh man, not this again. Running without `-i` makes no difference.

Maybe the `PATH` workaround (note the extra `'` escaping)?

```console
$ nix develop -i ~/git/nixpkgs#python310Packages.torch \
    --command bash -c $'
        export PATH=$(awk -v RS=: -v ORS=: \'$0 ~ /^\/nix\/.*/\' <<<"$PATH")
        source $stdenv/setup
        export sourceRoot=source
        cd $sourceRoot
        eval "${buildPhase:-buildPhase}"
    '
...
fatal error: 'google/protobuf/any.h' file not found
#include <google/protobuf/any.h>
```

What is going on here?!

```console
$ rm -rf ./source ./outputs
$ nix develop -i ~/git/nixpkgs#python310Packages.torch \
    --command bash -c $'
        export PATH=$(awk -v RS=: -v ORS=: \'$0 ~ /^\/nix\/.*/\' <<<"$PATH")
        source $stdenv/setup
        eval "${unpackPhase:-unpackPhase}"
        cd $sourceRoot
        eval "${patchPhase:-patchPhase}"
        eval "${configurePhase:-configurePhase}"
        eval "${buildPhase:-buildPhase}"
    '
fatal error: 'google/protobuf/any.h' file not found
#include <google/protobuf/any.h>
```

Huh. So still stuck at the same error from *way* up above (which was like a
week ago now). Running interactively worked before, so I guess we'll do that.

```console
$ nix develop -i ~/git/nixpkgs#python310Packages.torch
$ export PATH=$(awk -v RS=: -v ORS=: '$0 ~ /^\/nix\/.*/' <<<"$PATH")
$ source $stdenv/setup
$ export sourceRoot=source
$ cd source
$ eval "${buildPhase:-buildPhase}"
fatal error: 'google/protobuf/any.h' file not found
#include <google/protobuf/any.h>
```

How about without `-i`?

```console
$ nix develop ~/git/nixpkgs#python310Packages.torch
$ export PATH=$(awk -v RS=: -v ORS=: '$0 ~ /^\/nix\/.*/' <<<"$PATH")
$ source $stdenv/setup
$ export sourceRoot=source
$ cd source
$ eval "${buildPhase:-buildPhase}"
fatal error: 'google/protobuf/any.h' file not found
#include <google/protobuf/any.h>
```

How about manually walking through everything, no `PATH` manipulation, and no
`-i`?

```console
$ cd "$(mktemp -d)"
$ nix develop ~/git/nixpkgs#python310Packages.torch
$ source $stdenv/setup
Sourcing python-remove-tests-dir-hook
Sourcing python-catch-conflicts-hook.sh
Sourcing python-remove-bin-bytecode-hook.sh
Sourcing setuptools-build-hook
Sourcing pip-install-hook
Sourcing python-imports-check-hook.sh
Using pythonImportsCheckPhase
Sourcing python-namespaces-hook
Sourcing python-catch-conflicts-hook.sh
$ eval "${unpackPhase:-unpackPhase}"
unpacking source archive /nix/store/dxqxfw4r00s0v033w7yam3bkblynrad7-source
source root is source
setting SOURCE_DATE_EPOCH to timestamp 315619200 of file source/version.txt
$ cd $sourceRoot
$ eval "${patchPhase:-patchPhase}"
$ eval "${configurePhase:-configurePhase}"
no configure script, doing nothing
$ eval "${buildPhase:-buildPhase}"
fatal error: 'google/protobuf/any.h' file not found
#include <google/protobuf/any.h>
```

Trying the same approach in `~/git/nixpkgs` gives the same `file not found`
error. We showed above that `genericBuild` runs *without* this error. What is
`genericBuild` doing that I'm missing?

```console
$ echo $genericBuild
$ # empty output -- it is not defined as a variable, just a function
$ type genericBuild
genericBuild is a function
genericBuild ()
{
    export GZIP_NO_TIMESTAMPS=1;
    if [ -f "${buildCommandPath:-}" ]; then
        source "$buildCommandPath";
        return;
    fi;
    if [ -n "${buildCommand:-}" ]; then
        eval "$buildCommand";
        return;
    fi;
    if [ -z "${phases[*]:-}" ]; then
        phases="${prePhases[*]:-} unpackPhase patchPhase ${preConfigurePhases[*]:-}             configurePhase ${preBuildPhases[*]:-} buildPhase checkPhase             ${preInstallPhases[*]:-} installPhase ${preFixupPhases[*]:-} fixupPhase installCheckPhase             ${preDistPhases[*]:-} distPhase ${postPhases[*]:-}";
    fi;
    for curPhase in ${phases[*]};
    do
        if [[ "$curPhase" = unpackPhase && -n "${dontUnpack:-}" ]]; then
            continue;
        fi;
        if [[ "$curPhase" = patchPhase && -n "${dontPatch:-}" ]]; then
            continue;
        fi;
        if [[ "$curPhase" = configurePhase && -n "${dontConfigure:-}" ]]; then
            continue;
        fi;
        if [[ "$curPhase" = buildPhase && -n "${dontBuild:-}" ]]; then
            continue;
        fi;
        if [[ "$curPhase" = checkPhase && -z "${doCheck:-}" ]]; then
            continue;
        fi;
        if [[ "$curPhase" = installPhase && -n "${dontInstall:-}" ]]; then
            continue;
        fi;
        if [[ "$curPhase" = fixupPhase && -n "${dontFixup:-}" ]]; then
            continue;
        fi;
        if [[ "$curPhase" = installCheckPhase && -z "${doInstallCheck:-}" ]]; then
            continue;
        fi;
        if [[ "$curPhase" = distPhase && -z "${doDist:-}" ]]; then
            continue;
        fi;
        if [[ -n $NIX_LOG_FD ]]; then
            echo "@nix { \"action\": \"setPhase\", \"phase\": \"$curPhase\" }" >&"$NIX_LOG_FD";
        fi;
        showPhaseHeader "$curPhase";
        dumpVars;
        local startTime=$(date +"%s");
        eval "${!curPhase:-$curPhase}";
        local endTime=$(date +"%s");
        showPhaseFooter "$curPhase" "$startTime" "$endTime";
        if [ "$curPhase" = unpackPhase ]; then
            [ -z "${sourceRoot}" ] || chmod +x "${sourceRoot}";
            cd "${sourceRoot:-.}";
        fi;
    done
}
```

It looks like the `buildCommand` stuff can be ignored, and phases are not
overridden:

```console
$ declare | grep -e '^buildCommand' -e '^phases'
```

Going through the default phases, it looks like we might be missing a few!

```console
$ declare | grep '^preConfigurePhase'
preConfigurePhases=' updateAutotoolsGnuConfigScriptsPhase'
```

Let's see if we can find all the defined phases:

```console
$ type genericBuild | awk -F= '/phases=/ { print $2 }' | awk -v RS=' +' '{ gsub(/[^[:alnum:]]/, ""); print}' | sort -u
buildPhase
checkPhase
configurePhase
distPhase
fixupPhase
installCheckPhase
installPhase
patchPhase
postPhases
preBuildPhases
preConfigurePhases
preDistPhases
preFixupPhases
preInstallPhases
prePhases
unpackPhase
$ phasenames=($(!!))
$ echo "${#phasenames[@]}"
16
$ echo "${phasenames[0]}"
buildPhase
$ for pn in "${phasenames[@]}"; do declare | grep -o "^${pn}"; done | sort -u
buildPhase
checkPhase
configurePhase
distPhase
fixupPhase
installCheckPhase
installPhase
patchPhase
preConfigurePhases
preDistPhases
preFixupPhases
unpackPhase
```

Wow, it looks like there are a *lot* of phases that are defined, but which we
haven't been using. So perhaps instead of trying to run all of these manually,
if our goal is to avoid unpacking the source every time, we should take
advantage of the `dontUnpack` variable, which is checked prior to running that
phase.

```console
$ nix develop .#python310Packages.torch
$ # source already exists:
$ ls -ld ./source
drwxr-xr-x 82 n8henrie staff 2624 Aug 18 12:23 ./source
$ dontUnpack=1
$ genericBuild
FileNotFoundError: [Errno 2] No such file or directory: 'setup.py'
```

Ah, I keep forgetting about `sourceRoot` being defined in `unpackPhase`.

```
$ nix develop .#python310Packages.torch
$ cd source
$ dontUnpack=1
$ genericBuild
$ # building proceeds
```

Hooray!

However, in the output we can see `sdk version: 13.3` -- which means it's using
my local system's SDK, since that SDK version doesn't exist in nixpkgs yet:

```console
$ nix eval --json --apply 'builtins.attrNames' nixpkgs#darwin |
    jq -r '.[] | select(contains("sdk"))'
apple_sdk
apple_sdk_10_12
apple_sdk_11_0
```

Running with `-i` gives me the same result, so I probably need to clean my
path. Maybe I can try again with the `--norc` approach, now that the `phases`
issue has been figured out?

```console
$ nix develop -i .#python310Packages.torch --command bash --norc
$ source $stdenv/setup
$ cd source
$ dontUnpack=1
$ genericBuild
fatal error: 'google/protobuf/any.h' file not found
#include <google/protobuf/any.h>
```

Nope, I guess not.

```console
$ nix develop -i .#python310Packages.torch
$ export PATH=$(awk -v RS=: -v ORS=: '$0 ~ /^\/nix\/.*/' <<<"$PATH")
$ cd source
$ dontUnpack=1
$ genericBuild
...
-- MPS: unable to get MacOS sdk version
...
```

Huh, looking through the `nix develop` source, I found a new command: `nix
print-dev-env`. Looks handy, seems like it should let you redirect the build
environment to a file which you can then source in a regular shell.

Well, having exhausted all the troubleshooting steps I could come up with, I
[started a thread on the NixOS
discourse](https://discourse.nixos.org/t/nix-develop-fails-with-command-bash-norc),
and so far nobody has pointed out an obvious mistake in my approach.

For the moment, this seems to work for a rebuild without repeating the "get the
source code" step.

```console
$ nix develop -i ~/git/nixpkgs#python310Packages.torch \
    --command bash -c '
        source $stdenv/setup
        dontUnpack=1
        export sourceRoot=source
        cd $sourceRoot
        genericBuild
    '
```

Unfortunately, this is roughly where our adventure ends. With the below patch,
I override `xcrun` with nixpkgs' `xcbuild.xcrun`, which should give it paths to
the nixpkgs-based frameworks that I have included in the build inputs, such as
`MetalPerformanceShaders` and `MetalPerformanceShadersGraph`. Unfortunately, it
complains that the SDK is not new enough (requires MacOS SDK >=12.3, nixpkgs
currently only provides 11).

```diff
diff --git a/pkgs/development/python-modules/torch/default.nix b/pkgs/development/python-modules/torch/default.nix
index 912628bf9497..e022974f5687 100644
--- a/pkgs/development/python-modules/torch/default.nix
+++ b/pkgs/development/python-modules/torch/default.nix
@@ -10,7 +10,7 @@

   # Build inputs
   numactl,
-  Accelerate, CoreServices, libobjc,
+  Accelerate, CoreServices, MetalPerformanceShaders, MetalPerformanceShadersGraph, libobjc, xcbuild,

   # Propagated build inputs
   filelock,
@@ -27,6 +27,9 @@
   # this is also what official pytorch build does
   mklDnnSupport ? !(stdenv.isDarwin && stdenv.isAarch64),

+  # Use MPS on M1 machines
+  mpsSupport ? (stdenv.isDarwin && stdenv.isAarch64),
+
   # virtual pkg that consistently instantiates blas across nixpkgs
   # See https://github.com/NixOS/nixpkgs/pull/83888
   blas,
@@ -190,6 +193,9 @@ in buildPythonPackage rec {
     substituteInPlace third_party/pocketfft/pocketfft_hdronly.h --replace '#if __cplusplus >= 201703L
     inline void *aligned_alloc(size_t align, size_t size)' '#if __cplusplus >= 201703L && 0
     inline void *aligned_alloc(size_t align, size_t size)'
+  '' + lib.optionalString mpsSupport ''
+    substituteInPlace CMakeLists.txt \
+      --replace 'xcrun' "${xcbuild.xcrun}/bin/xcrun"
   '';

   preConfigure = lib.optionalString cudaSupport ''
@@ -294,7 +300,8 @@ in buildPythonPackage rec {
     ++ lib.optionals rocmSupport [ openmp ]
     ++ lib.optionals (cudaSupport || rocmSupport) [ magma ]
     ++ lib.optionals stdenv.isLinux [ numactl ]
-    ++ lib.optionals stdenv.isDarwin [ Accelerate CoreServices libobjc ];
+    ++ lib.optionals stdenv.isDarwin [ Accelerate CoreServices libobjc ]
+    ++ lib.optionals mpsSupport [ MetalPerformanceShaders MetalPerformanceShadersGraph ];

   propagatedBuildInputs = [
     cffi
```

At this point, I made one more desperate attempt to *force* it to try to use
the nixpkgs MPS libraries, changing only the following from the above diff:


```diff
+  '' + lib.optionalString mpsSupport ''
+    substituteInPlace CMakeLists.txt \
+      --replace 'bash -c "xcrun ' 'bash -c "${xcbuild.xcrun}/bin/xcrun ' \
+      --replace '"MPS_FOUND" OFF)' '"MPS_FOUND" ON)'
```

Re-running everything with this patch shows that it seems to work (it *tries*
to use `MPS`):

```console
$ rg -i '^--.*( use_| )mps' build.log
29:-- sdk version: 11.0, mps supported: OFF
30:-- MPSGraph framework not found
572:--   USE_MPS               : ON
619:-- sdk version: 11.0, mps supported: OFF
620:-- MPSGraph framework not found
912:--   USE_MPS               : ON
```

but the build ultimately fails with an enormous number of not-unexpected errors
about MPS not having the same API it is expecting, in keeping with it being
brought in from a far too old SDK.

Here's where I leave things for now, a little discouraged, but I have learned a
fair amount about the nix build process in the meantime. Hope this is
educational to someone out there!

[0]: https://github.com/NixOS/nix/issues/5567
[1]: https://github.com/NixOS/nix/issues/5567#issuecomment-1662738721
[2]: https://github.com/NixOS/nix/issues/6202#issuecomment-1090498875
[3]: https://nixos.org/manual/nixpkgs/stable/#sec-building-stdenv-package-in-nix-shell
