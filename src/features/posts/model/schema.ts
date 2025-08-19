import { z } from "zod";

export const postFormSchema = z.object({
  title: z.string().min(3, "Мінімум 3 символи").max(120, "Максимум 120"),
  content: z.string().min(10, "Мінімум 10 символів"),
  tagsCsv: z.string().optional(),
});

export type PostFormValues = z.infer<typeof postFormSchema>;
