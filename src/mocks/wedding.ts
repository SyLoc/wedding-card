import type {
  CreateWeddingWishInput,
  WeddingRsvpConfirmation,
  WeddingRsvpInput,
  WeddingWish,
} from "@/types/wedding"

let nextWishId = 4
let nextRsvpId = 1

const weddingWishes: WeddingWish[] = [
  {
    id: "wish-1",
    guestName: "Minh Anh",
    message:
      "Chúc hai bạn luôn dịu dàng với nhau và cùng viết nên thật nhiều kỷ niệm đẹp.",
    createdAt: "2026-07-14T09:30:00+07:00",
  },
  {
    id: "wish-2",
    guestName: "Gia đình cô Lan",
    message:
      "Chúc đôi trẻ trăm năm hạnh phúc, một đời bình an và luôn ngập tràn tiếng cười.",
    createdAt: "2026-07-15T14:10:00+07:00",
  },
  {
    id: "wish-3",
    guestName: "Tuấn & Hạ",
    message: "Ngày vui thật trọn vẹn nhé. Hẹn gặp hai bạn tại bữa tiệc!",
    createdAt: "2026-07-16T20:45:00+07:00",
  },
]

export function getMockWeddingWishes(): WeddingWish[] {
  return [...weddingWishes].reverse()
}

export function createMockWeddingWish(
  input: CreateWeddingWishInput,
): WeddingWish {
  const wish: WeddingWish = {
    id: `wish-${nextWishId}`,
    guestName: input.guestName,
    message: input.message,
    createdAt: new Date().toISOString(),
  }

  nextWishId += 1
  weddingWishes.push(wish)
  return wish
}

export function createMockWeddingRsvp(
  input: WeddingRsvpInput,
): WeddingRsvpConfirmation {
  const confirmation: WeddingRsvpConfirmation = {
    ...input,
    id: `rsvp-${nextRsvpId}`,
    createdAt: new Date().toISOString(),
  }

  nextRsvpId += 1
  return confirmation
}
