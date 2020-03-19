# dedupe-assert

asserts that packages are truly deduped

## install

`npm install [-I|-D] dedupe-assert`

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

## why

[`npm dedupe`](https://docs.npmjs.com/cli/dedupe) and similar functions from various node package managers attempt to dedupe packages to save disk and reuse packages.  in some cases, _not_ deduping can be break your application.  for instance, some modules are are stateful and expect to be singletons.  if such packages are not deduped, referencing code may break as different instances in memory are referenced.

`dedupe-assert` guarantees that packages are both logically and physically deduped.
