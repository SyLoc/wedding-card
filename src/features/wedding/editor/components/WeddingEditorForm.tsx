import { Controller, useFormContext } from "react-hook-form"
import { useState, type ChangeEvent } from "react"
import { capitalizeFirstLetter } from "@/features/wedding/utils/text"
import { storeWeddingMusic } from "@/features/wedding/utils/musicStorage"
import type { WeddingInvitation } from "@/types/wedding"
import { toHashRouteUrl } from "@/utils/url"

function FieldError({ message }: { message?: string }) {
  return message ? (
    <small className="editor-field__error">{message}</small>
  ) : null
}

function toDateTimeLocal(value: string): string {
  return value.slice(0, 16)
}

function toWeddingDateTime(value: string): string {
  return value ? `${value}:00+07:00` : ""
}

export function WeddingEditorForm() {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<WeddingInvitation>()
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  )
  const [musicUploadError, setMusicUploadError] = useState("")
  const slug = watch("slug")
  const guest = watch("guest")
  const music = watch("music")
  const guestParams = new URLSearchParams({
    guest: guest.name,
    group: guest.group,
    salutation: guest.salutation,
    couplePronoun: guest.couplePronoun,
  })
  const personalizedUrl = toHashRouteUrl(
    `/wedding/${slug}?${guestParams.toString()}`,
  )
  const guestDisplayName =
    [guest.group, guest.salutation, capitalizeFirstLetter(guest.name)]
      .filter(Boolean)
      .join(" ") || "Bạn"
  const guestReference =
    [guest.group, guest.salutation].filter(Boolean).join(" ") || "bạn"

  const handleCopyGuestLink = async () => {
    try {
      await navigator.clipboard.writeText(personalizedUrl)
      setCopyStatus("copied")
      window.setTimeout(() => setCopyStatus("idle"), 2_000)
    } catch {
      setCopyStatus("error")
    }
  }

  const handleImageUpload = (
    event: ChangeEvent<HTMLInputElement>,
    field: "heroImage" | `gallery.${number}.src`,
  ) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        setValue(field, reader.result, {
          shouldDirty: true,
          shouldValidate: true,
        })
      }
    })
    reader.readAsDataURL(file)
  }

  const handleMusicUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setMusicUploadError(
        "File upload tối đa 10 MB trong bản demo. Với file lớn hơn, hãy dùng URL file nhạc.",
      )
      event.target.value = ""
      return
    }

    setMusicUploadError("")

    try {
      const source = await storeWeddingMusic(file)
      setValue("music.src", source, {
        shouldDirty: true,
        shouldValidate: true,
      })
      setValue("music.title", file.name.replace(/\.[^.]+$/, ""), {
        shouldDirty: true,
        shouldValidate: true,
      })
    } catch {
      setMusicUploadError(
        "Không thể lưu file nhạc trong trình duyệt. Vui lòng thử lại hoặc dùng URL file nhạc.",
      )
    }
  }

  return (
    <form
      className="wedding-editor-form"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="wedding-editor-form__intro">
        <span>Chỉnh sửa thiệp</span>
        <h1>Nội dung của bạn</h1>
        <p>
          Mọi thay đổi sẽ xuất hiện ngay trong bản xem trước và tự động lưu.
        </p>
      </div>

      <details className="editor-section" open>
        <summary>
          <span>01</span>
          Thông tin chung
        </summary>
        <div className="editor-section__content">
          <label className="editor-field">
            <span>Đường dẫn thiệp</span>
            <div className="editor-field__prefix">
              <i>/wedding/</i>
              <input {...register("slug")} />
            </div>
            <FieldError message={errors.slug?.message} />
          </label>
          <label className="editor-field">
            <span>Dòng mở đầu</span>
            <input {...register("eyebrow")} />
            <FieldError message={errors.eyebrow?.message} />
          </label>
          <label className="editor-field">
            <span>Tiêu đề lời mời</span>
            <input {...register("invitationTitle")} />
            <FieldError message={errors.invitationTitle?.message} />
          </label>
          <label className="editor-field">
            <span>Mẫu thiệp</span>
            <select {...register("templateId")} disabled>
              <option value="boho_floral_green">Hoa Mộc Xanh</option>
            </select>
          </label>
        </div>
      </details>

      <details className="editor-section" open>
        <summary>
          <span>02</span>
          Khách mời
        </summary>
        <div className="editor-section__content">
          <label className="editor-field">
            <span>Tên khách mời</span>
            <input
              {...register("guest.name")}
              placeholder="Ví dụ: Lan, Nam, Minh Anh"
            />
            <small className="editor-field__hint">
              Chỉ nhập tên; đối tượng mời và cách xưng hô chọn ở bên dưới.
            </small>
          </label>
          <label className="editor-field">
            <span>Đối tượng mời</span>
            <select {...register("guest.group")}>
              <option value="">Cá nhân</option>
              <option value="gia đình">Gia đình</option>
            </select>
          </label>
          <label className="editor-field">
            <span>Cách xưng hô với khách</span>
            <select {...register("guest.salutation")}>
              {["bạn", "anh", "chị", "cô", "chú", "dì", "bác", "ông", "bà"].map(
                (salutation) => (
                  <option value={salutation} key={salutation}>
                    {salutation.charAt(0).toUpperCase() + salutation.slice(1)}
                  </option>
                ),
              )}
            </select>
          </label>
          <label className="editor-field">
            <span>Cô dâu và chú rể tự xưng</span>
            <select {...register("guest.couplePronoun")}>
              {["chúng mình", "chúng em", "chúng con", "hai cháu"].map(
                (pronoun) => (
                  <option value={pronoun} key={pronoun}>
                    {pronoun.charAt(0).toUpperCase() + pronoun.slice(1)}
                  </option>
                ),
              )}
            </select>
          </label>
          <div className="editor-guest-preview">
            <span>Lời mời sẽ hiển thị</span>
            <strong>Trân trọng kính mời {guestDisplayName}</strong>
            <p>
              Sự hiện diện của {guestReference} là niềm vui của{" "}
              {guest.couplePronoun}.
            </p>
          </div>
          <div className="editor-personalized-link">
            <span>Link dành riêng cho khách</span>
            <code>{personalizedUrl}</code>
            <button type="button" onClick={() => void handleCopyGuestLink()}>
              {copyStatus === "copied"
                ? "Đã sao chép"
                : copyStatus === "error"
                  ? "Không thể sao chép"
                  : "Sao chép link"}
            </button>
          </div>
        </div>
      </details>

      <details className="editor-section" open>
        <summary>
          <span>03</span>
          Cô dâu &amp; Chú rể
        </summary>
        <div className="editor-section__content">
          <label className="editor-field">
            <span>Dòng giới thiệu cặp đôi</span>
            <input
              {...register("couple.eyebrow")}
              placeholder="Ví dụ: Hai chúng mình"
            />
            <FieldError message={errors.couple?.eyebrow?.message} />
          </label>
          {(["first", "second"] as const).map((partnerKey, index) => (
            <fieldset className="editor-fieldset" key={partnerKey}>
              <legend>{index === 0 ? "Chú rể" : "Cô dâu"}</legend>
              <label className="editor-field">
                <span>Họ và tên</span>
                <input {...register(`couple.${partnerKey}.name`)} />
                <FieldError
                  message={errors.couple?.[partnerKey]?.name?.message}
                />
              </label>
              <label className="editor-field">
                <span>Vai trò</span>
                <input {...register(`couple.${partnerKey}.role`)} />
              </label>
              <label className="editor-field">
                <span>Giới thiệu</span>
                <textarea
                  rows={3}
                  {...register(`couple.${partnerKey}.description`)}
                />
              </label>
            </fieldset>
          ))}
        </div>
      </details>

      <details className="editor-section">
        <summary>
          <span>04</span>
          Thông tin gia đình
        </summary>
        <div className="editor-section__content">
          {[0, 1].map((index) => (
            <fieldset className="editor-fieldset" key={index}>
              <legend>{index === 0 ? "Nhà trai" : "Nhà gái"}</legend>
              <label className="editor-field">
                <span>Tên hiển thị</span>
                <input {...register(`families.${index}.side`)} />
              </label>
              <label className="editor-field">
                <span>Họ tên cha</span>
                <input {...register(`families.${index}.father`)} />
                <FieldError
                  message={errors.families?.[index]?.father?.message}
                />
              </label>
              <label className="editor-field">
                <span>Họ tên mẹ</span>
                <input {...register(`families.${index}.mother`)} />
                <FieldError
                  message={errors.families?.[index]?.mother?.message}
                />
              </label>
              <label className="editor-field">
                <span>Địa chỉ</span>
                <input {...register(`families.${index}.address`)} />
              </label>
            </fieldset>
          ))}
        </div>
      </details>

      <details className="editor-section" open>
        <summary>
          <span>05</span>
          Ngày lễ &amp; Tiệc cưới
        </summary>
        <div className="editor-section__content">
          {[0, 1].map((index) => (
            <fieldset className="editor-fieldset" key={index}>
              <legend>{index === 0 ? "Lễ thành hôn" : "Tiệc chung vui"}</legend>
              <label className="editor-field">
                <span>Tên sự kiện</span>
                <input {...register(`events.${index}.title`)} />
              </label>
              <label className="editor-field">
                <span>Ngày và giờ</span>
                <Controller
                  control={control}
                  name={`events.${index}.dateTime`}
                  render={({ field }) => (
                    <input
                      type="datetime-local"
                      value={toDateTimeLocal(field.value)}
                      onChange={(event) =>
                        field.onChange(toWeddingDateTime(event.target.value))
                      }
                    />
                  )}
                />
              </label>
              <label className="editor-field">
                <span>Ghi chú ngày âm/đón khách</span>
                <input {...register(`events.${index}.lunarDate`)} />
              </label>
              <label className="editor-field">
                <span>Địa điểm</span>
                <input {...register(`events.${index}.venue`)} />
              </label>
              <label className="editor-field">
                <span>Địa chỉ</span>
                <textarea rows={2} {...register(`events.${index}.address`)} />
              </label>
              <label className="editor-field">
                <span>Google Maps URL</span>
                <input type="url" {...register(`events.${index}.mapUrl`)} />
                <FieldError message={errors.events?.[index]?.mapUrl?.message} />
              </label>
            </fieldset>
          ))}
        </div>
      </details>

      <details className="editor-section">
        <summary>
          <span>06</span>
          Lời mời &amp; Câu chuyện
        </summary>
        <div className="editor-section__content">
          <label className="editor-field">
            <span>Câu trích dẫn</span>
            <textarea rows={4} {...register("quote")} />
            <FieldError message={errors.quote?.message} />
          </label>
          <label className="editor-field">
            <span>Câu chuyện của hai bạn</span>
            <textarea rows={6} {...register("story")} />
            <FieldError message={errors.story?.message} />
          </label>
          <label className="editor-field">
            <span>Lời cảm ơn cuối thiệp</span>
            <textarea rows={4} {...register("closingMessage")} />
          </label>
        </div>
      </details>

      <details className="editor-section">
        <summary>
          <span>07</span>
          Hình ảnh
        </summary>
        <div className="editor-section__content">
          <label className="editor-upload">
            <span>Ảnh bìa</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => handleImageUpload(event, "heroImage")}
            />
            <i>Chọn ảnh JPG, PNG hoặc WebP</i>
          </label>
          {[0, 1, 2, 3].map((index) => (
            <fieldset className="editor-fieldset" key={index}>
              <legend>Ảnh album {index + 1}</legend>
              <label className="editor-upload">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) =>
                    handleImageUpload(event, `gallery.${index}.src`)
                  }
                />
                <i>Thay ảnh</i>
              </label>
              <label className="editor-field">
                <span>Mô tả ảnh</span>
                <input {...register(`gallery.${index}.alt`)} />
              </label>
            </fieldset>
          ))}
        </div>
      </details>

      <details className="editor-section">
        <summary>
          <span>08</span>
          Hộp quà cưới
        </summary>
        <div className="editor-section__content">
          {[0, 1].map((index) => (
            <fieldset className="editor-fieldset" key={index}>
              <legend>{index === 0 ? "Cô dâu" : "Chú rể"}</legend>
              <label className="editor-field">
                <span>Nhãn hiển thị</span>
                <input {...register(`giftAccounts.${index}.label`)} />
              </label>
              <label className="editor-field">
                <span>Ngân hàng</span>
                <input {...register(`giftAccounts.${index}.bankName`)} />
              </label>
              <label className="editor-field">
                <span>Chủ tài khoản</span>
                <input {...register(`giftAccounts.${index}.accountName`)} />
              </label>
              <label className="editor-field">
                <span>Số tài khoản</span>
                <input {...register(`giftAccounts.${index}.accountNumber`)} />
              </label>
            </fieldset>
          ))}
        </div>
      </details>

      <details className="editor-section" open>
        <summary>
          <span>09</span>
          Nhạc nền
        </summary>
        <div className="editor-section__content">
          <label className="editor-upload">
            <span>Upload file nhạc</span>
            <input
              type="file"
              accept="audio/mpeg,audio/mp4,audio/wav,audio/ogg"
              onChange={(event) => void handleMusicUpload(event)}
            />
            <i>Hỗ trợ MP3, M4A, WAV hoặc OGG · tối đa 10 MB</i>
          </label>
          {musicUploadError && (
            <small className="editor-field__error">{musicUploadError}</small>
          )}
          <label className="editor-field">
            <span>Hoặc nhập URL file nhạc</span>
            <input
              type="url"
              {...register("music.src")}
              placeholder="https://example.com/wedding-song.mp3"
            />
          </label>
          <label className="editor-field">
            <span>Tên bài hát</span>
            <input {...register("music.title")} />
            <FieldError message={errors.music?.title?.message} />
          </label>
          <label className="editor-toggle">
            <input type="checkbox" {...register("music.autoplay")} />
            <span>
              <strong>Tự động phát</strong>
              <small>
                Nếu trình duyệt chặn autoplay, nhạc sẽ phát sau tương tác đầu
                tiên của khách.
              </small>
            </span>
          </label>
          {music.src && (
            <button
              className="editor-remove-button"
              type="button"
              onClick={() =>
                setValue("music.src", "", {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            >
              Xóa nhạc hiện tại
            </button>
          )}
        </div>
      </details>
    </form>
  )
}
