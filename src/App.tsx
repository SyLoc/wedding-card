import { lazy, Suspense } from 'react'
import { getNormalizedPath } from './utils/path'

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

export function App() {
  // const normalizedPath = window.location.pathname.replace(/\/$/, "") || "/"
  const normalizedPath = getNormalizedPath()
  const isWeddingPage = normalizedPath.startsWith('/wedding/')
  const isWeddingEditor = normalizedPath.startsWith('/edit/')

  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-[#fffaf4] text-[#4c6755]">
          Đang mở trang…
        </div>
      }
    >
      {isWeddingEditor ? (
        <WeddingEditorPage />
      ) : isWeddingPage ? (
        <GreenFloralWeddingPage />
      ) : (
        <LearningDashboardPage />
      )}
    </Suspense>
  )
}
