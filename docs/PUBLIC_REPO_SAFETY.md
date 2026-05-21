# Public Repository Safety

Fintrk is designed to be public and self-hostable, but personal finance apps need stricter habits than ordinary demo projects.

## Never Commit

- `.env`, `.env.local`, `.env.production`, or any copied environment file
- Database URLs, API keys, JWT secrets, cron secrets, Vercel tokens, or OAuth credentials
- Bank statements, account exports, database dumps, production logs, or screenshots with balances
- Real names, emails, account numbers, transaction descriptions, or merchant histories

Use synthetic fixtures and screenshots only. If you need an example import file, create one by hand with fake merchants and fake amounts.

## Before Publishing Changes

- Run secret scanning locally with `gitleaks detect --source .`
- Check `git status --short` before committing
- Check staged files with `git diff --cached --stat`
- Keep production URLs, owner details, and support contacts in environment variables
- Keep `.vercel/`, local build output, database dumps, and import samples out of git

## GitHub Settings

For public repos, enable:

- Secret scanning
- Push protection
- Dependabot alerts and security updates
- Private vulnerability reporting
- Branch protection for `main`

## If a Secret Leaks

Rotate it immediately. Deleting a commit or editing an issue is not enough because the value may already be cached, indexed, or copied.

Recommended rotation order:

1. OpenAI API keys
2. Database passwords and connection strings
3. Vercel tokens
4. JWT and cron secrets
5. Email provider keys

After rotating, update the relevant Vercel environment variables and redeploy.
