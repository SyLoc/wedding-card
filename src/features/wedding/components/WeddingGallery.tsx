import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import type { WeddingGalleryImage } from "@/types/wedding"

interface WeddingGalleryProps {
  images: WeddingGalleryImage[]
}

export function WeddingGallery({ images }: WeddingGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const selectedImage =
    selectedIndex === null ? null : images[selectedIndex] ?? null

  const closeGallery = () => setSelectedIndex(null)
  const showPreviousImage = () => {
    setSelectedIndex((current) => {
      if (current === null) {
        return null
      }

      return (current - 1 + images.length) % images.length
    })
  }
  const showNextImage = () => {
    setSelectedIndex((current) => {
      if (current === null) {
        return null
      }

      return (current + 1) % images.length
    })
  }

  useEffect(() => {
    if (selectedIndex === null) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeGallery()
      }

      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) =>
          current === null ? null : (current - 1 + images.length) % images.length,
        )
      }

      if (event.key === "ArrowRight") {
        setSelectedIndex((current) =>
          current === null ? null : (current + 1) % images.length,
        )
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [images.length, selectedIndex])

  return (
    <>
      <div className="wedding-gallery">
        {images.map((image, index) => (
          <figure
            className={`wedding-gallery__item wedding-gallery__item--${index + 1}`}
            key={image.id}
          >
            <button
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Mở ảnh ${index + 1}: ${image.alt}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                style={{ objectPosition: image.position }}
              />
              <span aria-hidden="true">Xem ảnh</span>
            </button>
          </figure>
        ))}
      </div>

      {selectedImage &&
        selectedIndex !== null &&
        createPortal(
          <div
            className="wedding-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Album ảnh cưới"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeGallery()
              }
            }}
          >
            <div className="wedding-lightbox__toolbar">
              <span>
                {selectedIndex + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={closeGallery}
                ref={closeButtonRef}
                aria-label="Đóng album"
              >
                ×
              </button>
            </div>

            <div className="wedding-lightbox__stage">
              <button
                className="wedding-lightbox__navigation wedding-lightbox__navigation--previous"
                type="button"
                onClick={showPreviousImage}
                aria-label="Xem ảnh trước"
              >
                ‹
              </button>
              <figure>
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  style={{ objectPosition: selectedImage.position }}
                />
                <figcaption>{selectedImage.alt}</figcaption>
              </figure>
              <button
                className="wedding-lightbox__navigation wedding-lightbox__navigation--next"
                type="button"
                onClick={showNextImage}
                aria-label="Xem ảnh tiếp theo"
              >
                ›
              </button>
            </div>

            <div className="wedding-lightbox__thumbnails">
              {images.map((image, index) => (
                <button
                  className={index === selectedIndex ? "is-active" : ""}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  aria-label={`Xem ảnh ${index + 1}`}
                  aria-current={index === selectedIndex ? "true" : undefined}
                  key={image.id}
                >
                  <img
                    src={image.src}
                    alt=""
                    style={{ objectPosition: image.position }}
                  />
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
