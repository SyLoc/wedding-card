import { z } from "zod"
import type { UserInput } from "@/types/user"

export const userInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  countryCode: z.string().min(1, "Country is required"),
}) satisfies z.ZodType<UserInput>
