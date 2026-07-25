export type WeddingTemplateMode = "public" | "preview"

export interface WeddingPartner {
  name: string
  role: string
  description: string
}

export interface WeddingFamily {
  side: string
  father: string
  mother: string
  address: string
}

export interface WeddingEvent {
  id: string
  title: string
  dateTime: string
  lunarDate: string
  venue: string
  address: string
  mapUrl: string
}

export interface WeddingGalleryImage {
  id: string
  src: string
  alt: string
  position: string
}

export interface WeddingGiftAccount {
  id: string
  label: string
  bankName: string
  accountName: string
  accountNumber: string
}

export interface WeddingGuestPersonalization {
  name: string
  group: string
  salutation: string
  couplePronoun: string
}

export interface WeddingMusicSettings {
  src: string
  title: string
  autoplay: boolean
}

export interface WeddingInvitation {
  id: string
  slug: string
  templateId: "boho_floral_green"
  status: "draft" | "published"
  couple: {
    eyebrow: string
    first: WeddingPartner
    second: WeddingPartner
  }
  families: WeddingFamily[]
  events: WeddingEvent[]
  gallery: WeddingGalleryImage[]
  giftAccounts: WeddingGiftAccount[]
  guest: WeddingGuestPersonalization
  music: WeddingMusicSettings
  heroImage: string
  eyebrow: string
  invitationTitle: string
  quote: string
  story: string
  closingMessage: string
}

export interface WeddingRsvpInput {
  guestName: string
  attendance: "ATTENDING" | "DECLINED"
  guestCount: number
  message: string
}

export interface WeddingRsvpConfirmation extends WeddingRsvpInput {
  id: string
  createdAt: string
}

export interface SubmitWeddingRsvpVariables {
  input: WeddingRsvpInput
}

export interface SubmitWeddingRsvpData {
  submitWeddingRsvp: WeddingRsvpConfirmation
}

export interface WeddingWish {
  id: string
  guestName: string
  message: string
  createdAt: string
}

export interface CreateWeddingWishInput {
  guestName: string
  message: string
}

export interface CreateWeddingWishVariables {
  input: CreateWeddingWishInput
}

export interface CreateWeddingWishData {
  createWeddingWish: WeddingWish
}

export interface GetWeddingWishesData {
  weddingWishes: WeddingWish[]
}

export interface GetWeddingInvitationVariables {
  id: string
}

export interface GetWeddingInvitationData {
  weddingInvitation: WeddingInvitation
}

export interface UpdateWeddingInvitationVariables {
  id: string
  input: WeddingInvitation
}

export interface UpdateWeddingInvitationData {
  updateWeddingInvitation: WeddingInvitation
}

export interface PublishWeddingInvitationVariables {
  id: string
}

export interface PublishWeddingInvitationData {
  publishWeddingInvitation: WeddingInvitation
}
