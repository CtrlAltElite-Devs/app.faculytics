# Manual Verification Checklist

This checklist covers the questionnaire version list actions implemented for the superadmin questionnaires page.

## Preconditions

- [x] Log in as a `SUPER_ADMIN`.
- [x] Open `/superadmin/questionnaires`.
- [x] Ensure at least one questionnaire type has versions in each relevant status when possible:
  - [x] `DRAFT`
  - [x] `ACTIVE`
  - [x] `DEPRECATED`

## List Actions

- [x] Verify the action column renders as a kebab menu, not multiple inline buttons.
- [x] Verify each row still shows the correct version, status, published date, and created date.
- [x] Verify the action menu trigger is disabled while a publish or deprecate mutation is in flight.

## Status-Based Menu Visibility

- [x] For a `DRAFT` version, verify `Edit` is visible.
- [x] For a `DRAFT` version, verify `Publish` is visible.
- [x] For a `DRAFT` version, verify `Deprecate` is visible.
- [x] For a `DRAFT` version, verify `View` is not visible.
- [x] For an `ACTIVE` version, verify `View` is visible.
- [x] For an `ACTIVE` version, verify `Deprecate` is visible.
- [x] For an `ACTIVE` version, verify `Edit` is not visible.
- [x] For an `ACTIVE` version, verify `Publish` is not visible.
- [x] For a `DEPRECATED` version, verify `View` is visible.
- [x] For a `DEPRECATED` version, verify `Edit` is not visible.
- [x] For a `DEPRECATED` version, verify `Publish` is not visible.
- [x] For a `DEPRECATED` version, verify `Deprecate` is not visible.

## Dialog Behavior

- [ ] Select `Publish` from a draft row and verify a confirmation dialog opens.
- [ ] Select `Deprecate` from a draft row and verify a confirmation dialog opens.
- [ ] Select `Deprecate` from an active row and verify a confirmation dialog opens.
- [ ] Verify the dialog cancel button closes the dialog without changing data.
- [ ] Verify dialog buttons become disabled while the request is pending.

## Navigation

- [ ] From a draft row, choose `Edit` and verify navigation goes to `/superadmin/questionnaires/new?type=<type>&versionId=<id>`.
- [ ] From an active or deprecated row, choose `View` and verify navigation goes to `/superadmin/questionnaires/preview?versionId=<id>`.

## Mutation Outcomes

- [ ] Publish a valid draft and verify a success toast appears.
- [ ] Publish a valid draft and verify the list refreshes automatically.
- [ ] Publish a valid draft and verify the published row becomes `ACTIVE`.
- [ ] Publish a draft version and verify it deprecates the current active version.
- [ ] Publish a valid draft and verify the previously active version, if any, becomes `DEPRECATED`.
- [ ] Deprecate an active version and verify a success toast appears.
- [ ] Deprecate an active version and verify the list refreshes automatically.
- [ ] Deprecate an active version and verify the row becomes `DEPRECATED`.
- [ ] Deprecate a draft version and verify a success toast appears.
- [ ] Deprecate a draft version and verify the list refreshes automatically.
- [ ] Deprecate a draft version and verify the row becomes `DEPRECATED`.
- [ ] Deprecate the only draft version for a questionnaire type and verify the `Create Draft` button appears again.

## Error Handling

- [ ] Trigger a backend failure for publish or deprecate and verify an error toast appears.
- [ ] Trigger a backend failure for publish or deprecate and verify the dialog remains usable after the error.
- [ ] Trigger a backend failure for publish or deprecate and verify the list data does not incorrectly change on the client.

## Known Blocker

- [ ] Publishing builder-created drafts is currently blocked if the serialized questionnaire schema does not include `dimensionCode` values for questions.
- [ ] The backend validator requires each question to include an active dimension code, so publish may fail with `Dimension code "undefined" not found or inactive.`
