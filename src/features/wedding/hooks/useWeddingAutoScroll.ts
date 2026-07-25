import { useEffect, useState } from "react"

const AUTO_SCROLL_DELAY_MS = 1_800
const AUTO_SCROLL_SPEED_PX_PER_SECOND = 35
const MANUAL_SCROLL_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "PageDown",
  "PageUp",
  "Home",
  "End",
  " ",
])

export function useWeddingAutoScroll(enabled: boolean): boolean {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches
  const [isAutoScrolling, setIsAutoScrolling] = useState(
    enabled && !prefersReducedMotion,
  )

  useEffect(() => {
    if (
      !enabled ||
      prefersReducedMotion
    ) {
      return
    }

    let animationFrame = 0
    let lastTimestamp = 0
    let autoScrollPosition = window.scrollY

    const stopAutoScroll = () => {
      window.clearTimeout(startTimer)
      window.cancelAnimationFrame(animationFrame)
      setIsAutoScrolling(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (MANUAL_SCROLL_KEYS.has(event.key)) {
        stopAutoScroll()
      }
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        stopAutoScroll()
      }
    }

    const tick = (timestamp: number) => {
      if (document.visibilityState === "hidden") {
        lastTimestamp = 0
        animationFrame = window.requestAnimationFrame(tick)
        return
      }

      if (lastTimestamp === 0) {
        lastTimestamp = timestamp
      }

      const elapsedSeconds = Math.min(timestamp - lastTimestamp, 32) / 1_000
      const maximumScroll = document.documentElement.scrollHeight - window.innerHeight
      autoScrollPosition = Math.min(
        autoScrollPosition + AUTO_SCROLL_SPEED_PX_PER_SECOND * elapsedSeconds,
        maximumScroll,
      )
      window.scrollTo({ top: autoScrollPosition, behavior: "auto" })
      lastTimestamp = timestamp

      if (autoScrollPosition >= maximumScroll - 1) {
        setIsAutoScrolling(false)
        return
      }

      animationFrame = window.requestAnimationFrame(tick)
    }

    const startTimer = window.setTimeout(() => {
      autoScrollPosition = window.scrollY
      animationFrame = window.requestAnimationFrame(tick)
    }, AUTO_SCROLL_DELAY_MS)

    window.addEventListener("wheel", stopAutoScroll, { passive: true })
    window.addEventListener("touchmove", stopAutoScroll, { passive: true })
    window.addEventListener("pointerdown", handlePointerDown, { passive: true })
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("focusin", stopAutoScroll)

    return () => {
      window.clearTimeout(startTimer)
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener("wheel", stopAutoScroll)
      window.removeEventListener("touchmove", stopAutoScroll)
      window.removeEventListener("pointerdown", handlePointerDown)
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("focusin", stopAutoScroll)
    }
  }, [enabled, prefersReducedMotion])

  return enabled && !prefersReducedMotion && isAutoScrolling
}
