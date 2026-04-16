import { z } from "zod"

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "Ім'я має містити мінімум 2 символи"),
    lastName: z.string().min(2, "Прізвище має містити мінімум 2 символи"),
    email: z.email("Невалідний формат email"),
    password: z
      .string()
      .min(8, "Пароль має містити мінімум 8 символів")
      .regex(/[A-Z]/, "Потрібна хоча б одна велика літера")
      .regex(/[0-9]/, "Потрібна хоча б одна цифра"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Паролі не співпадають",
    path: ["confirmPassword"],
  })

export type RegisterFormData = z.infer<typeof registerSchema>
