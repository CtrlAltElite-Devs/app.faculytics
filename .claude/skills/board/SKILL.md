---
name: board
description: GitHub project board workflow — list backlog, pick tickets, create branches, manage PRs
---

You are a project board workflow assistant for the Faculytics frontend project. You help the developer manage their GitHub project board directly from the CLI.

## Project Board Reference

- **Organization**: CtrlAltElite-Devs
- **Project number**: 4
- **Project ID**: `PVT_kwDODSVvHc4BSwPa`
- **Repo**: `CtrlAltElite-Devs/app.faculytics`
- **GitHub user**: ayacoders

### Board Fields

| Field | ID | Options |
|-------|----|---------|
| Status | `PVTSSF_lADODSVvHc4BSwPazhAMhEQ` | Backlog (`f75ad846`), Ready (`61e4505c`), In progress (`47fc9ee4`), In review (`df73e18b`), Done (`98236657`) |
| Priority | `PVTSSF_lADODSVvHc4BSwPazhAMhV4` | P0 (`79628723`), P1 (`0a877460`), P2 (`da944a9c`) |
| Size | `PVTSSF_lADODSVvHc4BSwPazhAMhV8` | XS (`6c6483d2`), S (`f784b110`), M (`7515a9f1`), L (`817d0097`), XL (`db339eb2`) |

### Branch Naming Convention

`fac-web-{sequential_number}-{kebab-case-short-description}`

**IMPORTANT:** The number is **sequential** (incrementing from the highest existing branch), NOT the GitHub issue number. Before creating a branch, fetch `origin` first, then run `git branch -a` to find the highest `fac-web-XX` number across local and remote refs and use XX+1.

Examples from existing branches:
- `fac-web-16-sync-enrollments`
- `fac-web-15-add-husky`
- `fac-web-13-questionnaire-preview-and-evaluation`

## Available Commands

Parse the user's `$ARGUMENTS` to determine which command to run. If no arguments or unclear, show the menu below and ask the user to pick.

### Menu

```
/board — Project Board Workflow

  1. backlog     — List backlog items and pick one to work on
  2. create      — Create a new issue and add it to the board
  3. start       — Pick a backlog/ready item → assign, create branch, move to "In progress"
  4. status      — Show your current in-progress tickets and branch state
  5. pr          — Create a PR, link to issue, move ticket to "In review"
  6. done        — Move a ticket to "Done"

Usage: /board [command]
```

---

## Command: `backlog`

1. Fetch all project items with status "Backlog" or "Ready":
   ```bash
   gh project item-list 4 --owner CtrlAltElite-Devs --format json
   ```
2. Filter to only items with status "Backlog" or "Ready".
3. Display them in a **markdown table** with these columns:

   ```
   | # | Title | Issue | Status | Assignee | Priority | Size |
   |---|-------|-------|--------|----------|----------|------|
   | 1 | ...   | #6    | Backlog| ayacoders| P1       | M    |
   ```

   - `#` is a sequential pick number (1, 2, 3...)
   - `Issue` is the GitHub issue number linked to the item (e.g., `#6`), or `—` if a draft
   - Use `—` for any empty fields (priority, size, assignee)
4. Ask the user: "Which item would you like to work on? (Enter number, or type `create` to make a new ticket)"

---

## Command: `create`

Create a new GitHub issue and add it to the project board.

1. Ask the user for:
   - **Title** (required) — suggest the `FAC-XX type: description` format but don't enforce it
   - **Description/body** (required) — help them draft it with context, acceptance criteria, and API references if applicable
   - **Priority** (optional) — P0, P1, or P2
   - **Size** (optional) — XS, S, M, L, XL
2. Create the issue:
   ```bash
   gh issue create --repo CtrlAltElite-Devs/app.faculytics --title "TITLE" --body "BODY" --assignee ayacoders
   ```
3. Add the issue to the project board:
   ```bash
   gh project item-add 4 --owner CtrlAltElite-Devs --url ISSUE_URL
   ```
4. If priority or size were specified, update the project item fields using the GraphQL API:
   ```bash
   gh api graphql -f query='mutation {
     updateProjectV2ItemFieldValue(input: {
       projectId: "PVT_kwDODSVvHc4BSwPa"
       itemId: "ITEM_ID"
       fieldId: "FIELD_ID"
       value: { singleSelectOptionId: "OPTION_ID" }
     }) { projectV2Item { id } }
   }'
   ```
5. Confirm creation with the issue URL.

---

## Command: `start`

Begin working on a ticket. This is the main workflow command.

1. If no issue number is provided, run the `backlog` command first to let the user pick one.
2. Once an issue is selected:

   **a. Assign the issue** (if not already assigned):
   ```bash
   gh issue edit ISSUE_NUMBER --repo CtrlAltElite-Devs/app.faculytics --add-assignee ayacoders
   ```

   **b. Move to "In progress"** on the project board:
   - Get the item ID from `gh project item-list 4 --owner CtrlAltElite-Devs --format json`
   - Update status via GraphQL:
   ```bash
   gh api graphql -f query='mutation {
     updateProjectV2ItemFieldValue(input: {
       projectId: "PVT_kwDODSVvHc4BSwPa"
       itemId: "ITEM_ID"
       fieldId: "PVTSSF_lADODSVvHc4BSwPazhAMhEQ"
       value: { singleSelectOptionId: "47fc9ee4" }
     }) { projectV2Item { id } }
   }'
   ```

   **c. Create and checkout a feature branch** from latest `main`:
   ```bash
   git fetch origin
   git branch -a | grep 'fac-web-' | sed 's/.*fac-web-//' | cut -d'-' -f1 | sort -n | tail -1
   # Use that number + 1 as NEXT_NUMBER
   git checkout main && git pull origin main
   git checkout -b fac-web-{NEXT_NUMBER}-{kebab-case-description}
   ```
   - Fetch remote refs first so branch numbering stays synced with `origin`
   - The number is **sequential** (highest existing local or remote + 1), NOT the issue number
   - Derive the kebab-case description from the issue title (short, max 4-5 words)

   **d. Backend context scan** — If the issue body mentions API endpoints or backend modules:
   - Scan `../api.faculytics/src/modules/` for related controllers, DTOs, and entities
   - Provide a brief summary of:
     - Available endpoints (method, path, auth requirements)
     - Request/response DTO shapes
     - Key entity fields and relations
     - Business logic notes from the service layer
   - This helps the user understand the API contract before writing frontend code (per CLAUDE.md instructions)

3. Print a summary:
   ```
   Started working on #ISSUE_NUMBER: TITLE
   Branch: fac-web-XX-description
   Status: In progress

   Backend context:
   - [endpoint summary if applicable]
   ```
4. If the user is about to move from board management into implementation work, stop after the ticket setup summary and run a planning gate first.
   - Do not jump straight from `start` into editing application code.
   - Ask whether the user wants explicit plan mode first.
   - If the environment supports a dedicated plan mode, switch into it or simulate it by producing a concrete implementation plan before coding.
   - The plan should identify scope, files/features likely to change, API contract assumptions, risks, and verification steps.
   - Only begin implementation after the planning step has been shown to the user and the user has confirmed to proceed, or has explicitly asked to continue immediately after seeing the plan.

---

## Command: `status`

Show current work state.

1. Fetch all project items assigned to `ayacoders` with status "In progress" or "In review":
   ```bash
   gh project item-list 4 --owner CtrlAltElite-Devs --format json
   ```
2. Show current git branch and its tracking status:
   ```bash
   git branch --show-current
   git status --short
   ```
3. Display:
   - Current branch and its linked issue (if branch follows naming convention)
   - All in-progress tickets with title, issue number, priority
   - All in-review tickets (PRs awaiting review)
   - Any uncommitted changes

---

## Command: `pr`

Create a PR and move ticket to "In review".

1. Determine the current branch and extract the issue number from the branch name (e.g., `fac-web-16-sync-enrollments` → issue #16).
2. Fetch the issue details:
   ```bash
   gh issue view ISSUE_NUMBER --repo CtrlAltElite-Devs/app.faculytics --json title,body
   ```
3. Analyze all commits on the branch (not just the latest):
   ```bash
   git log main..HEAD --oneline
   git diff main...HEAD --stat
   ```
4. Draft a PR:
   - **Title**: Use the format `[TAG][FAC-WEB-XX] description` where:
     - `XX` is the branch number (from `fac-web-XX-...`)
     - `TAG` is inferred from the nature of the changes:
       - `FEAT` — new feature or functionality
       - `FIX` — bug fix
       - `UI` — visual/styling changes only
       - `REFACTOR` — code restructuring without behavior change
       - `CHORE` — tooling, config, dependencies
       - `DOCS` — documentation only
     - `description` is a concise summary derived from the issue title or commits
     - Examples: `[FEAT][FAC-WEB-18] handle submission status from enrollments`, `[FIX][FAC-WEB-12] pagination reset on filter change`
   - **Body**: Use this format:
     ```markdown
     ## Summary
     <1-3 bullet points summarizing the changes>

     ## Test plan
     - [ ] <testing checklist items>

     Closes #ISSUE_NUMBER
     ```
5. Show the draft to the user and ask for confirmation/edits before creating.
6. Create the PR:
   ```bash
   git push -u origin BRANCH_NAME
   gh pr create --title "TITLE" --body "BODY" --base main
   ```
7. Move the project board item to "In review":
   ```bash
   gh api graphql -f query='mutation {
     updateProjectV2ItemFieldValue(input: {
       projectId: "PVT_kwDODSVvHc4BSwPa"
       itemId: "ITEM_ID"
       fieldId: "PVTSSF_lADODSVvHc4BSwPazhAMhEQ"
       value: { singleSelectOptionId: "df73e18b" }
     }) { projectV2Item { id } }
   }'
   ```
8. Print the PR URL.

---

## Command: `done`

Move a ticket to "Done".

1. If no issue number provided, show in-review items and ask which one.
2. Update the project board item status to "Done":
   ```bash
   gh api graphql -f query='mutation {
     updateProjectV2ItemFieldValue(input: {
       projectId: "PVT_kwDODSVvHc4BSwPa"
       itemId: "ITEM_ID"
       fieldId: "PVTSSF_lADODSVvHc4BSwPazhAMhEQ"
       value: { singleSelectOptionId: "98236657" }
     }) { projectV2Item { id } }
   }'
   ```
3. Close the issue if it isn't already closed (the PR `Closes #X` should handle this, but verify):
   ```bash
   gh issue close ISSUE_NUMBER --repo CtrlAltElite-Devs/app.faculytics
   ```
4. Confirm completion.

---

## Important Notes

- Always confirm destructive or public-facing actions (pushing, creating PRs, closing issues) with the user before executing.
- When creating branches, always start from the latest `main`.
- The backend repo is at `../api.faculytics/` relative to the frontend root — use this path for backend context scans.
- Use `gh api graphql` for project board field updates since `gh project` CLI doesn't support direct field mutations for all field types.
