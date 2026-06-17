# Project Standards Reference

Use this file when reviewing changes that touch structure, imports, or cross-cutting patterns.

## Directory Layout

```
src/
├── apollo/          # Apollo client and links
├── components/      # UI components (PascalCase files)
├── graphql/queries/ # GraphQL query documents
├── hooks/           # Custom hooks (use* prefix)
├── mocks/           # Mock data for Apollo mock link
├── types/           # Shared TypeScript interfaces/types
├── App.tsx
└── main.tsx
```

## Component Pattern

```tsx
interface MyComponentProps {
  items: Item[];
  loading: boolean;
  error: Error | undefined;
}

export function MyComponent({ items, loading, error }: MyComponentProps) {
  // ...
}
```

- Named exports (not default) for components
- File name matches component name (`CountryList.tsx` → `CountryList`)
- Props interface colocated in the same file

## Data Fetching Pattern

```tsx
// src/hooks/useCountries.ts
export function useCountries(): UseCountriesResult {
  const { data, loading, error } = useQuery<GetCountriesData>(GET_COUNTRIES);

  return {
    countries: data?.countries ?? [],
    loading,
    error: error ?? undefined,
  };
}
```

- GraphQL documents in `src/graphql/queries/`
- Response types in `src/types/`
- Components receive data via props or hooks — avoid `useQuery` duplicated across siblings when one hook can lift data (see `App.tsx` + `useCountries`)

## Form Pattern

```tsx
<Controller
  name="fieldName"
  control={control}
  rules={{ required: "Field is required" }}
  render={({ field }) => <Input {...field} />}
/>
```

- `useForm` with typed `defaultValues`
- Ant Design `Form.Item` for label, validation display, layout
- `Controller` bridges RHF and Ant Design inputs (`Input`, `Select`, etc.)

## Error & Loading UI

- User-facing errors: Ant Design `Alert` with `message` and `description`
- Tables/lists: pass `loading` to Ant Design components; handle empty states
- Distinguish error severity (`error` vs `warning`) when appropriate

## Styling

- Page structure: Tailwind utility classes (`className="mb-6 shadow-sm"`)
- Theming: Ant Design `ConfigProvider` at app root
- Do not mix conflicting styling approaches on the same element without reason

## TypeScript

- `strict: true`, no unused locals/parameters
- Prefer `interface` for object shapes; `type` for unions
- Export types used outside the module
- Avoid empty `catch` blocks

## Imports

```tsx
import { CountryList } from "@/components/CountryList";
import { useCountries } from "@/hooks/useCountries";
import type { Country } from "@/types/country";
```

- Use `@/` alias, not deep relative paths like `../../`
- Type-only imports use `import type`

## Anti-Patterns in This Repo

- `any` or unchecked `as` casts
- Class components
- Inline `gql` templates inside components
- Ant Design `Form` field state without `Controller` when using React Hook Form
- Fetching the same GraphQL query in multiple components without shared hook/cache strategy
- Default exports for main components (inconsistent with existing code)
- Ignoring `loading`/`error` from Apollo queries in UI
