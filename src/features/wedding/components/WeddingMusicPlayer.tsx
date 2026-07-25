import { useEffect, useRef, useState } from "react"
import {
  isStoredMusicSource,
  loadWeddingMusic,
} from "@/features/wedding/utils/musicStorage"
import type {
  WeddingMusicSettings,
  WeddingTemplateMode,
} from "@/types/wedding"

interface WeddingMusicPlayerProps {
  music: WeddingMusicSettings
  mode: WeddingTemplateMode
  autoplayEnabled: boolean
}

export function WeddingMusicPlayer({
  music,
  mode,
  autoplayEnabled,
}: WeddingMusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const autoplayEnabledRef = useRef(autoplayEnabled)
  autoplayEnabledRef.current = autoplayEnabled
  const [isPlaying, setIsPlaying] = useState(false)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
  const [audioSource, setAudioSource] = useState("")
  const [sourceError, setSourceError] = useState(false)

  useEffect(() => {
    setSourceError(false)

    if (!music.src) {
      setAudioSource("")
      return
    }

    if (!isStoredMusicSource(music.src)) {
      setAudioSource(music.src)
      return
    }

    let cancelled = false
    let objectUrl = ""
    setAudioSource("")

    void loadWeddingMusic(music.src)
      .then((musicFile) => {
        if (cancelled) {
          return
        }

        if (!musicFile) {
          setSourceError(true)
          return
        }

        objectUrl = URL.createObjectURL(musicFile)
        setAudioSource(objectUrl)
      })
      .catch(() => {
        if (!cancelled) {
          setSourceError(true)
        }
      })

    return () => {
      cancelled = true

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [music.src])

  useEffect(() => {
    const audio = audioRef.current

    if (!audio || !audioSource) {
      return
    }

    let cancelled = false

    const handleFirstInteraction = (event: PointerEvent) => {
      if (
        event.target instanceof Element &&
        event.target.closest(".wedding-music-player")
      ) {
        return
      }

      void playAudio()
    }

    const handleOpenInvitation = () => {
      autoplayEnabledRef.current = true

      if (music.autoplay) {
        void playAudio()
      }
    }

    const playAudio = async () => {
      try {
        await audio.play()
        if (!cancelled) {
          setIsPlaying(true)
          setAutoplayBlocked(false)
        }
      } catch {
        if (
          !cancelled &&
          mode === "public" &&
          music.autoplay &&
          autoplayEnabledRef.current
        ) {
          setAutoplayBlocked(true)
          document.addEventListener("pointerdown", handleFirstInteraction, {
            once: true,
          })
        }
      }
    }

    audio.volume = 0.65
    audio.load()
    setIsPlaying(false)
    setAutoplayBlocked(false)

    if (
      mode === "public" &&
      music.autoplay &&
      autoplayEnabledRef.current
    ) {
      void playAudio()
    }

    document.addEventListener(
      "wedding:open-invitation",
      handleOpenInvitation,
    )

    return () => {
      cancelled = true
      document.removeEventListener("pointerdown", handleFirstInteraction)
      document.removeEventListener(
        "wedding:open-invitation",
        handleOpenInvitation,
      )
      audio.pause()
    }
  }, [audioSource, mode, music.autoplay])

  if (!music.src) {
    return null
  }

  const togglePlayback = async () => {
    const audio = audioRef.current

    if (!audio || !audioSource) {
      return
    }

    if (audio.paused) {
      try {
        await audio.play()
        setAutoplayBlocked(false)
      } catch {
        setIsPlaying(false)
        setAutoplayBlocked(true)
      }
      return
    }

    audio.pause()
  }

  return (
    <div
      className={`wedding-music-player wedding-music-player--${mode}${
        isPlaying ? " is-playing" : ""
      }${autoplayBlocked ? " needs-interaction" : ""}`}
    >
      <audio
        ref={audioRef}
        src={audioSource}
        loop
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <button
        type="button"
        onClick={() => void togglePlayback()}
        aria-label={isPlaying ? "Tạm dừng nhạc" : "Phát nhạc"}
      >
        <i aria-hidden="true">{isPlaying ? "Ⅱ" : "▶"}</i>
      </button>
      <div>
        <span>
          {sourceError
            ? "Không thể tải nhạc"
            : !audioSource
              ? "Đang tải nhạc"
              : isPlaying
            ? "Đang phát"
            : autoplayBlocked
              ? "Chạm để bật nhạc"
              : "Nhạc nền"}
        </span>
        <strong>{music.title}</strong>
      </div>
    </div>
  )
}
