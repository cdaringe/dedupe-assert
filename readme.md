# dedupe-assert

asserts that packages are truly deduped

## install

`npm install [--save|--save-dev] dedupe-assert`

## usage

```sh
$ dedupe-assert --help

  Usage
    $ dedupe-assert --matches=<pattern> [/path/to/project]

  Options
    --matches, -m  Add one or many matches, in string or JS regex style, csv separated

  Examples

    # assert one thing deduped
    $ dedupe-assert --matches=debug

    # assert web things deduped
    $ dedupe-assert --matches=react,/webpack-*/,redux .

    # assert all things dedepud
    $ dedupe-assert --matches=/.*/

```

when run on this very package, you can see not all dependencies are actually deduped:

```
$ dedupe-assert --matches=/.*/
[dedupe-assert] resolving dependencies
[dedupe-assert] creating report
[dedupe-assert] 🚨 The following packages are required to be deduped but have >1 versions
[dedupe-assert] resolving dependencies
[dedupe-assert] creating report
┌─────────┬────────────────────────────────────────┬─────────────────────────────────────┐
│ (index) │                  name                  │              versions               │
├─────────┼────────────────────────────────────────┼─────────────────────────────────────┤
│    0    │          '@babel/code-frame'           │           '7.8.3, 7.5.5'            │
│    1    │             '@types/node'              │          '6.14.9, 13.9.2'           │
│    2    │ '@typescript-eslint/typescript-estree' │           '2.24.0, 2.6.1'           │
│    3    │             'ansi-escapes'             │           '3.2.0, 4.3.1'            │
|  ...    |       ... truncated for readme ...     |            ...                      |
│   92    │             'yargs-parser'             │          '18.1.1, 10.1.0'           │
└─────────┴────────────────────────────────────────┴─────────────────────────────────────┘

```

😵!

## why

[`npm dedupe`](https://docs.npmjs.com/cli/dedupe) (and similar functions from other package managers) attempt to dedupe packages to save disk space and reuse package instances.  in many cases, _not_ deduping can actually break your application.

for instance, some packages may be stateful and expect to be singletons.  if such packages are not deduped, code files consuming those package may break as they can end up referencing different instances, when they thought they were sharing.

`dedupe-assert` guarantees that packages are both logically and physically deduped.
