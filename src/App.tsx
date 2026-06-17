import { ConfigProvider } from "antd";
import { CountryList } from "@/components/CountryList";
import { ExampleForm } from "@/components/ExampleForm";
import { useCountries } from "@/hooks/useCountries";

export function App() {
  const { countries, loading, error } = useCountries();

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

          <ExampleForm
            countries={countries}
            countriesLoading={loading}
            countriesError={error}
          />
        </main>
      </div>
    </ConfigProvider>
  );
}
