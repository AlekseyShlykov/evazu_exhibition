import { z } from "zod";

export const guestbookSchema = z.object({
  displayName: z.string().trim().max(60).optional(),
  message: z.string().trim().min(4, "Please leave a slightly longer note.").max(600),
  favouriteArtworkId: z.string().max(80).optional(),
  website: z.string().max(0, "Submission rejected.")
});

export type GuestbookFormValues = z.infer<typeof guestbookSchema>;
