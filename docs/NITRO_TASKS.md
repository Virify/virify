# Nitro Tasks

This project uses [Nitro Tasks](https://nitro.unjs.io/guide/tasks) for running background jobs, scheduled tasks, and post-deployment operations.

## Available Tasks

| Task Name | Shorthand | Description |
|-----------|-----------|-------------|
| `db:seed` | `seed` | Seeds the database with initial data (property types, admin user, sample listings) |
| `db:migrate` | `migrate` | Runs Prisma database migrations |
| `db:reset` | `reset` | ⚠️ Drops all data and reapplies migrations (destructive!) |
| `mortgage:fetch-rates` | `fetch-rates` | Fetches latest UK mortgage rates from GPT-4o-mini |

## Running Tasks Locally

```bash
# Run a task directly
npx nitro task run db:seed
npx nitro task run db:migrate
npx nitro task run mortgage:fetch-rates

# List all available tasks
npx nitro task list
```

## Running Tasks via GitHub Actions (On PR Merge)

Tasks can be automatically executed when a PR is merged by using semantic commit messages or PR titles with the `task:` prefix.

### Commit Message Format

```
task: <task1>, <task2>, <task3>
task(scope): <task1>, <task2>
```

### Examples

```bash
# Single task
task: seed

# Multiple tasks (comma-separated)
task: reset, seed

# With scope (for clarity)
task(db): migrate, seed

# Full task names also work
task: db:seed, db:migrate
```

### In Practice

When creating commits that should trigger tasks on merge:

```bash
git commit -m "task: seed"
git commit -m "task(db): reset, seed"
git commit -m "feat: add new feature

task: migrate"
```

Or set the PR title:

```
task(staging): seed, migrate
```

### Task Execution Flow

1. PR is merged to `main` or `staging`
2. GitHub Action parses all commit messages and PR title for `task:` prefix
3. Extracts comma-separated task names
4. Builds the application
5. Executes each task sequentially using `npx nitro task run <task-name>`
6. Reports success/failure in the GitHub Actions summary

## Semantic Commit Messages

This project follows [Conventional Commits](https://www.conventionalcommits.org/) with an additional `task:` type:

| Type | Description |
|------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Code style changes (formatting, etc.) |
| `refactor:` | Code refactoring |
| `test:` | Adding or updating tests |
| `chore:` | Maintenance tasks |
| `task:` | **Nitro tasks to run on PR merge** |

### Combined Usage

You can combine regular commits with task commits:

```bash
# Feature commit
git commit -m "feat(listings): add property comparison feature"

# Separate task commit
git commit -m "task: seed"
```

Or use the PR title for tasks while keeping commits semantic:

```
PR Title: task: migrate, seed
Commits: 
  - feat: add new listing fields
  - fix: resolve search bug
```

## Adding New Tasks

Create a new task file in `server/tasks/<category>/<task-name>.ts`:

```typescript
export default defineTask({
  meta: {
    name: 'category:task-name',
    description: 'Description of what the task does',
  },
  async run() {
    console.log('[Task Name] Starting...')
    
    try {
      // Task logic here
      
      console.log('[Task Name] ✅ Complete!')
      return { result: 'success' }
    } catch (error: any) {
      console.error('[Task Name] ❌ Error:', error)
      throw error
    }
  },
})
```

### Adding Shorthand Mapping

To add a shorthand for your task, update `.github/workflows/run-nitro-tasks.yml`:

```yaml
case "$task" in
  "seed")
    TASK_NAME="db:seed"
    ;;
  "your-shorthand")
    TASK_NAME="category:your-task"
    ;;
  # ... etc
esac
```

## Scheduled Tasks

Tasks can also be scheduled using cron expressions in `nuxt.config.ts`:

```typescript
nitro: {
  experimental: {
    tasks: true,
  },
  scheduledTasks: {
    // Run on the 1st of every month at 9am UTC
    '0 9 1 * *': ['mortgage:fetch-rates'],
    // Run daily at midnight
    '0 0 * * *': ['db:cleanup'],
  },
},
```

## Environment Variables

Tasks have access to all environment variables. Ensure these are set in GitHub Secrets for CI:

- `DATABASE_URL` - Primary database connection string
- `DIRECT_URL` - Direct database connection (for migrations)
- `NUXT_AUTH_SECRET` - Auth secret
- `OPENAI_API_KEY` - For AI-powered tasks
