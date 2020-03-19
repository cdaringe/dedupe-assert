import { parseMatcherInput } from '../src/bin'
import ava, { TestInterface } from 'ava'

const test = ava as TestInterface<{}>

test('parses matchers from cli', t => {
  const empty = parseMatcherInput(undefined as any)
  t.deepEqual(empty, [])
  const emptyString = parseMatcherInput(undefined as any)
  t.deepEqual(emptyString, [])
  const simple = parseMatcherInput('abc')
  t.deepEqual(simple, ['abc'])
  const multiString = parseMatcherInput(' abc , def ')
  t.deepEqual(multiString, ['abc', 'def'])
  const multiStringAndRegex = parseMatcherInput(' abc , /zap/ ')
  t.deepEqual(multiStringAndRegex, ['abc', /zap/])
})
