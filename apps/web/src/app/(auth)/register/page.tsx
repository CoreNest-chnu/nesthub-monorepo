'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import omit from 'lodash/omit'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import Link from 'next/link'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useToggle } from 'usehooks-ts'
import { Field } from '@/src/components/Field'
import {
  type RegisterFormData,
  registerSchema,
} from '@/src/validation/validationSchema'

export const RegisterPage: React.FC = () => {
  const [isPending, setIsPending] = useToggle(false)
  const [showPassword, toggleShowPassword] = useToggle(false)
  const [showConfirm, toggleShowConfirm] = useToggle(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  })

  const onSubmit = useCallback(
    async (data: RegisterFormData) => {
      const payload = omit(data, 'confirmPassword')
      setIsPending()
      try {
        await new Promise((res) => setTimeout(res, 1200))
        console.log('POST /auth/register →', payload)
      } finally {
        setIsPending()
      }
    },
    [setIsPending],
  )

  const handleTogglePassword = useCallback(() => {
    toggleShowPassword()
  }, [toggleShowPassword])

  const handleToggleConfirm = useCallback(() => {
    toggleShowConfirm()
  }, [toggleShowConfirm])

  return (
    <div
      className={
        'min-h-screen bg-gray-100 flex items-center justify-center p-6'
      }
    >
      <div
        className={
          'w-full max-w-[480px] bg-white rounded-2xl border border-gray-200 p-10 shadow-md'
        }
      >
        <div className={'text-center mb-7'}>
          <h2 className={'text-[22px] font-semibold text-gray-900 mb-1.5'}>
            {'Реєстрація'}
          </h2>
          <p className={'text-sm text-gray-500'}>
            {'Створіть обліковий запис'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className={'flex flex-col gap-4'}
        >
          <Field
            htmlFor={'firstName'}
            label={"Ім'я"}
            error={errors.firstName?.message}
          >
            <div
              className={`flex items-center gap-2 border rounded-lg px-3 h-[42px] ${errors.firstName ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
            >
              <User size={15} className={'text-gray-400 shrink-0'} />
              <input
                id={'firstName'}
                {...register('firstName')}
                type={'text'}
                placeholder={'Іван'}
                autoComplete={'given-name'}
                className={
                  'flex-1 border-none outline-none text-sm bg-transparent text-gray-900 font-[inherit]'
                }
              />
            </div>
          </Field>

          <Field
            htmlFor={'lastName'}
            label={'Прізвище'}
            error={errors.lastName?.message}
          >
            <div
              className={`flex items-center gap-2 border rounded-lg px-3 h-[42px] ${errors.lastName ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
            >
              <User size={15} className={'text-gray-400 shrink-0'} />
              <input
                id={'lastName'}
                {...register('lastName')}
                type={'text'}
                placeholder={'Петренко'}
                autoComplete={'family-name'}
                className={
                  'flex-1 border-none outline-none text-sm bg-transparent text-gray-900 font-[inherit]'
                }
              />
            </div>
          </Field>

          <Field
            htmlFor={'email'}
            label={'Email'}
            error={errors.email?.message}
          >
            <div
              className={`flex items-center gap-2 border rounded-lg px-3 h-[42px] ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
            >
              <Mail size={15} className={'text-gray-400 shrink-0'} />
              <input
                id={'email'}
                {...register('email')}
                type={'email'}
                placeholder={'email@example.com'}
                autoComplete={'email'}
                className={
                  'flex-1 border-none outline-none text-sm bg-transparent text-gray-900 font-[inherit]'
                }
              />
            </div>
          </Field>

          <Field
            htmlFor={'password'}
            label={'Пароль'}
            error={errors.password?.message}
          >
            <div
              className={`flex items-center gap-2 border rounded-lg px-3 h-[42px] ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
            >
              <Lock size={15} className={'text-gray-400 shrink-0'} />
              <input
                id={'password'}
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder={'Мінімум 8 символів'}
                autoComplete={'new-password'}
                className={
                  'flex-1 border-none outline-none text-sm bg-transparent text-gray-900 font-[inherit]'
                }
              />
              <button
                type={'button'}
                onClick={handleTogglePassword}
                className={
                  'bg-transparent border-none cursor-pointer p-0 flex text-gray-400'
                }
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </Field>

          <Field
            htmlFor={'confirmPassword'}
            label={'Підтвердження пароля'}
            error={errors.confirmPassword?.message}
          >
            <div
              className={`flex items-center gap-2 border rounded-lg px-3 h-[42px] ${errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
            >
              <Lock size={15} className={'text-gray-400 shrink-0'} />
              <input
                id={'confirmPassword'}
                {...register('confirmPassword')}
                type={showConfirm ? 'text' : 'password'}
                placeholder={'Повторіть пароль'}
                autoComplete={'new-password'}
                className={
                  'flex-1 border-none outline-none text-sm bg-transparent text-gray-900 font-[inherit]'
                }
              />
              <button
                type={'button'}
                onClick={handleToggleConfirm}
                className={
                  'bg-transparent border-none cursor-pointer p-0 flex text-gray-400'
                }
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </Field>

          <button
            type={'submit'}
            disabled={isPending}
            className={`mt-1 w-full text-white text-sm font-medium rounded-lg py-3 border-none font-[inherit] ${isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 cursor-pointer'}`}
          >
            {isPending ? 'Реєстрація…' : 'Зареєструватися'}
          </button>
        </form>

        <p className={'text-center text-[13px] text-gray-500 mt-5'}>
          {'Вже є акаунт? '}
          <Link href={'/login'} className={'text-gray-900 font-medium'}>
            {'Увійти'}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
