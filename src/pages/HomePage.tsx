import { ConfigProvider } from 'antd'
import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
        },
      }}
    >
      <div className="bg-slate-100 min-h-screen w-full p-4">
        <h1 className="text-2xl font-bold text-center">Thiệp cưới Online</h1>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            className="inline-flex rounded-full bg-emerald-800 px-5 py-2.5 font-medium text-white no-underline transition hover:bg-emerald-900"
            to="/wedding/demo"
          >
            Xem demo
          </Link>
          <Link
            className="inline-flex rounded-full border border-emerald-800 bg-white px-5 py-2.5 font-medium text-emerald-800 no-underline transition hover:bg-emerald-50"
            to="/edit/05be378a-5f1f-465b-be2c-7790545773bb?template=boho_floral_green"
          >
            Chỉnh sửa thiệp
          </Link>
        </div>
      </div>
    </ConfigProvider>
  )
}
