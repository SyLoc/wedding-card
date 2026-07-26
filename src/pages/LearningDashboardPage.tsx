import { ConfigProvider } from 'antd'
import { Link } from 'react-router-dom'
import { CountryList } from '@/components/CountryList'
import { UserList } from '@/components/UserList'
import { useCountries } from '@/hooks/useCountries'
import { useUsers } from '@/hooks/useUsers'

export function LearningDashboardPage() {
  const { countries, loading, error } = useCountries()
  const { users, loading: usersLoading, error: usersError } = useUsers()

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
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
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link
                className="inline-flex rounded-full bg-emerald-800 px-5 py-2.5 font-medium text-white no-underline transition hover:bg-emerald-900"
                to="/wedding/demo"
              >
                Xem demo thiệp Hoa Mộc Xanh
              </Link>
              <Link
                className="inline-flex rounded-full border border-emerald-800 bg-white px-5 py-2.5 font-medium text-emerald-800 no-underline transition hover:bg-emerald-50"
                to="/edit/05be378a-5f1f-465b-be2c-7790545773bb?template=boho_floral_green"
              >
                Chỉnh sửa thiệp
              </Link>
            </div>
          </header>

          <CountryList countries={countries} loading={loading} error={error} />

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
  )
}
