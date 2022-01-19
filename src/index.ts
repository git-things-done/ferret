import * as github from '@actions/github'
import { debug, getInput, notice } from '@actions/core'
import { IssueCommentEvent } from '@octokit/webhooks-definitions/schema'
import { ferret, parseQuery } from './engine'

const slug = process.env.GITHUB_REPOSITORY!
const [owner, repo] = slug.split('/')
const token = getInput('token')!
const octokit = github.getOctokit(token)
const ctx = github.context.payload as IssueCommentEvent
const today = ctx.issue.number

async function* sniff() {
  const per_page = 100
  //TODO gotta search more than one page of results
  //TODO can use since to ensure we are before GTD_TODAY (I think)
  const issues = await octokit.rest.issues.listForRepo({
    repo, owner, per_page,
    sort: 'created', direction: 'desc',
    state: 'all'
  })
  debug(`issues: ${issues.data.length}`)
  for (const issue of issues.data) {
    const issue_number = issue.number
    debug(`issue: ${issue_number}`)
    if (issue_number >= today) continue
    const comments = await octokit.rest.issues.listComments({repo, owner, issue_number, per_page})
    for (const comment of comments.data) {
      debug(`comment: ${comment.id}`)
      if (comment.body) yield comment.body
    }
  }
}

const updateComment = async (body: string) => {
  debug("Updating comment")
  await octokit.rest.issues.updateComment({
    repo, owner, body, comment_id: ctx.comment.id,
  })
}

const query = parseQuery(ctx.comment.body)
if (query) {
  await updateComment(`ferret: active: ${query}`)
  const found = await ferret(query, sniff())
  await updateComment(found ?? `ferret: error: noop: ${query}`)
  if (found) {
    debug("Adding label")
    await octokit.rest.issues.addLabels({
      repo, owner, issue_number: ctx.issue.number, labels: ['ferret']
    })
  }
} else {
  notice("No query found in comment")
}
