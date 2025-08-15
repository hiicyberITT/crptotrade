'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Key, Smartphone, AlertTriangle, CheckCircle } from 'lucide-react'

export function SecurityFeatures() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [apiKeysEnabled, setApiKeysEnabled] = useState(false)
  const [withdrawalLimits, setWithdrawalLimits] = useState({
    daily: 10,
    monthly: 100
  })

  const securityLevels = [
    {
      level: 'Basic',
      features: ['Email verification', 'Password protection'],
      status: 'completed',
      color: 'green'
    },
    {
      level: 'Enhanced',
      features: ['2FA Authentication', 'SMS verification'],
      status: twoFactorEnabled ? 'completed' : 'pending',
      color: twoFactorEnabled ? 'green' : 'yellow'
    },
    {
      level: 'Advanced',
      features: ['Hardware wallet support', 'Multi-signature'],
      status: 'pending',
      color: 'red'
    }
  ]

  const recentSecurityEvents = [
    {
      id: '1',
      type: 'login',
      message: 'Successful login from Vietnam',
      timestamp: new Date(),
      severity: 'info'
    },
    {
      id: '2',
      type: 'withdrawal',
      message: 'Withdrawal request initiated',
      timestamp: new Date(Date.now() - 300000),
      severity: 'warning'
    },
    {
      id: '3',
      type: 'api',
      message: 'New API key generated',
      timestamp: new Date(Date.now() - 600000),
      severity: 'info'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {securityLevels.map((level, index) => (
          <Card key={index} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">{level.level} Security</h3>
                <Badge variant={level.status === 'completed' ? 'default' : 'outline'}>
                  {level.status === 'completed' ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 mr-1" />
                  )}
                  {level.status}
                </Badge>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {level.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      level.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Two-Factor Authentication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Two-Factor Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">2FA Status</p>
                <p className="text-sm text-muted-foreground">
                  {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <Badge variant={twoFactorEnabled ? 'default' : 'destructive'}>
                {twoFactorEnabled ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            {!twoFactorEnabled ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Enable 2FA to add an extra layer of security to your account
                </p>
                <Button 
                  onClick={() => setTwoFactorEnabled(true)}
                  className="w-full"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Enable 2FA
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    2FA is active and protecting your account
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setTwoFactorEnabled(false)}
                  className="w-full"
                >
                  Disable 2FA
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Keys Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              API Keys
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">API Access</p>
                <p className="text-sm text-muted-foreground">
                  Manage your trading API keys
                </p>
              </div>
              <Badge variant={apiKeysEnabled ? 'default' : 'outline'}>
                {apiKeysEnabled ? 'Active' : 'None'}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="api-name">API Key Name</Label>
                <Input 
                  id="api-name" 
                  placeholder="My Trading Bot"
                  className="bg-background border-border"
                />
              </div>
              <Button 
                onClick={() => setApiKeysEnabled(true)}
                className="w-full"
              >
                <Key className="w-4 h-4 mr-2" />
                Generate API Key
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal Limits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Withdrawal Limits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="daily-limit">Daily Limit (BTC)</Label>
                <Input 
                  id="daily-limit" 
                  type="number"
                  value={withdrawalLimits.daily}
                  onChange={(e) => setWithdrawalLimits(prev => ({
                    ...prev,
                    daily: parseFloat(e.target.value)
                  }))}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly-limit">Monthly Limit (BTC)</Label>
                <Input 
                  id="monthly-limit" 
                  type="number"
                  value={withdrawalLimits.monthly}
                  onChange={(e) => setWithdrawalLimits(prev => ({
                    ...prev,
                    monthly: parseFloat(e.target.value)
                  }))}
                  className="bg-background border-border"
                />
              </div>
              <Button variant="outline" className="w-full">
                Update Limits
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Recent Security Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSecurityEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg border-border">
                  <div className={`w-2 h-2 rounded-full ${
                    event.severity === 'info' ? 'bg-blue-500' : 
                    event.severity === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{event.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
