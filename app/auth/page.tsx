'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AuthLayout } from '@/components/auth/auth-layout'
import { LoginInterface } from '@/components/auth/login-interface'
import { EnhancedRegisterForm } from '@/components/auth/enhanced-register-form'
import { OAuthErrorHandler } from '@/components/auth/oauth-error-handler'
import { useRouter } from 'next/navigation'

function AuthContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [currentView, setCurrentView] = useState<'login' | 'register'>(
    searchParams.get('tab') === 'register' ? 'register' : 'login'
  )

  const handleAuthSuccess = () => {
    router.push('/')
  }

  const handleSwitchView = (view: 'login' | 'register') => {
    setCurrentView(view)
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.set('tab', view)
    window.history.replaceState({}, '', newUrl.toString())
  }

  return (
    <AuthLayout>
      <OAuthErrorHandler />
      
      {currentView === 'login' ? (
        <LoginInterface
          onSuccess={handleAuthSuccess}
          onSwitchToRegister={() => handleSwitchView('register')}
        />
      ) : (
        <EnhancedRegisterForm
          onSuccess={handleAuthSuccess}
          onSwitchToLogin={() => handleSwitchView('login')}
        />
      )}
    </AuthLayout>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  )
}
