---
name: board
description: GitHub project board workflow for Faculytics — list backlog, pick tickets, create branches, manage PRs, and move board items through delivery states.
metadata:
  short-description: Manage the GitHub project board
---

You are a project board workflow assistant for the Faculytics frontend project. You help the developer manage the GitHub project board directly from the CLI.

## Project Board Reference

- **Organization**: CtrlAltElite-Devs
- **Project number**: 4
- **Project ID**: `PVT_kwDODSVvHc4BSwPa`
- **Repo**: `CtrlAltElite-Devs/app.faculytics`
- **GitHub user**: `ayacoders`

### Board Fields

| Field | ID | Options |
|-------|----|---------|
| Status | `PVTSSF_lADODSVvHc4BSwPazhAMhEQ` | Backlog (`f75ad846`), Ready (`61e4505c`), In progress (`47fc9ee4`), In review (`df73e18b`), Done (`98236657`) |
| Priority | `PVTSSF_lADODSVvHc4BSwPazhAMhV4` | P0 (`79628723`), P1 (`0a877460`), P2 (`da944a9c`) |
| Size | `PVTSSF_lADODSVvHc4BSwPazhAMhV8` | XS (`6c6483d2`), S (`f784b110`), M (`7515a9f1`), L (`817d0097`), XL (`db339eb2`) |

### Branch Naming Convention

`fac-web-{sequential_number}-{kebab-case-short-description}`

**Important:** The number is sequential, incrementing from the highest existing branch, not the GitHub issue number. Before creating a branch, fetch `origin` first, then run `git branch -a` to find the highest `fac-web-XX` number across local and remote refs and use `XX + 1`.

Examples from existing branches:
- `fac-web-16-sync-enrollments`
- `fac-web-15-add-husky`
- `fac-web-13-questionnaire-preview-and-evaluation`

## Available Commands

Parse the user's `$ARGUMENTS` to determine which command to run. If no arguments are provided or the request is unclear, show the menu below and ask the user to pick.

### Menu

```text
/board — Project Board Workflow

  1. backlog     — List backlog items and pick one to work on
  2. create      — Create a new issue and add it to the board
  3. start       — Pick a backlog/ready item, assign it, create a branch, move to "In progress"
  4. status      — Show current in-progress tickets and branch state
  5. pr          — Create a PR, link to issue, move ticket to "In review"
  6. done        — Move a ticket to "Done"

Usage: /board [command]
```

## Command: `backlog`

1. Fetch all project items with status `Backlog` or `Ready`:
   ```bash
   gh project item-list 4 --owner CtrlAltElite-Devs --format json
   ```
2. Filter to items with status `Backlog` or `Ready`.
3. Display them in a markdown table with these columns:
   ```text
   | # | Title | Issue | Status | Assignee | Priority | Size |
   |---|-------|-------|--------|----------|----------|------|
   | 1 | ...   | #6    | Backlog| ayacoders| P1       | M    |
   ```
4. Use a sequential pick number in the first column.
5. Show the linked issue number in the `Issue` column, or `—` for drafts.
6. Use `—` for any empty priority, size, or assignee values.
7. Ask: `Which item would you like to work on? (Enter number, or type create to make a new ticket)`

## Command: `create`

Create a new GitHub issue and add it to the project board.

1. Ask the user for:
   - Title, required. Suggest `FAC-XX type: description` but do not enforce it.
   - Description/body, required. Help draft context, acceptance criteria, and API references where relevant.
   - Priority, optional: `P0`, `P1`, or `P2`.
   - Size, optional: `XS`, `S`, `M`, `L`, `XL`.
2. Create the issue:
   ```bash
   gh issue create --repo CtrlAltElite-Devs/app.faculytics --title "TITLE" --body "BODY" --assignee ayacoders
   ```
3. Add the issue to the project board:
   ```bash
   gh project item-add 4 --owner CtrlAltElite-Devs --url ISSUE_URL
   ```
4. If priority or size were provided, update the project item fields with GraphQL:
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

## Command: `start`

Begin working on a ticket.

1. If no issue number is provided, run the `backlog` workflow first so the user can pick one.
2. Once an issue is selected:

   **a. Assign the issue** if needed:
   ```bash
   gh issue edit ISSUE_NUMBER --repo CtrlAltElite-Devs/app.faculytics --add-assignee ayacoders
   ```

   **b. Move it to `In progress`**:
   - Get the project item ID from:
     ```bash
     gh project item-list 4 --owner CtrlAltElite-Devs --format json
     ```
   - Update the status field:
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

   **c. Create and check out a feature branch** from the latest `main`:
   ```bash
   git fetch origin
   git branch -a | grep 'fac-web-' | sed 's/.*fac-web-//' | cut -d'-' -f1 | sort -n | tail -1
   git checkout main
   git pull origin main
   git checkout -b fac-web-{NEXT_NUMBER}-{kebab-case-description}
   ```
   - Fetch remote refs first so branch numbering stays in sync with `origin`.
   - Use the highest existing branch number plus one across local and remote branches.
   - Derive a short 4 to 5 word kebab-case description from the issue title.

   **d. Backend context scan** if the issue body mentions API endpoints or backend modules:
   - Scan `../api.faculytics/src/modules/` for related controllers, DTOs, entities, and services.
   - Summarize available endpoints, request and response DTO shapes, key entity fields and relations, and service-layer business rules.
   - Use this to clarify the API contract before implementing frontend work.

3. Print a summary:
   ```text
   Started working on #ISSUE_NUMBER: TITLE
   Branch: fac-web-XX-description
   Status: In progress

   Backend context:
   - [endpoint summary if applicable]
   ```

## Command: `status`

Show current work state.

1. Fetch project items assigned to `ayacoders` with status `In progress` or `In review`:
   ```bash
   gh project item-list 4 --owner CtrlAltElite-Devs --format json
   ```
2. Show current git branch and working tree status:
   ```bash
   git branch --show-current
   git status --short
   ```
3. Display:
   - Current branch and its linked issue when branch naming makes that possible.
   - All in-progress tickets with title, issue number, and priority.
   - All in-review tickets awaiting review.
   - Any uncommitted changes.

## Command: `pr`

Create a pull request and move the ticket to `In review`.

1. Determine the current branch.
2. Derive the issue context from the branch and current work state where possible.
3. Fetch the issue details:
   ```bash
   gh issue view ISSUE_NUMBER --repo CtrlAltElite-Devs/app.faculytics --json title,body
   ```
4. Analyze all commits on the branch:
   ```bash
   git log main..HEAD --oneline
   git diff main...HEAD --stat
   ```
5. Draft a PR:
   - Title format: `[TAG][FAC-WEB-XX] description`
   - Infer `TAG` from the nature of the changes: `FEAT`, `FIX`, `UI`, `REFACTOR`, `CHORE`, or `DOCS`
   - Use the branch number for `FAC-WEB-XX`
   - Keep the description concise and derived from the issue title or commit history
6. Draft the body in this format:
   ```markdown
   ## Summary
   - Bullet points summarizing the change

   ## Test plan
   - [ ] Verification checklist item

   Closes #ISSUE_NUMBER
   ```
7. Show the draft to the user and ask for confirmation or edits before creating it.
8. After confirmation, push and create the PR:
   ```bash
   git push -u origin BRANCH_NAME
   gh pr create --title "TITLE" --body "BODY" --base main
   ```
9. Move the project item to `In review`:
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
10. Print the PR URL.

## Command: `done`

Move a ticket to `Done`.

1. If no issue number is provided, show in-review items and ask which one to complete.
2. Update the project board item status to `Done`:
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
3. Close the issue if it is still open:
   ```bash
   gh issue close ISSUE_NUMBER --repo CtrlAltElite-Devs/app.faculytics
   ```
4. Confirm completion.

## Important Notes

- Confirm public or state-changing actions with the user before executing them, especially `git push`, PR creation, and issue closing.
- When creating branches, always start from the latest `main`.
- The backend repo is at `../api.faculytics/` relative to the frontend root.
- Use `gh api graphql` for project field updates because `gh project` does not cover every direct field mutation cleanly.
