import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { LiveChatWidget } from '@/components/support/live-chat-widget'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BTC Trading Platform - Sàn giao dịch Bitcoin hàng đầu Việt Nam',
  description: 'Giao dịch Bitcoin và các loại tiền điện tử một cách an toàn, nhanh chóng với công nghệ blockchain tiên tiến',
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <LiveChatWidget />
        </ThemeProvider>
      </body>
    </html>
  )
}
