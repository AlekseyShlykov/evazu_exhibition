import { z } from "zod";

export const preorderSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(160),
  website: z.string().max(0, "Submission rejected.")
});

export type PreorderFormValues = z.infer<typeof preorderSchema>;
