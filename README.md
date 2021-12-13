# “Ferret” for Git Things Done

Fetches comments from old [GitTD][] entries that match a query.

[GitTD]: https://github.com/git-things-done

## Purpose

Essentially a way to keep persistent notes but without the overhead of having
to manage them, with free history.

For example, I use this to maintain a note about my goals for next year,
fetching the comment titled `# 2022` whenever I want to add to it. Then next
year I can fetch and use the [usher][] to keep it in my daily entry for a few
weeks.

[usher]: https://github.com/git-things-done/usher

## Justification

I plan to use this for occasional notes and lists that I don’t want to “manage”
in a traditional notes app. My notes app is **FULL** at this point. Mostly full
of junk. If I’d used “ferret” instead notes I no longer were interested in would
naturally have been left behind in the ticket history and not clutter the notes
app interface.

Now I can use my Notes app for important topics and not *everything*.

# Usage

Requires [Git Things Done][GitTD].

You need a `.github/workflows/ferret.yml`:

```yaml
name: Ferret
on:
  issue_comment:
    types:
      - created
      - edited
jobs:
  ferret:
    runs-on: ubuntu-latest
    if: github.event.issue_comment.user.login != 'github-actions[bot]'
    steps:
      - uses: git-things-done/ferret@v1
```

Then in your daily entry add a new comment:

```markdown
/ferret topic
```

The ferret will search do a reverse chronological search for a comment with a
markdown title matching `topic`, if it finds it it will replace the comment
text with what it found.

[GitTD]: https://github.com/git-things-done
