# Student Evaluation Flow — Manual Test Checklist

This checklist covers the full student faculty evaluation feature: from course selection through draft auto-save to final submission.

**Route:** `/student/courses/[courseId]/evaluation`

---

## Preconditions

- [ ] Log in as a `STUDENT` with at least one enrolled course
- [ ] Ensure the enrolled course has a **faculty (instructor)** assigned
- [ ] Ensure the enrolled course has a **semester** assigned
- [ ] Ensure there is an **active** `FACULTY_FEEDBACK` questionnaire version (publish one from superadmin if needed)
- [ ] Backend is running with the `em.upsert` fix merged (FAC-68 / PR #145)
- [ ] Redis is running (`docker compose up`)

---

## 1. Page Shell & Context Card

- [ ] Navigate to `/student/courses` and click "Evaluate" on a course
- [ ] Page shows the header: "Faculty Evaluation Questionnaire"
- [ ] Context card displays the correct **Instructor** name
- [ ] Context card displays the correct **Course** full name
- [ ] Context card displays the correct **Course** shortname below the full name
- [ ] HTML entities in course/faculty names are decoded correctly (no `&amp;` or `&#39;` visible)

## 2. Loading States

- [ ] While enrollment data loads, the page shows a spinner with "Loading course context..."
- [ ] While the questionnaire version loads, the shell shows the context card + spinner with "Loading questionnaire..."
- [ ] While submission check / draft loads, the shell shows the context card + spinner with "Preparing your evaluation..."

## 3. Guard States (Error Paths)

### No faculty assigned
- [ ] For a course with no instructor, the page shows "No Instructor Assigned" with a UserX icon
- [ ] "Back to Courses" button navigates to `/student/courses`

### No semester
- [ ] For a course with no semester, the page shows "Unable to determine the current semester for this course."
- [ ] "Back to Courses" button navigates to `/student/courses`

### No active questionnaire version
- [ ] When no `FACULTY_FEEDBACK` version is active, the page shows "No active questionnaire is available for evaluation at this time."
- [ ] The context card (instructor + course) is still visible above the error
- [ ] "Back to Courses" button navigates to `/student/courses`

### Invalid course ID
- [ ] Navigate to `/student/courses/invalid-uuid/evaluation`
- [ ] Page shows "This course is not in your current enrollments."

### Already submitted
- [ ] After submitting an evaluation, navigate back to the same evaluation URL
- [ ] Page shows "Evaluation Already Submitted" with a green checkmark icon
- [ ] The submitted date is displayed correctly
- [ ] The context card (instructor + course) is still visible
- [ ] "Back to Courses" button navigates to `/student/courses`

---

## 4. Questionnaire Form Rendering

### Rating scale instructions
- [ ] Rating scale instructions card is visible above the form

### Sections & questions
- [ ] All sections from the active version are rendered with their titles
- [ ] Nested (child) sections render under their parent
- [ ] Questions within each section are displayed with their text
- [ ] Required questions are visually indicated

### Likert scale (1-5) questions
- [ ] Five options are displayed as selectable pills: Strongly Disagree → Strongly Agree
- [ ] Clicking a pill selects it (visual highlight with primary color)
- [ ] Selecting a different pill deselects the previous one
- [ ] The numeric value label is shown alongside the text

### Yes/No questions
- [ ] Two options are displayed as selectable pills: Yes / No
- [ ] Clicking a pill selects it
- [ ] Selecting a different pill deselects the previous one

### Qualitative comment (if enabled)
- [ ] If the questionnaire has qualitative feedback enabled, a text area is shown
- [ ] Placeholder text is displayed
- [ ] Text can be typed freely

### Progress bar
- [ ] Progress bar shows "0 of N answered" initially
- [ ] Answering a required question increments the progress
- [ ] Progress reaches "N of N answered" when all required questions are answered

### Desktop vs Mobile
- [ ] On desktop (wide viewport), questions render in a matrix/table layout
- [ ] On mobile (narrow viewport), questions render in a stacked card layout
- [ ] Both layouts show the same questions and accept answers

---

## 5. Auto-Save Draft

### Initial save
- [ ] Answer at least one question and wait ~3 seconds
- [ ] Draft status shows "Saving draft..." then "Draft saved"
- [ ] No console errors or 500 responses in the network tab

### Subsequent saves
- [ ] Answer more questions and wait ~3 seconds
- [ ] Draft status cycles: "Saving draft..." → "Draft saved"
- [ ] Network tab shows `POST /api/v1/questionnaires/drafts` returning 201

### Draft payload verification
- [ ] Inspect the POST request body and confirm it includes:
  - `versionId` (correct active version)
  - `facultyId` (correct instructor)
  - `semesterId` (correct semester)
  - `courseId` (correct course)
  - `answers` (object with question IDs as keys, numeric values)
  - `qualitativeComment` (string, if entered)

### Draft persistence (reload)
- [ ] Answer several questions, wait for "Draft saved"
- [ ] Refresh the page (F5)
- [ ] Previously answered questions are pre-filled with saved values
- [ ] Qualitative comment (if entered) is restored
- [ ] Progress bar reflects the restored answers

### Debounce behavior
- [ ] Rapidly answer multiple questions in quick succession
- [ ] Only one save request fires after the debounce period (~3 seconds of inactivity)

### Save failure
- [ ] Stop the backend while on the evaluation page
- [ ] Answer a question and wait for the save attempt
- [ ] Draft status shows "Draft save failed"
- [ ] Restart the backend, answer another question
- [ ] Draft status recovers to "Draft saved"

---

## 6. Stale Draft Handling

- [ ] Save a draft against the current active version
- [ ] Publish a new version from superadmin (deprecating the old one)
- [ ] Navigate back to the evaluation page
- [ ] The form loads fresh (stale draft is discarded, not pre-filled)
- [ ] No errors in the console

---

## 7. Submission

### Validation — unanswered required questions
- [ ] Leave some required questions unanswered
- [ ] Click "Submit Evaluation"
- [ ] A toast error appears: "Please answer all required questions. X remaining."
- [ ] The form is NOT submitted

### Validation — missing qualitative comment (if required)
- [ ] Answer all required questions but leave the comment empty (if qualitative is required)
- [ ] Click "Submit Evaluation"
- [ ] A toast error appears: "Please provide your comments before submitting."
- [ ] The form is NOT submitted

### Successful submission
- [ ] Answer all required questions (and qualitative comment if required)
- [ ] Click "Submit Evaluation"
- [ ] Button shows spinner with "Submitting..."
- [ ] Button is disabled during submission
- [ ] Success toast appears: "Evaluation submitted successfully."
- [ ] User is redirected to `/student/courses`

### Duplicate submission (409)
- [ ] After submitting, manually navigate back to the evaluation URL
- [ ] Page shows "Evaluation Already Submitted" (guard state, not form)
- [ ] If somehow a second submit request is sent (e.g., via devtools), a toast shows "You have already submitted this evaluation."

### Auto-save cancellation on submit
- [ ] Answer a question, then immediately click "Submit Evaluation" (before auto-save fires)
- [ ] The submit goes through without a conflicting draft save request

---

## 8. Navigation

- [ ] "Back to Courses" button in the form footer navigates to `/student/courses`
- [ ] Browser back button works correctly from the evaluation page
- [ ] "Back to Courses" buttons in all guard states (error, no faculty, already submitted) navigate correctly

---

## 9. Multi-Course Isolation

- [ ] Submit an evaluation for Course A
- [ ] Navigate to Course B's evaluation page
- [ ] The form is fresh (no pre-filled answers from Course A)
- [ ] Course B shows the correct instructor and course in the context card
- [ ] Save a draft for Course B
- [ ] Navigate back to Course A — it shows "Already Submitted"
- [ ] Navigate back to Course B — draft answers are restored
