'use client'

import { Suspense } from 'react'
import { LoginInterface } from '@/components/auth/login-interface'

function LoginPageContent() {
  const handleLoginSuccess = () => {
    // Redirect to dashboard or previous page
    const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '/'
    window.location.href = returnUrl
  }

  return <LoginInterface onSuccess={handleLoginSuccess} />
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}
