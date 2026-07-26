import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

const GreenFloralWeddingPage = lazy(() =>
  import('@/features/wedding/pages/GreenFloralWeddingPage').then((module) => ({
    default: module.GreenFloralWeddingPage,
  })),
)

const WeddingEditorPage = lazy(() =>
  import('@/features/wedding/editor/pages/WeddingEditorPage').then(
    (module) => ({
      default: module.WeddingEditorPage,
    }),
  ),
)

const LearningDashboardPage = lazy(() =>
  import('@/pages/LearningDashboardPage').then((module) => ({
    default: module.LearningDashboardPage,
  })),
)

const pageFallback = (
  <div className="grid min-h-screen place-items-center bg-[#fffaf4] text-[#4c6755]">
    Đang mở trang…
  </div>
)

export function App() {
  return (
    <Suspense fallback={pageFallback}>
      <Routes>
        <Route path="/" element={<LearningDashboardPage />} />
        <Route path="/wedding/:slug" element={<GreenFloralWeddingPage />} />
        <Route path="/edit/:invitationId" element={<WeddingEditorPage />} />
      </Routes>
    </Suspense>
  )
}
