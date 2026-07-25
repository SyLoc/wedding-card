import { useEffect, useRef, useState } from "react"
import { WeddingCountdown } from "@/features/wedding/components/WeddingCountdown"
import { WeddingGallery } from "@/features/wedding/components/WeddingGallery"
import { WeddingMusicPlayer } from "@/features/wedding/components/WeddingMusicPlayer"
import { WeddingRsvp } from "@/features/wedding/components/WeddingRsvp"
import { WeddingWishes } from "@/features/wedding/components/WeddingWishes"
import { useWeddingAutoScroll } from "@/features/wedding/hooks/useWeddingAutoScroll"
import { capitalizeFirstLetter } from "@/features/wedding/utils/text"
import type { WeddingInvitation, WeddingTemplateMode } from "@/types/wedding"
import "@/features/wedding/templates/green-floral/greenFloralTemplate.css"

interface GreenFloralTemplateProps {
  invitation: WeddingInvitation;
  mode?: WeddingTemplateMode;
}

const weddingDateFormatter = new Intl.DateTimeFormat("vi-VN", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Ho_Chi_Minh",
})

const weddingTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Ho_Chi_Minh",
})

const weddingCalendarFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "Asia/Ho_Chi_Minh",
})

interface WeddingCalendarDate {
  day: string;
  month: string;
  year: string;
}

function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime())
}

function formatWeddingDate(
  date: Date,
  formatter: Intl.DateTimeFormat,
  fallback = "Chưa chọn ngày",
): string {
  return isValidDate(date) ? formatter.format(date) : fallback
}

function getWeddingCalendarDate(date: Date): WeddingCalendarDate {
  const fallback: WeddingCalendarDate = {
    day: "--",
    month: "--",
    year: "----",
  }

  if (!isValidDate(date)) {
    return fallback
  }

  return weddingCalendarFormatter
    .formatToParts(date)
    .reduce<WeddingCalendarDate>((calendarDate, part) => {
      if (
        part.type === "day" ||
        part.type === "month" ||
        part.type === "year"
      ) {
        calendarDate[part.type] = part.value
      }

      return calendarDate
    }, fallback)
}

function preserveFirstLetterCase(source: string, replacement: string): string {
  return source.charAt(0) === source.charAt(0).toUpperCase()
    ? capitalizeFirstLetter(replacement)
    : replacement
}

function applyInvitationPersonalization(
  value: string,
  couplePronoun: string,
  guestReference: string,
): string {
  return value
    .replace(/chúng mình|chúng em|chúng con|hai cháu/gi, (match) =>
      preserveFirstLetterCase(match, couplePronoun),
    )
    .replace(/bạn/gi, (match) =>
      preserveFirstLetterCase(match, guestReference),
    )
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <header className="wedding-section-heading">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <i aria-hidden="true">❧</i>
    </header>
  )
}

export function GreenFloralTemplate({
  invitation,
  mode = "public",
}: GreenFloralTemplateProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [isMapInteractive, setIsMapInteractive] = useState(false)
  const [isInvitationOpened, setIsInvitationOpened] = useState(
    mode !== "public",
  )
  const isAutoScrolling = useWeddingAutoScroll(
    mode === "public" && isInvitationOpened,
  )
  const firstEvent = invitation.events[0]
  const venueEvent = invitation.events[1] ?? firstEvent
  const firstEventDate = new Date(firstEvent.dateTime)
  const guestGroup = invitation.guest.group.trim()
  const guestSalutation = invitation.guest.salutation.trim()
  const guestName = capitalizeFirstLetter(invitation.guest.name.trim())
  const guestDisplayName =
    [guestGroup, guestSalutation, guestName]
      .filter(Boolean)
      .map((part, index) => (index === 0 ? capitalizeFirstLetter(part) : part))
      .join(" ") || "Bạn"
  const guestReference =
    [guestGroup, guestSalutation].filter(Boolean).join(" ") || "bạn"
  const couplePronoun = invitation.guest.couplePronoun
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(venueEvent.address)}&z=15&output=embed`

  const handleOpenInvitation = () => {
    setIsInvitationOpened(true)
    document.dispatchEvent(new Event("wedding:open-invitation"))
  }

  useEffect(() => {
    if (isInvitationOpened) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isInvitationOpened])

  useEffect(() => {
    const root = rootRef.current

    if (!root) {
      return
    }

    const revealElements = root.querySelectorAll<HTMLElement>("[data-reveal]")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )

    revealElements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const root = rootRef.current

    if (
      !root ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return
    }

    const layers = root.querySelectorAll<HTMLElement>("[data-parallax]")
    let frame = 0

    const updateParallax = () => {
      const rootTop = root.getBoundingClientRect().top
      layers.forEach((layer) => {
        const speed = Number(layer.dataset.parallax ?? 0.04)
        layer.style.transform = `translate3d(0, ${-rootTop * speed}px, 0)`
      })
      frame = 0
    }

    const handleScroll = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(updateParallax)
      }
    }

    updateParallax()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (frame !== 0) {
        window.cancelAnimationFrame(frame)
      }
    }
  }, [])

  return (
    <div className="green-floral-wedding" ref={rootRef}>
      {!isInvitationOpened && (
        <div
          className="wedding-opening-screen"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wedding-opening-title"
        >
          <div
            className="wedding-opening-screen__backdrop"
            style={{ backgroundImage: `url(${invitation.heroImage})` }}
          />
          <div className="wedding-opening-leaves" aria-hidden="true">
            {Array.from({ length: 12 }, (_, index) => (
              <i key={index}>
                <svg viewBox="0 0 28 38">
                  <path
                    className="wedding-opening-leaves__blade"
                    d="M4.2 34.8C1.5 27.2 1.9 18.7 6.7 12.1C11 6.2 17.2 2.9 25.1 1.5C25.3 9.6 23.1 18.2 18.4 24.5C14.3 29.9 9.5 33.2 4.2 34.8Z"
                  />
                  <path
                    className="wedding-opening-leaves__vein"
                    d="M2.2 37C7.1 27 13.8 17.2 22.9 5.1M8.2 27.3L6.9 19.1M11.9 21.7L10.8 14.7M15.2 17.1L14.9 10.9M8.4 27L16.7 25.6M12 21.5L20.5 19.3M15.3 16.9L23 13.8"
                  />
                </svg>
              </i>
            ))}
          </div>
          <div className="wedding-opening-screen__ornament" aria-hidden="true">
            ❧
          </div>
          <div className="wedding-opening-screen__card">
            <span>{invitation.eyebrow}</span>
            <h2 id="wedding-opening-title">
              {invitation.couple.first.name}
              <i>&amp;</i>
              {invitation.couple.second.name}
            </h2>
            <p>Trân trọng gửi thiệp mời đến {guestDisplayName}</p>
            <button type="button" onClick={handleOpenInvitation} autoFocus>
              {/* <span aria-hidden="true">✉</span> */}
              Mở thiệp
            </button>
            {/* {invitation.music.src && (
              <small>Chạm để mở thiệp và bật nhạc</small>
            )} */}
          </div>
        </div>
      )}

      <a className="wedding-skip-link" href="#wedding-content">
        Đi đến nội dung thiệp
      </a>

      <WeddingMusicPlayer
        music={invitation.music}
        mode={mode}
        autoplayEnabled={isInvitationOpened}
      />

      {isAutoScrolling && (
        <div className="wedding-auto-scroll-status" role="status">
          <i aria-hidden="true">↓</i>
          <span>Tự động cuộn · Vuốt để dừng</span>
        </div>
      )}

      <header
        className="wedding-hero"
        style={{ backgroundImage: `url(${invitation.heroImage})` }}
      >
        <div className="wedding-hero__wash" />
        <div
          className="wedding-hero__botanical wedding-hero__botanical--left"
          data-parallax="0.08"
        />
        <div
          className="wedding-hero__botanical wedding-hero__botanical--right"
          data-parallax="0.04"
        />
        <div className="wedding-hero__content">
          <span className="wedding-kicker">{invitation.eyebrow}</span>
          <h1>
            <span>{invitation.couple.first.name}</span>
            <i>&amp;</i>
            <span>{invitation.couple.second.name}</span>
          </h1>
          <div className="wedding-hero__date">
            {formatWeddingDate(firstEventDate, weddingDateFormatter)}
          </div>
          <a className="wedding-scroll-cue" href="#wedding-content">
            <span>Cuộn để mở thiệp</span>
            <i aria-hidden="true">↓</i>
          </a>
        </div>
      </header>

      <main id="wedding-content">
        <section className="wedding-section wedding-intro" data-reveal>
          <div
            className="wedding-sprig wedding-sprig--top"
            data-parallax="0.03"
          />
          <span className="wedding-kicker">{invitation.invitationTitle}</span>
          <div className="wedding-guest-invitation">
            <span>Trân trọng kính mời</span>
            <strong>{guestDisplayName}</strong>
            <p>
              Sự hiện diện của {guestReference} là niềm vui và vinh hạnh của{" "}
              {invitation.guest.couplePronoun}.
            </p>
          </div>
          <blockquote>
            {applyInvitationPersonalization(
              invitation.quote,
              couplePronoun,
              guestReference,
            )}
          </blockquote>
          <p>
            {applyInvitationPersonalization(
              invitation.story,
              couplePronoun,
              guestReference,
            )}
          </p>
        </section>

        <section className="wedding-section wedding-couple" data-reveal>
          <SectionHeading
            eyebrow={invitation.guest.couplePronoun}
            title="The happy couple"
          />
          <div className="wedding-couple__grid">
            {[invitation.couple.first, invitation.couple.second].map(
              (partner, index) => (
                <article className="wedding-partner" key={partner.role}>
                  <div className="wedding-partner__portrait">
                    <img
                      src={invitation.heroImage}
                      alt={partner.name}
                      loading="lazy"
                      style={{
                        objectPosition: index === 0 ? "38% 78%" : "64% 78%",
                      }}
                    />
                  </div>
                  <span>{partner.role}</span>
                  <h3>{partner.name}</h3>
                  <p>{partner.description}</p>
                </article>
              ),
            )}
          </div>
        </section>

        <section className="wedding-section wedding-families" data-reveal>
          <div className="wedding-families__ornament" aria-hidden="true">
            ❦
          </div>
          <div className="wedding-families__grid">
            {invitation.families.map((family) => (
              <article key={family.side}>
                <span>{family.side}</span>
                <h3>{family.father}</h3>
                <i>&amp;</i>
                <h3>{family.mother}</h3>
                <p>{family.address}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="wedding-section wedding-events" data-reveal>
          <SectionHeading
            eyebrow={`Hẹn gặp ${capitalizeFirstLetter(guestReference)}`}
            title={`Ngày ${couplePronoun} nên duyên`}
          />
          <div className="wedding-events__grid">
            {invitation.events.map((event) => {
              const eventDate = new Date(event.dateTime)
              const calendarDate = getWeddingCalendarDate(eventDate)

              return (
                <article className="wedding-event-card" key={event.id}>
                  <span className="wedding-event-card__label">
                    {event.title}
                  </span>
                  <div className="wedding-event-card__calendar">
                    <div className="wedding-event-card__calendar-meta">
                      <span>Tháng</span>
                      <strong>{calendarDate.month}</strong>
                    </div>
                    <strong className="wedding-event-card__calendar-day">
                      {calendarDate.day}
                    </strong>
                    <div className="wedding-event-card__calendar-meta">
                      <span>Năm</span>
                      <strong>{calendarDate.year}</strong>
                    </div>
                  </div>
                  <h3>
                    {formatWeddingDate(
                      eventDate,
                      weddingTimeFormatter,
                      "--:--",
                    )}
                  </h3>
                  <p className="wedding-event-card__full-date">
                    {formatWeddingDate(eventDate, weddingDateFormatter)}
                  </p>
                  <small>{event.lunarDate}</small>
                  <div className="wedding-event-card__venue">
                    <strong>{event.venue}</strong>
                    <span>{event.address}</span>
                  </div>
                  <a
                    className="wedding-button"
                    href={event.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Xem bản đồ
                  </a>
                </article>
              )
            })}
          </div>
        </section>

        <section className="wedding-countdown-section" data-reveal>
          <div className="wedding-countdown-section__content">
            <span className="wedding-kicker">Counting down</span>
            <h2>Chờ ngày {couplePronoun} chung đôi</h2>
            <WeddingCountdown targetDate={firstEvent.dateTime} />
          </div>
        </section>

        <section
          className="wedding-section wedding-gallery-section"
          data-reveal
        >
          <SectionHeading eyebrow="Một chút kỷ niệm" title="Our moments" />
          <WeddingGallery images={invitation.gallery} />
        </section>

        <section className="wedding-section wedding-venue" data-reveal>
          <SectionHeading
            eyebrow="Tìm đường đến chung vui"
            title="Địa điểm tổ chức"
          />
          <div className="wedding-map-card">
            <div
              className={`wedding-map-card__map${isMapInteractive ? " is-interactive" : ""}`}
            >
              <iframe
                src={mapEmbedUrl}
                title={`Bản đồ ${venueEvent.venue}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              {!isMapInteractive && (
                <button
                  type="button"
                  onClick={() => setIsMapInteractive(true)}
                  aria-label="Bật tương tác với bản đồ"
                >
                  <span aria-hidden="true">⌖</span>
                  Chạm để xem và thu phóng bản đồ
                </button>
              )}
            </div>
            <div className="wedding-map-card__content">
              <span>Tiệc cưới</span>
              <h3>{venueEvent.venue}</h3>
              <p>{venueEvent.address}</p>
              <a
                className="wedding-button wedding-button--solid"
                href={venueEvent.mapUrl}
                target="_blank"
                rel="noreferrer"
              >
                Mở Google Maps
              </a>
            </div>
          </div>
        </section>

        <section className="wedding-section wedding-rsvp" data-reveal>
          <SectionHeading
            eyebrow={`${capitalizeFirstLetter(guestReference)} sẽ đến chứ?`}
            title="Xác nhận tham dự"
          />
          <p className="wedding-section__lead">
            Hãy cho {invitation.guest.couplePronoun} biết trước ngày 01.03.2027
            để buổi tiệc được chuẩn bị chu đáo nhất nhé.
          </p>
          <WeddingRsvp
            mode={mode}
            couplePronoun={couplePronoun}
            guestReference={guestReference}
          />
        </section>

        <section className="wedding-section wedding-wishes-section" data-reveal>
          <SectionHeading eyebrow="Gửi yêu thương" title="Sổ lời chúc" />
          <WeddingWishes
            mode={mode}
            guestReference={guestReference}
            couplePronoun={couplePronoun}
          />
        </section>

        <section className="wedding-section wedding-gifts" data-reveal>
          <SectionHeading
            eyebrow="Hộp quà cưới"
            title={`Gửi quà đến ${couplePronoun}`}
          />
          <p className="wedding-section__lead">
            Tình cảm và sự hiện diện của {guestReference} đã là món quà quý giá.
            Nếu ở xa, {guestReference} có thể gửi lời chúc qua hộp quà nhỏ này.
          </p>
          <div className="wedding-gifts__grid">
            {invitation.giftAccounts.map((account) => (
              <article className="wedding-gift-card" key={account.id}>
                <div
                  className="wedding-gift-card__qr"
                  aria-label="Mã QR minh họa"
                >
                  <span>QR</span>
                </div>
                <div>
                  <span>{account.label}</span>
                  <h3>{account.bankName}</h3>
                  <p>{account.accountName}</p>
                  <strong>{account.accountNumber}</strong>
                </div>
              </article>
            ))}
          </div>
          <small className="wedding-gifts__note">
            Thông tin trên chỉ dùng cho bản demo.
          </small>
        </section>
      </main>

      <footer className="wedding-footer">
        <div className="wedding-footer__leaf" data-parallax="0.04" />
        <span className="wedding-kicker">Thank you</span>
        <h2>
          {invitation.couple.first.name} <i>&amp;</i>{" "}
          {invitation.couple.second.name}
        </h2>
        <p>
          {applyInvitationPersonalization(
            invitation.closingMessage,
            couplePronoun,
            guestReference,
          )}
        </p>
        <span className="wedding-footer__date">
          {formatWeddingDate(firstEventDate, weddingDateFormatter)}
        </span>
      </footer>
    </div>
  )
}
