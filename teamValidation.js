import { z } from 'zod'
const teamNameRegex = /^[\w]+$/

export const teamValidator = z.object({
  teamName: z
    .string()
    .toLowerCase()
    .trim()
    .min(4)
    .max(25)
    .refine(value => teamNameRegex.test(value), {
      message: "Username should not contain any special characters other than '_'"}),
  email: z
    .string()
    .toLowerCase()
    .email(),
  sapId: z
    .string()
    .length(9),
  phoneNumber: z
    .string()
    .length(10),
  alternateNumber: z
    .string()
    .length(10),
})