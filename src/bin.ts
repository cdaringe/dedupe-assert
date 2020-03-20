#!/usr/bin/env node

import { assess, warn, log, report as getReport } from './mod'
import { Matcher } from './types'
import meow = require('meow')
const cmdName = require('../package.json').name

const cli = meow(
  `
Usage
  $ ${cmdName} [/path/to/project]

Options
  --matches, -m  Add one or many matches, in string or JS regex style, csv separated

Examples

  # assert one thing deduped
  $ ${cmdName} --matches=debug

  # assert web things deduped
  $ ${cmdName} --matches=react,/webpack-*/,redux .

  # assert all things dedepud
  $ ${cmdName} --matches=/.*/ .
`,
  {
    flags: {
      matches: {
        type: 'string',
        alias: 'm'
      }
    }
  }
)

export const parseMatcher = (str: string): Matcher =>
  str.startsWith('/') ? new Function(`return ${str}`)() : str // eslint-disable-line

export const parseMatcherInput = (str: string = ''): Matcher[] =>
  str
    .split(',')
    .filter(Boolean)
    .map(m => m.trim())
    .map(parseMatcher)

async function go () {
  let matches: Matcher[] = []
  try {
    matches = parseMatcherInput(cli.flags.matches)
  } catch (err) {
    warn(
      `invalid matches provided: "${cli.flags.matches}". error: "${err.message}"`
    )
    process.exit(1)
  }
  const dirname = cli.input[1] || process.cwd()

  if (!matches.length) {
    warn('please provide matches, e.g. --matches=react,/webpack-*/,redux')
    process.exit(1)
  }
  log('resolving dependencies')
  const { conflictedDepsByName } = await assess({ dirname })
  log('creating report')
  const report = await getReport({
    conflictedDepsByName,
    alertOnMatches: matches
  })
  if (report) {
    warn(
      [
        '🚨 The following packages are required to be deduped',
        'but have >1 versions'
      ].join(' ')
    )
    console.table(report, ['name', 'versions'])
    process.exit(1)
  } else {
    log('ok')
  }
}

if (module.parent === null) go()
