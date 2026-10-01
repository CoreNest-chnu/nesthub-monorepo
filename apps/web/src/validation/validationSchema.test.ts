import { describe, expect, it } from 'bun:test'
import {
  createProductSchema,
  loginSchema,
  registerSchema,
} from './validationSchema'

const firstError = (result: {
  success: boolean
  error?: { issues: { message: string }[] }
}) => result.error?.issues[0]?.message

describe('registerSchema', () => {
  const valid = {
    firstName: 'Іван',
    lastName: 'Петренко',
    email: 'ivan@example.com',
    password: 'Secret123',
    confirmPassword: 'Secret123',
  }

  it('accepts valid data', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects a password without an uppercase letter', () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: 'secret123',
      confirmPassword: 'secret123',
    })

    expect(firstError(result)).toBe('Потрібна хоча б одна велика літера')
  })

  it('rejects a password without a digit', () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: 'SecretPass',
      confirmPassword: 'SecretPass',
    })

    expect(firstError(result)).toBe('Потрібна хоча б одна цифра')
  })

  it('reports mismatched passwords on confirmPassword', () => {
    const result = registerSchema.safeParse({
      ...valid,
      confirmPassword: 'Other1234',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.path).toEqual(['confirmPassword'])
    expect(firstError(result)).toBe('Паролі не співпадають')
  })
})

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '12345678',
    })

    expect(result.success).toBe(true)
  })

  it('rejects an invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: '12345678',
    })

    expect(firstError(result)).toBe('Невалідний формат email')
  })
})

describe('createProductSchema', () => {
  const valid = {
    name: 'Футболка',
    price: 499,
    categoryId: 'cat-1',
    stock: 10,
  }

  it('accepts a product without an image', () => {
    expect(createProductSchema.safeParse(valid).success).toBe(true)
  })

  it('accepts an empty image URL', () => {
    const result = createProductSchema.safeParse({ ...valid, imageUrl: '' })

    expect(result.success).toBe(true)
  })

  it('rejects a non-positive price', () => {
    const result = createProductSchema.safeParse({ ...valid, price: 0 })

    expect(firstError(result)).toBe('Ціна повинна бути більше 0')
  })

  it('shows a custom message when price is not a number', () => {
    const result = createProductSchema.safeParse({
      ...valid,
      price: Number.NaN,
    })

    expect(firstError(result)).toBe('Введіть ціну')
  })

  it('rejects a fractional stock', () => {
    const result = createProductSchema.safeParse({ ...valid, stock: 1.5 })

    expect(firstError(result)).toBe('Кількість має бути цілим числом')
  })
})
