import { z } from 'zod'

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "Ім'я має містити мінімум 2 символи"),
    lastName: z.string().min(2, 'Прізвище має містити мінімум 2 символи'),
    email: z.email('Невалідний формат email'),
    password: z
      .string()
      .min(8, 'Пароль має містити мінімум 8 символів')
      .regex(/[A-Z]/, 'Потрібна хоча б одна велика літера')
      .regex(/[0-9]/, 'Потрібна хоча б одна цифра'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Паролі не співпадають',
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z.email('Невалідний формат email'),
  password: z.string().min(8, 'Введіть пароль'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const createProductSchema = z.object({
  name: z.string().min(1, "Назва товару обов'язкова"),
  description: z.string().optional(),
  price: z.number({ error: 'Введіть ціну' }).positive('Ціна повинна бути більше 0'),
  categoryId: z.string().min(1, 'Виберіть категорію'),
  stock: z
    .number({ error: 'Введіть кількість' })
    .int('Кількість має бути цілим числом')
    .min(0, "Кількість не може бути від'ємною"),
  imageUrl: z.url('Невалідний URL зображення').or(z.literal('')).optional(),
})

export type CreateProductFormData = z.infer<typeof createProductSchema>
