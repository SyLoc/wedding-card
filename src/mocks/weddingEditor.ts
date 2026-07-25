import { GREEN_FLORAL_INVITATION } from "@/mocks/weddingInvitation"
import type { WeddingInvitation } from "@/types/wedding"
import { weddingInvitationSchema } from "@/validation/weddingInvitation"

const STORAGE_KEY = "green-floral-wedding-invitation"
const defaultDraft: WeddingInvitation = {
  ...structuredClone(GREEN_FLORAL_INVITATION),
  status: "draft",
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function loadWeddingInvitation(): WeddingInvitation {
  if (typeof window === "undefined") {
    return defaultDraft
  }

  try {
    const storedInvitation = window.localStorage.getItem(STORAGE_KEY)

    if (!storedInvitation) {
      return defaultDraft
    }

    const storedValue: unknown = JSON.parse(storedInvitation)

    if (!isRecord(storedValue)) {
      return defaultDraft
    }

    const storedCouple = storedValue.couple
    const storedGuest = storedValue.guest
    const storedMusic = storedValue.music

    const migratedValue = {
      ...storedValue,
      guest: isRecord(storedGuest)
        ? {
            ...storedGuest,
            group:
              typeof storedGuest.group === "string"
                ? storedGuest.group
                : defaultDraft.guest.group,
            salutation:
              typeof storedGuest.salutation === "string" &&
              storedGuest.salutation.trim()
                ? storedGuest.salutation
                : defaultDraft.guest.salutation,
          }
        : defaultDraft.guest,
      couple: isRecord(storedCouple)
        ? {
            ...storedCouple,
            eyebrow:
              typeof storedCouple.eyebrow === "string"
                ? storedCouple.eyebrow
                : defaultDraft.couple.eyebrow,
          }
        : defaultDraft.couple,
      music: isRecord(storedMusic)
        ? {
            ...defaultDraft.music,
            ...storedMusic,
          }
        : defaultDraft.music,
    }
    const result = weddingInvitationSchema.safeParse(migratedValue)
    return result.success ? result.data : defaultDraft
  } catch {
    return defaultDraft
  }
}

function persistWeddingInvitation(invitation: WeddingInvitation) {
  if (typeof window === "undefined") {
    return
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(invitation))
  } catch {
    // Keep the in-memory mock working when browser storage is unavailable or full.
  }
}

let weddingInvitationDraft = loadWeddingInvitation()

export function getMockWeddingInvitation(id: string): WeddingInvitation {
  if (id === "demo") {
    return structuredClone(GREEN_FLORAL_INVITATION)
  }

  return structuredClone({
    ...weddingInvitationDraft,
    id,
  })
}

export function updateMockWeddingInvitation(
  id: string,
  input: WeddingInvitation,
): WeddingInvitation {
  weddingInvitationDraft = structuredClone({
    ...input,
    id,
  })
  persistWeddingInvitation(weddingInvitationDraft)

  return structuredClone(weddingInvitationDraft)
}

export function publishMockWeddingInvitation(id: string): WeddingInvitation {
  weddingInvitationDraft = {
    ...weddingInvitationDraft,
    id,
    status: "published",
  }
  persistWeddingInvitation(weddingInvitationDraft)

  return structuredClone(weddingInvitationDraft)
}
