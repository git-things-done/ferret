import { ferret } from './engine.js'

async function iHateNode() {
  let dummy = `# foo\nbar`
  let rv = await ferret(`foo`, async function*() {
    yield dummy
  }())
  if (rv != dummy) throw new Error(`ferret() failed`)

  dummy = `# foo   \nbar`
  rv = await ferret(`foo`, async function*() {
    yield dummy
  }())
  if (rv != dummy) throw new Error(`ferret() failed`)

  dummy = `#foo\nbar`
  rv = await ferret(`foo`, async function*() {
    yield dummy
  }())
  if (rv != dummy) throw new Error(`ferret() failed`)

  dummy = `#foo`
  rv = await ferret(`foo`, async function*() {
    yield dummy
  }())
  if (rv != dummy) throw new Error(`ferret() failed`)

  dummy = `\n\n#foo`
  rv = await ferret(`foo`, async function*() {
    yield dummy
  }())
  if (rv != dummy) throw new Error(`ferret() failed`)

  dummy = `# bar\n\n#foo`
  rv = await ferret(`foo`, async function*() {
    yield dummy
  }())
  if (rv !== undefined) throw new Error(`ferret() failed`)

  dummy = `#  foo bar  \n\n#baz`
  rv = await ferret(`foo bar`, async function*() {
    yield dummy
  }())
  if (rv != dummy) throw new Error(`ferret() failed`)

  dummy = `#  foo  bar  \n\n#baz`
  rv = await ferret(`foo bar`, async function*() {
    yield dummy
  }())
  if (rv != dummy) throw new Error(`ferret() failed`)

  dummy = `#  foo bar  \n\n#baz`
  rv = await ferret(`foo  bar`, async function*() {
    yield dummy
  }())
  if (rv != dummy) throw new Error(`ferret() failed`)

  dummy = `#  FOO  bar  \n\n#baz`
  rv = await ferret(`foo  BAR`, async function*() {
    yield dummy
  }())
  if (rv != dummy) throw new Error(`ferret() failed`)
}

iHateNode()
