import { useMutation, useQuery } from "@apollo/client"
import { useState, type FormEvent } from "react"
import { CREATE_WEDDING_WISH } from "@/graphql/mutations/createWeddingWish"
import { GET_WEDDING_WISHES } from "@/graphql/queries/weddingWishes"
import type {
  CreateWeddingWishData,
  CreateWeddingWishVariables,
  GetWeddingWishesData,
  WeddingTemplateMode,
} from "@/types/wedding"

interface WeddingWishesProps {
  mode: WeddingTemplateMode
  guestReference: string
  couplePronoun: string
}

export function WeddingWishes({
  mode,
  guestReference,
  couplePronoun,
}: WeddingWishesProps) {
  const capitalizedGuestReference =
    guestReference.charAt(0).toUpperCase() + guestReference.slice(1)
  const [guestName, setGuestName] = useState("")
  const [message, setMessage] = useState("")
  const [previewMessage, setPreviewMessage] = useState("")
  const { data, loading: wishesLoading, error: wishesError } =
    useQuery<GetWeddingWishesData>(GET_WEDDING_WISHES)
  const [createWish, { loading: submitting, error: submitError }] = useMutation<
    CreateWeddingWishData,
    CreateWeddingWishVariables
  >(CREATE_WEDDING_WISH, {
    refetchQueries: [{ query: GET_WEDDING_WISHES }],
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPreviewMessage("")

    if (mode === "preview") {
      setPreviewMessage("Đây là bản xem trước — lời chúc chưa được gửi.")
      return
    }

    try {
      await createWish({ variables: { input: { guestName, message } } })
      setGuestName("")
      setMessage("")
    } catch {
      // Apollo exposes the error state below the form.
    }
  }

  return (
    <div className="wedding-wishes">
      <form className="wedding-form wedding-form--compact" onSubmit={handleSubmit}>
        <label className="wedding-form__field">
          <span>Tên người gửi</span>
          <input
            value={guestName}
            onChange={(event) => setGuestName(event.target.value)}
            placeholder="Nhập họ và tên"
            required
          />
        </label>
        <label className="wedding-form__field">
          <span>Gửi một lời chúc</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={`${capitalizedGuestReference} muốn gửi lời chúc gì đến ${couplePronoun}?`}
            rows={3}
            required
          />
        </label>
        <button
          className="wedding-button wedding-button--solid"
          disabled={submitting}
        >
          {submitting ? "Đang gửi…" : "Gửi lời chúc"}
        </button>
        {previewMessage && (
          <p className="wedding-form__success" role="status">
            {previewMessage}
          </p>
        )}
        {submitError && (
          <p className="wedding-form__error" role="alert">
            Chưa thể gửi lời chúc. Vui lòng thử lại.
          </p>
        )}
      </form>

      <div className="wedding-wishes__list" aria-live="polite">
        {wishesLoading && <p>Đang mở sổ lời chúc…</p>}
        {wishesError && <p>Chưa thể tải những lời chúc lúc này.</p>}
        {data?.weddingWishes.map((wish) => (
          <article className="wedding-wish" key={wish.id}>
            <span className="wedding-wish__mark">“</span>
            <p>{wish.message}</p>
            <strong>— {wish.guestName}</strong>
          </article>
        ))}
      </div>
    </div>
  )
}
