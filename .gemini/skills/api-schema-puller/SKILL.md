---
name: api-schema-puller
description: Pulls the backend OpenAPI schema, generates TypeScript types, and checks for changes. Use this to sync the frontend with backend contracts and detect if updates are needed.
---

# api-schema-puller

This skill pulls the latest OpenAPI schema from the `faculytics-contracts` repository, generates TypeScript definitions, and determines if there are any changes compared to the existing version.

## Workflow

1.  **Pull Schema and Generate Types**: Execute the following command to update the TypeScript definitions:
    ```bash
    bunx openapi-typescript https://raw.githubusercontent.com/CtrlAltElite-Devs/faculytics-contracts/refs/heads/main/develop/openapi.json -o ./app/schema/index.d.ts
    ```

2.  **Check for Changes**: Use `git diff` to determine if the generated file has changed:
    ```bash
    git diff --exit-code ./app/schema/index.d.ts
    ```
    - If the exit code is **0**, there are no changes.
    - If the exit code is **1**, the schema has been updated.

3.  **Downstream Integration**: Other skills (e.g., TanStack Query service generators) can use this check to decide whether to trigger their own regeneration logic.
