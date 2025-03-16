
import { z } from "zod";

export const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  nickname: z.string().optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  gender: z.string(),
  dateOfBirth: z.string().optional(),
  birthCity: z.string().optional(),
  birthState: z.string().optional(),
  birthCountry: z.string().optional(),
  currentCity: z.string().optional(),
  currentState: z.string().optional(),
  currentCountry: z.string().optional(),
  gotra: z.string().optional(),
  pravara: z.string().optional(),
  occupation: z.string().optional(),
  company: z.string().optional(),
  industry: z.string().optional(),
  primaryLanguage: z.string().optional(),
  secondaryLanguage: z.string().optional(),
  community: z.string().optional(),
  hideEmail: z.boolean().default(false),
  hidePhone: z.boolean().default(false),
  hideDob: z.boolean().default(false),
  bio: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
