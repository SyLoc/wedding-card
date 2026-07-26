import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import {
  EditorHeader,
  type EditorSaveStatus,
} from '@/features/wedding/editor/components/EditorHeader'
import { WeddingEditorForm } from '@/features/wedding/editor/components/WeddingEditorForm'
import { WeddingEditorPreview } from '@/features/wedding/editor/components/WeddingEditorPreview'
import { useWeddingEditor } from '@/features/wedding/editor/hooks/useWeddingEditor'
import { GREEN_FLORAL_INVITATION } from '@/mocks/weddingInvitation'
import type { WeddingInvitation } from '@/types/wedding'
import { weddingInvitationSchema } from '@/validation/weddingInvitation'
import '@/features/wedding/editor/weddingEditor.css'
import { toHashRouteUrl } from '@/utils/url'

type MobilePanel = 'edit' | 'preview'

export function WeddingEditorPage() {
  const { invitationId: invitationIdParam } = useParams<{ invitationId: string }>()
  const invitationId = invitationIdParam ?? 'green-floral-demo'
  const { invitation, loading, error, saveInvitation, publishInvitation } =
    useWeddingEditor(invitationId)
  const form = useForm<WeddingInvitation>({
    resolver: zodResolver(weddingInvitationSchema),
    defaultValues: structuredClone(GREEN_FLORAL_INVITATION),
    mode: 'onBlur',
  })
  const draftInvitation = form.watch()
  const [activePanel, setActivePanel] = useState<MobilePanel>('edit')
  const [saveStatus, setSaveStatus] = useState<EditorSaveStatus>('loading')
  const [publishing, setPublishing] = useState(false)
  const hydratedRef = useRef(false)
  const lastSavedRef = useRef('')
  const pendingSaveRef = useRef('')

  useEffect(() => {
    if (!invitation) {
      return
    }

    const serializedInvitation = JSON.stringify(invitation)
    form.reset(invitation)
    lastSavedRef.current = serializedInvitation
    pendingSaveRef.current = ''
    hydratedRef.current = true
    setSaveStatus('saved')
  }, [form, invitation])

  useEffect(() => {
    if (!hydratedRef.current) {
      return
    }

    const serializedDraft = JSON.stringify(draftInvitation)

    if (
      serializedDraft === lastSavedRef.current ||
      serializedDraft === pendingSaveRef.current
    ) {
      return
    }

    setSaveStatus('saving')
    const timer = window.setTimeout(async () => {
      if (
        serializedDraft === lastSavedRef.current ||
        serializedDraft === pendingSaveRef.current
      ) {
        return
      }

      pendingSaveRef.current = serializedDraft
      const valid = await form.trigger()

      if (!valid) {
        pendingSaveRef.current = ''
        setSaveStatus('invalid')
        return
      }

      try {
        await saveInvitation(draftInvitation)
        lastSavedRef.current = serializedDraft
        pendingSaveRef.current = ''
        setSaveStatus('saved')
      } catch {
        pendingSaveRef.current = ''
        setSaveStatus('error')
      }
    }, 900)

    return () => window.clearTimeout(timer)
  }, [draftInvitation, form, saveInvitation])

  useEffect(() => {
    const serializedDraft = JSON.stringify(draftInvitation)
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hydratedRef.current && serializedDraft !== lastSavedRef.current) {
        event.preventDefault()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [draftInvitation])

  const handleSave = async (): Promise<boolean> => {
    const valid = await form.trigger()

    if (!valid) {
      setSaveStatus('invalid')
      setActivePanel('edit')
      return false
    }

    const values = form.getValues()
    const serializedValues = JSON.stringify(values)
    pendingSaveRef.current = serializedValues
    setSaveStatus('saving')

    try {
      await saveInvitation(values)
      lastSavedRef.current = serializedValues
      pendingSaveRef.current = ''
      setSaveStatus('saved')
      return true
    } catch {
      pendingSaveRef.current = ''
      setSaveStatus('error')
      return false
    }
  }

  const handlePublish = async () => {
    setPublishing(true)
    const saved = await handleSave()

    if (!saved) {
      setPublishing(false)
      return
    }

    try {
      const publishedInvitation = await publishInvitation()
      form.reset(publishedInvitation)
      lastSavedRef.current = JSON.stringify(publishedInvitation)
      setSaveStatus('saved')
    } catch {
      setSaveStatus('error')
    } finally {
      setPublishing(false)
    }
  }

  const handlePreview = async () => {
    const previewWindow = window.open('about:blank', '_blank')
    const saved = await handleSave()

    if (!saved) {
      previewWindow?.close()
      return
    }

    const previewUrl = toHashRouteUrl(`/wedding/${form.getValues('slug')}`)

    if (previewWindow) {
      previewWindow.opener = null
      previewWindow.location.href = previewUrl
      return
    }

    window.open(previewUrl, '_blank', 'noopener,noreferrer')
  }

  if (loading) {
    return <div className="wedding-editor-state">Đang mở trình chỉnh sửa…</div>
  }

  if (error || !invitation) {
    return (
      <div className="wedding-editor-state wedding-editor-state--error">
        <h1>Không thể mở thiệp</h1>
        <p>Vui lòng tải lại trang và thử lại.</p>
      </div>
    )
  }

  return (
    <FormProvider {...form}>
      <div className="wedding-editor-shell">
        <EditorHeader
          invitation={draftInvitation}
          saveStatus={saveStatus}
          publishing={publishing}
          onSave={() => void handleSave()}
          onPreview={() => void handlePreview()}
          onPublish={() => void handlePublish()}
        />

        <nav className="wedding-editor-mobile-tabs" aria-label="Chế độ editor">
          <button
            type="button"
            className={activePanel === 'edit' ? 'is-active' : ''}
            onClick={() => setActivePanel('edit')}
          >
            Chỉnh sửa
          </button>
          <button
            type="button"
            className={activePanel === 'preview' ? 'is-active' : ''}
            onClick={() => setActivePanel('preview')}
          >
            Xem trước
          </button>
        </nav>

        <main className="wedding-editor-layout">
          <section
            className={`wedding-editor-panel wedding-editor-panel--form${
              activePanel === 'edit' ? ' is-active' : ''
            }`}
          >
            <WeddingEditorForm />
          </section>
          <section
            className={`wedding-editor-panel wedding-editor-panel--preview${
              activePanel === 'preview' ? ' is-active' : ''
            }`}
          >
            <WeddingEditorPreview invitation={draftInvitation} />
          </section>
        </main>
      </div>
    </FormProvider>
  )
}
