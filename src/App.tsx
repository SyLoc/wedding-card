import { ConfigProvider } from "antd";
import { CountryList } from "@/components/CountryList";
import { UserList } from "@/components/UserList";
import { useCountries } from "@/hooks/useCountries";
import { useUsers } from "@/hooks/useUsers";

export function App() {
  const { countries, loading, error } = useCountries();
  const {
    users,
    loading: usersLoading,
    error: usersError,
  } = useUsers();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1677ff",
        },
      }}
    >
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <main className="mx-auto max-w-3xl">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              Learning Cursor AI
            </h1>
            <p className="mt-2 text-slate-600">
              React · TypeScript · Ant Design · TailwindCSS · GraphQL Mock
            </p>
          </header>

          <CountryList
            countries={countries}
            loading={loading}
            error={error}
          />

          <UserList
            users={users}
            loading={usersLoading}
            error={usersError}
            countries={countries}
            countriesLoading={loading}
          />
        </main>
      </div>
    </ConfigProvider>
  );
}
