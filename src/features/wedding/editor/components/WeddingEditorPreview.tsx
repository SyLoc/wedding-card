import { useState } from "react"
import { GreenFloralTemplate } from "@/features/wedding/templates/green-floral/GreenFloralTemplate"
import type { WeddingInvitation } from "@/types/wedding"

type PreviewDevice = "phone" | "tablet" | "desktop"

interface WeddingEditorPreviewProps {
  invitation: WeddingInvitation
}

const previewDevices: Array<{ id: PreviewDevice; label: string }> = [
  { id: "phone", label: "Điện thoại" },
  { id: "tablet", label: "Máy tính bảng" },
  { id: "desktop", label: "Máy tính" },
]

export function WeddingEditorPreview({
  invitation,
}: WeddingEditorPreviewProps) {
  const [device, setDevice] = useState<PreviewDevice>("phone")

  return (
    <div className="wedding-editor-preview">
      <div className="wedding-editor-preview__toolbar">
        <strong>Xem trước</strong>
        <div role="group" aria-label="Kích thước bản xem trước">
          {previewDevices.map((item) => (
            <button
              type="button"
              className={device === item.id ? "is-active" : ""}
              onClick={() => setDevice(item.id)}
              aria-pressed={device === item.id}
              key={item.id}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="wedding-editor-preview__viewport">
        <div
          className="wedding-editor-preview__canvas"
          data-device={device}
        >
          <GreenFloralTemplate invitation={invitation} mode="preview" />
        </div>
      </div>
    </div>
  )
}
