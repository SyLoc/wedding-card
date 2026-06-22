# Project Guidance

## Project overview

This is a React 19 and TypeScript application built with Vite. It uses:

- Apollo Client and GraphQL
- Ant Design
- Tailwind CSS
- React Hook Form

GraphQL operations currently run through the local mock Apollo Link in
`src/apollo/mockLink.ts`.

## Commands

- Install dependencies: `npm ci`
- Start the development server: `npm run dev`
- Lint: `npm run lint`
- Type-check and build: `npm run build`

After changing TypeScript or React code, run:

1. `npm run lint`
2. `npm run build`

There is currently no automated test command. Do not claim tests passed unless
a test framework and test script have been added.

## Architecture

- `src/components`: UI components
- `src/hooks`: reusable query, mutation, and application hooks
- `src/graphql`: GraphQL queries and mutations
- `src/apollo`: Apollo client and transport setup
- `src/types`: shared domain and GraphQL types
- `src/mocks`: mock data and mutable mock state

Use the `@/` alias for imports from `src`.

## React and TypeScript

- Maintain compatibility with strict TypeScript settings.
- Do not introduce `any` or unnecessary type assertions.
- Use functional components and hooks.
- Use named exports for components and hooks.
- Keep components focused and extract reusable data logic into custom hooks.
- Keep dependency arrays complete and accurate.
- Add `useMemo` and `useCallback` only when they provide a practical benefit.
- Prefer `interface` for object props and `type` for unions and intersections.
- Keep one main component per file.
- Do not use semicolons at the end of JavaScript or TypeScript statements.

## Forms and UI

- Use React Hook Form `Controller` for controlled Ant Design fields.
- Preserve loading, validation, empty, and error states.
- Reset form state when the edited entity or modal state changes.
- Follow the existing Ant Design and Tailwind CSS styling conventions.

## GraphQL

- Type query and mutation data and variables explicitly.
- Keep operations under `src/graphql`.
- Handle loading and error states at the appropriate UI boundary.
- Avoid duplicate requests and unnecessary refetches.
- Update local mock behavior when adding or changing an operation.

## Working agreements

- Inspect existing conventions and `git status` before editing.
- Preserve unrelated user changes.
- Do not edit generated output under `dist`.
- Do not add or upgrade dependencies without confirmation.
- Keep changes focused on the requested task.
- During code review, prioritize correctness, type safety, React behavior,
  GraphQL behavior, and maintainability. Report only meaningful issues.

## Git

- Use Conventional Commits when asked to write a commit message.
- Keep commit subjects at most 72 characters.
- Focus commit messages on the business change.
- Do not create commits unless explicitly requested.
