import { useEffect, useState } from "react"

interface WeddingCountdownProps {
  targetDate: string
}

interface CountdownValue {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const emptyCountdown: CountdownValue = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
}

function getCountdown(targetDate: string): CountdownValue {
  const targetTime = new Date(targetDate).getTime()

  if (Number.isNaN(targetTime)) {
    return emptyCountdown
  }

  const distance = Math.max(targetTime - Date.now(), 0)

  if (distance === 0) {
    return emptyCountdown
  }

  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  }
}

export function WeddingCountdown({ targetDate }: WeddingCountdownProps) {
  const [countdown, setCountdown] = useState(() => getCountdown(targetDate))

  useEffect(() => {
    setCountdown(getCountdown(targetDate))
    const timer = window.setInterval(() => {
      setCountdown(getCountdown(targetDate))
    }, 1_000)

    return () => window.clearInterval(timer)
  }, [targetDate])

  const units = [
    { value: countdown.days, label: "Ngày" },
    { value: countdown.hours, label: "Giờ" },
    { value: countdown.minutes, label: "Phút" },
    { value: countdown.seconds, label: "Giây" },
  ]

  return (
    <div className="wedding-countdown" aria-label="Đếm ngược đến ngày cưới">
      {units.map((unit) => (
        <div className="wedding-countdown__item" key={unit.label}>
          <strong>{String(unit.value).padStart(2, "0")}</strong>
          <span>{unit.label}</span>
        </div>
      ))}
    </div>
  )
}
