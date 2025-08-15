'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Shield, CreditCard, MapPin, Settings, ArrowLeft, Bell, MessageCircle } from 'lucide-react'
import { ProfileSettings } from '@/components/account/profile-settings'
import { SecurityFeatures } from '@/components/security-features'
import { BankAccountManagement } from '@/components/account/bank-account-management'
import { WithdrawalAddresses } from '@/components/account/withdrawal-addresses'
import { UserSettings } from '@/components/account/user-settings'
import { getCurrentUser, isAuthenticated } from '@/lib/auth'
import type { User as UserType } from '@/lib/auth'
import Link from 'next/link'

export default function AccountPage() {
const [user, setUser] = useState<UserType | null>(null)
const [isLoggedIn, setIsLoggedIn] = useState(false)
const searchParams = useSearchParams()
const router = useRouter()
const pathname = usePathname()

const initialTab = searchParams.get("tab") ?? "profile"
const [activeTab, setActiveTab] = useState<string>(initialTab)

const handleTabChange = (value: string) => {
  setActiveTab(value)
  const params = new URLSearchParams(Array.from(searchParams.entries()))
  params.set("tab", value)
  router.replace(`${pathname}?${params.toString()}`)
}

useEffect(() => {
  const authenticated = isAuthenticated()
  const currentUser = getCurrentUser()
  
  setIsLoggedIn(authenticated)
  setUser(currentUser)
  
  if (!authenticated) {
    window.location.href = '/login'
  }
}, [])

if (!isLoggedIn || !user) {
  return (
    <div className="min-h-screen bg-[#0B1426] flex items-center justify-center">
      <div className="text-white">Đang tải...</div>
    </div>
  )
}

return (
  <div className="min-h-screen bg-[#0B1426] text-white">
    {/* Header */}
    <header className="border-b border-[#1E293B] bg-[#0F172A]">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CT</span>
            </div>
            <span className="text-xl font-bold text-white">Tài khoản</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="relative w-10 h-10 p-0 text-gray-300 hover:text-white">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                3
              </Badge>
            </Button>
            <Button variant="ghost" size="sm" className="w-10 h-10 p-0 text-gray-300 hover:text-white">
              <MessageCircle className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 pl-4 border-l border-[#334155]">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-xs text-gray-400">{user.email}</div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div className="container mx-auto px-6 py-8">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-[#1E293B] mb-8">
          <TabsTrigger 
            value="profile" 
            className="flex items-center space-x-2 text-gray-300 data-[state=active]:text-white"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Thông tin cá nhân</span>
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="flex items-center space-x-2 text-gray-300 data-[state=active]:text-white"
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Bảo mật</span>
          </TabsTrigger>
          <TabsTrigger 
            value="bank" 
            className="flex items-center space-x-2 text-gray-300 data-[state=active]:text-white"
          >
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Tài khoản ngân hàng</span>
          </TabsTrigger>
          <TabsTrigger 
            value="addresses" 
            className="flex items-center space-x-2 text-gray-300 data-[state=active]:text-white"
          >
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Địa chỉ rút tiền</span>
          </TabsTrigger>
          <TabsTrigger 
            value="settings" 
            className="flex items-center space-x-2 text-gray-300 data-[state=active]:text-white"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Cài đặt</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecurityFeatures />
        </TabsContent>

        <TabsContent value="bank" className="space-y-6">
          <BankAccountManagement />
        </TabsContent>

        <TabsContent value="addresses" className="space-y-6">
          <WithdrawalAddresses />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <UserSettings />
        </TabsContent>
      </Tabs>
    </div>
  </div>
)
}
