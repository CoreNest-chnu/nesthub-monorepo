'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthControllerLoginUser } from '@repo/api-client'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useToggle } from 'usehooks-ts'
import { Field } from '@/src/components/field'
import {
  type LoginFormData,
  loginSchema,
} from '@/src/validation/validationSchema'

const LoginForm: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status } = useSession()
  const [showPassword, toggleShowPassword] = useToggle(false)

  const { mutateAsync: loginUser, isPending } = useAuthControllerLoginUser()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  })

  const onSubmit = useCallback(
    async (formValues: LoginFormData) => {
      if (status === 'authenticated') {
        toast.error('You are already authenticated')
        router.push('/')
        
        return
      }

      try {
        const { data: response } = await loginUser({ data: formValues })

        await signIn('credentials', {
          id: response.id,
          token: response.token,
          role: response.role,
          redirect: false,
        })

        toast.success('Вхід успішний')

        const returnUrl = searchParams.get('returnUrl')
        router.push(returnUrl ?? '/')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Помилка входу')
      }
    },
    [loginUser, router, searchParams, status],
  )

  const handleTogglePassword = useCallback(() => {
    toggleShowPassword()
  }, [toggleShowPassword])

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
            {'Вхід'}
          </h2>
          <p className={'text-sm text-gray-500'}>
            {'Увійдіть до свого облікового запису'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className={'flex flex-col gap-4'}
        >
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
                placeholder={'Ваш пароль'}
                autoComplete={'current-password'}
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

          <button
            type={'submit'}
            disabled={isPending}
            className={`mt-1 w-full text-white text-sm font-medium rounded-lg py-3 border-none font-[inherit] ${isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 cursor-pointer'}`}
          >
            {isPending ? 'Вхід…' : 'Увійти'}
          </button>
        </form>

        <p className={'text-center text-[13px] text-gray-500 mt-5'}>
          {'Немає акаунту? '}
          <Link href={'/register'} className={'text-gray-900 font-medium'}>
            {'Зареєструватися'}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginForm
