import { useMutation } from "@apollo/client"
import { useState, type FormEvent } from "react"
import { SUBMIT_WEDDING_RSVP } from "@/graphql/mutations/submitWeddingRsvp"
import type {
  SubmitWeddingRsvpData,
  SubmitWeddingRsvpVariables,
  WeddingRsvpInput,
  WeddingTemplateMode,
} from "@/types/wedding"

interface WeddingRsvpProps {
  mode: WeddingTemplateMode
  couplePronoun: string
  guestReference: string
}

const initialRsvp: WeddingRsvpInput = {
  guestName: "",
  attendance: "ATTENDING",
  guestCount: 1,
  message: "",
}

export function WeddingRsvp({
  mode,
  couplePronoun,
  guestReference,
}: WeddingRsvpProps) {
  const capitalizedGuestReference =
    guestReference.charAt(0).toUpperCase() + guestReference.slice(1)
  const [form, setForm] = useState(initialRsvp)
  const [successMessage, setSuccessMessage] = useState("")
  const [submitRsvp, { loading, error }] = useMutation<
    SubmitWeddingRsvpData,
    SubmitWeddingRsvpVariables
  >(SUBMIT_WEDDING_RSVP)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSuccessMessage("")

    if (mode === "preview") {
      setSuccessMessage("Đây là bản xem trước — phản hồi chưa được gửi.")
      return
    }

    try {
      await submitRsvp({ variables: { input: form } })
      setSuccessMessage(
        form.attendance === "ATTENDING"
          ? `Cảm ơn ${guestReference}! Hẹn gặp ${guestReference} trong ngày vui của ${couplePronoun}.`
          : `Cảm ơn ${guestReference} đã phản hồi. ${couplePronoun.charAt(0).toUpperCase() + couplePronoun.slice(1)} rất trân trọng lời nhắn của ${guestReference}.`,
      )
      setForm(initialRsvp)
    } catch {
      // Apollo exposes the error state below the form.
    }
  }

  return (
    <form className="wedding-form" onSubmit={handleSubmit}>
      <label className="wedding-form__field">
        <span>Tên người phản hồi</span>
        <input
          value={form.guestName}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              guestName: event.target.value,
            }))
          }
          placeholder="Nhập họ và tên"
          required
        />
      </label>

      <fieldset className="wedding-form__attendance">
        <legend>{capitalizedGuestReference} sẽ tham dự chứ?</legend>
        <label>
          <input
            type="radio"
            name="attendance"
            checked={form.attendance === "ATTENDING"}
            onChange={() =>
              setForm((current) => ({
                ...current,
                attendance: "ATTENDING",
              }))
            }
          />
          <span>Vui vẻ tham dự</span>
        </label>
        <label>
          <input
            type="radio"
            name="attendance"
            checked={form.attendance === "DECLINED"}
            onChange={() =>
              setForm((current) => ({
                ...current,
                attendance: "DECLINED",
              }))
            }
          />
          <span>Tiếc là không thể</span>
        </label>
      </fieldset>

      {form.attendance === "ATTENDING" && (
        <label className="wedding-form__field">
          <span>Số người tham dự</span>
          <select
            value={form.guestCount}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                guestCount: Number(event.target.value),
              }))
            }
          >
            {[1, 2, 3, 4].map((count) => (
              <option value={count} key={count}>
                {count} người
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="wedding-form__field">
        <span>Lời nhắn</span>
        <textarea
          value={form.message}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              message: event.target.value,
            }))
          }
          placeholder={`${capitalizedGuestReference} muốn nhắn gì với ${couplePronoun}?`}
          rows={3}
        />
      </label>

      <button className="wedding-button wedding-button--solid" disabled={loading}>
        {loading ? "Đang gửi…" : "Gửi xác nhận"}
      </button>

      {successMessage && (
        <p className="wedding-form__success" role="status">
          {successMessage}
        </p>
      )}
      {error && (
        <p className="wedding-form__error" role="alert">
          Chưa thể gửi phản hồi. Vui lòng thử lại.
        </p>
      )}
    </form>
  )
}
