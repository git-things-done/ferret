import { debug } from "@actions/core";

export function parseQuery(input: string | undefined): string | undefined {
  return (input?.match(/\/ferret (.+)/) ?? [])[1];
}

export async function ferret(query: string, comments: AsyncGenerator<string, void, unknown>): Promise<string | undefined> {
  debug(`query:raw: ${query}`)
  query = sanitize(query)
  debug(`query:processed: ${query}`)

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
  function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

  for await (const comment of comments) {
    const match = comment.trim().match(/^#+\s*(.*?)\s*($|\n)/)
    if (match && sanitize(match[1]) == query) return comment
  }
}

function sanitize(input: string): string {
  return input.split(/\s/).filter(x => x).map(x => x.toLowerCase()).join(" ")
}