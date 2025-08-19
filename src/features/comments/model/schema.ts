import { z } from "zod";

export const commentFormSchema = z.object({
  text: z.string().min(2, "Мінімум 2 символи").max(1000, "Максимум 1000"),
});

export type CommentFormValues = z.infer<typeof commentFormSchema>;
