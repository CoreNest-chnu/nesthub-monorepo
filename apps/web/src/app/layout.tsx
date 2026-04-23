import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Providers } from './providers'
import { Nunito_Sans } from 'next/font/google'
import { cn } from '@/src/lib/utils'
import { Header } from '../components/header'

const nunitoSans = Nunito_Sans({ subsets: ['latin'], variable: '--font-sans' })

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'NestHub',
  description: 'Created by CoreNest Team',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang={'en'}
      className={cn('font-sans', 'font-sans', nunitoSans.variable)}
    >
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <div className={'min-h-screen flex flex-col'}>
            <Header />
            <main className={'flex-1 flex flex-col'}>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
