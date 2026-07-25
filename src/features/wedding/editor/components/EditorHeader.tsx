import type { WeddingInvitation } from "@/types/wedding"

export type EditorSaveStatus =
  | "loading"
  | "saved"
  | "saving"
  | "error"
  | "invalid"

interface EditorHeaderProps {
  invitation: WeddingInvitation
  saveStatus: EditorSaveStatus
  publishing: boolean
  onSave: () => void
  onPreview: () => void
  onPublish: () => void
}

const statusLabels: Record<EditorSaveStatus, string> = {
  loading: "Đang tải…",
  saved: "Đã lưu",
  saving: "Đang lưu…",
  error: "Lưu thất bại",
  invalid: "Cần kiểm tra thông tin",
}

export function EditorHeader({
  invitation,
  saveStatus,
  publishing,
  onSave,
  onPreview,
  onPublish,
}: EditorHeaderProps) {
  return (
    <header className="wedding-editor-header">
      <div className="wedding-editor-header__brand">
        <a href="/" aria-label="Về trang chủ">
          ←
        </a>
        <div>
          <strong>Hoa Mộc Xanh</strong>
          <span>{invitation.slug}</span>
        </div>
      </div>

      <div className="wedding-editor-header__actions">
        <span
          className={`wedding-editor-save-status wedding-editor-save-status--${saveStatus}`}
          role="status"
        >
          <i aria-hidden="true" />
          {statusLabels[saveStatus]}
        </span>
        <button type="button" className="editor-button" onClick={onSave}>
          Lưu
        </button>
        <button
          type="button"
          className="editor-button"
          onClick={onPreview}
        >
          Xem thử
        </button>
        <button
          type="button"
          className="editor-button editor-button--primary"
          onClick={onPublish}
          disabled={publishing}
        >
          {publishing ? "Đang xuất bản…" : "Xuất bản"}
        </button>
      </div>
    </header>
  )
}
