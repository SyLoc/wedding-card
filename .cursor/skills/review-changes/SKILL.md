---
name: review-changes
description: Reviews git file changes for bugs, type safety, and maintainability using this project's React/TypeScript/GraphQL conventions, then applies suggested fixes directly to the changed files. Use when the user asks to review changes, review a diff, review staged files, review a PR, or find errors and improvements in modified code.
---

# Review File Changes

Review only the changed code. Read surrounding context when needed to judge correctness, but do not nitpick unchanged files.

## Workflow

1. **Determine scope** — ask or infer from the user:
   - Staged changes: `git diff --cached`
   - Unstaged changes: `git diff`
   - Branch vs base: `git diff main...HEAD` (or the user's base branch)
   - Specific files: `git diff -- path/to/file`

2. **Gather changes** — run the appropriate git commands. If the user attached files or a PR, use that as the primary source.

3. **Read context** — for non-trivial changes, read the full changed files and closely related modules (types, hooks, queries, parent components).

4. **Validate when possible** — run `npm run lint` or `npm run build` if the review involves type/logic risk and commands are available.

5. **Report findings** — use the output format below. Only report meaningful issues.

6. **Apply fixes** — suggestions should be applied directly to the file. After reporting, edit the changed files to implement Issues and Improvements (prioritize High and Medium severity first). Run `npm run lint` to verify. Summarize what was changed in the response.

## Tech Stack

- React 19, TypeScript (strict)
- React Hook Form + Ant Design (`Controller` for form fields)
- TailwindCSS (layout/spacing) + Ant Design (UI components)
- GraphQL + Apollo Client (`useQuery`, typed query results)
- Vite, ESLint, path alias `@/*` → `src/*`

## Review Priorities

### 1. Correctness (Highest)

- Logic bugs, off-by-one errors, wrong conditions
- Missing null/undefined checks (`data?.field`, empty arrays)
- Race conditions and stale state (async updates, missing deps)
- GraphQL loading/error/empty states handled in UI
- Form validation aligned with submit behavior and reset flow
- Edge cases: empty lists, failed requests, duplicate keys

### 2. Type Safety

- No `any`; avoid unnecessary `as` assertions
- `useQuery<GetCountriesData>(...)` or equivalent typed generics
- Props and form values use `interface` or `type`
- Apollo/GraphQL result types live in `src/types/`
- Strict TS flags respected (`noUnusedLocals`, `strict`)

### 3. React Best Practices

- Functional components and hooks only
- Complete dependency arrays in `useEffect`, `useMemo`, `useCallback`
- Avoid derived state anti-patterns
- Avoid inline objects/functions in JSX when they cause avoidable re-renders
- Prefer composition; extract reusable logic to `use*` hooks in `src/hooks/`

### 4. React Hook Form + Ant Design

- Ant Design inputs/selects wrapped with `Controller`, not uncontrolled Ant Form alone
- `defaultValues` set; `reset()` behavior correct after submit
- `Form.Item` shows `validateStatus` and `help` from RHF `errors`
- Validation rules consistent between UI `required` and RHF rules

### 5. GraphQL + Apollo

- Queries in `src/graphql/queries/`; avoid inline `gql` in components
- No duplicate queries for the same data without reason
- Query variables validated; unnecessary refetches avoided
- Errors surfaced to users (Alert, fallback UI), not silently swallowed

### 6. Project Conventions

Follow [STANDARDS.md](STANDARDS.md) for file layout, naming, imports, and patterns used in this repo.

Quick checks:

| Area          | Expected pattern                                                       |
| ------------- | ---------------------------------------------------------------------- |
| Imports       | `@/components/...`, `@/hooks/...`, `@/types/...`                       |
| Components    | Named export, PascalCase, props interface, one component per file      |
| Data fetching | Custom hook (e.g. `useCountries`) returning `{ data, loading, error }` |
| Styling       | Tailwind for page layout; Ant Design for interactive UI                |
| Types         | Shared types exported from `src/types/`                                |

### 7. Maintainability

- Clear naming; no duplicated logic
- Functions/components kept focused
- Meaningful abstractions only — no over-engineering

## Output Format

```markdown
## Summary

Brief overall assessment of the changes.

## Issues

For each issue:

- **Severity**: High / Medium / Low
- **File**: path/to/file.tsx (line or range if helpful)
- **Description**: What is wrong
- **Why it matters**: Impact on users or maintainability
- **Suggested fix**: Concrete change

## Improvements

Optional non-blocking suggestions.

## Positive Notes

Good patterns worth keeping.
```

## Severity Guide

| Level      | When to use                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------- |
| **High**   | Bugs, broken UX, type unsafety that hides errors, missing error handling for user-facing flows    |
| **Medium** | Likely bugs under edge cases, hook dependency issues, convention violations that hurt consistency |
| **Low**    | Minor readability or optional refactors with clear benefit                                        |

## Rules

- Review **changes**, not the entire codebase unless asked
- **Apply suggestions in code** — suggestions should be added directly into the file; do not leave fixes as comments-only unless the user asks for review-only output
- Do not suggest changes with little practical value
- Do not recommend rewriting working code for style alone
- Cite changed code with `startLine:endLine:filepath` when pointing to specific problems
- If changes look good, say so clearly in Summary and Positive Notes

## Additional Resources

- Project conventions: [STANDARDS.md](STANDARDS.md)
- Workspace rules: `.cursor/rules/code-review.mdc`, `.cursor/rules/react-typescript.mdc`
