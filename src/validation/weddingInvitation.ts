import { z } from "zod"
import type { WeddingInvitation } from "@/types/wedding"

const requiredText = z.string().trim().min(1, "Thông tin này là bắt buộc")

const partnerSchema = z.object({
  name: requiredText,
  role: requiredText,
  description: requiredText,
})

const familySchema = z.object({
  side: requiredText,
  father: requiredText,
  mother: requiredText,
  address: requiredText,
})

const eventSchema = z.object({
  id: requiredText,
  title: requiredText,
  dateTime: requiredText,
  lunarDate: z.string(),
  venue: requiredText,
  address: requiredText,
  mapUrl: z.url("Đường dẫn bản đồ chưa hợp lệ"),
})

const galleryImageSchema = z.object({
  id: requiredText,
  src: requiredText,
  alt: requiredText,
  position: requiredText,
})

const giftAccountSchema = z.object({
  id: requiredText,
  label: requiredText,
  bankName: requiredText,
  accountName: requiredText,
  accountNumber: requiredText,
})

export const weddingInvitationSchema = z.object({
  id: requiredText,
  slug: z
    .string()
    .trim()
    .min(1, "Đường dẫn thiệp là bắt buộc")
    .regex(/^[a-z0-9-]+$/, "Chỉ dùng chữ thường, số và dấu gạch ngang"),
  templateId: z.literal("boho_floral_green"),
  status: z.enum(["draft", "published"]),
  couple: z.object({
    eyebrow: requiredText,
    first: partnerSchema,
    second: partnerSchema,
  }),
  families: z.array(familySchema).min(2),
  events: z.array(eventSchema).min(1),
  gallery: z.array(galleryImageSchema).min(1),
  giftAccounts: z.array(giftAccountSchema),
  guest: z.object({
    name: z.string().trim(),
    group: z.string().trim(),
    salutation: requiredText,
    couplePronoun: requiredText,
  }),
  music: z.object({
    src: z.string().trim(),
    title: requiredText,
    autoplay: z.boolean(),
  }),
  heroImage: requiredText,
  eyebrow: requiredText,
  invitationTitle: requiredText,
  quote: requiredText,
  story: requiredText,
  closingMessage: requiredText,
}) satisfies z.ZodType<WeddingInvitation>
