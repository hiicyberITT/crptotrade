'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Copy, Trash2, Wallet, Shield, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

interface WithdrawalAddress {
  id: string
  currency: string
  network: string
  address: string
  label: string
  isWhitelisted: boolean
  isVerified: boolean
  createdAt: string
  lastUsed?: string
}

const supportedCurrencies = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    networks: [
      { code: 'BTC', name: 'Bitcoin', fee: '0.0005 BTC' }
    ]
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    networks: [
      { code: 'ERC20', name: 'Ethereum (ERC20)', fee: '0.005 ETH' },
      { code: 'BSC', name: 'BNB Smart Chain (BEP20)', fee: '0.001 ETH' },
      { code: 'POLYGON', name: 'Polygon', fee: '0.001 ETH' }
    ]
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    networks: [
      { code: 'ERC20', name: 'Ethereum (ERC20)', fee: '5 USDT' },
      { code: 'TRC20', name: 'TRON (TRC20)', fee: '1 USDT' },
      { code: 'BSC', name: 'BNB Smart Chain (BEP20)', fee: '1 USDT' },
      { code: 'POLYGON', name: 'Polygon', fee: '1 USDT' }
    ]
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    networks: [
      { code: 'ERC20', name: 'Ethereum (ERC20)', fee: '5 USDC' },
      { code: 'BSC', name: 'BNB Smart Chain (BEP20)', fee: '1 USDC' },
      { code: 'POLYGON', name: 'Polygon', fee: '1 USDC' }
    ]
  }
]

export function WithdrawalAddresses() {
  const [addresses, setAddresses] = useState<WithdrawalAddress[]>([
    {
      id: '1',
      currency: 'BTC',
      network: 'BTC',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      label: 'My Ledger Wallet',
      isWhitelisted: true,
      isVerified: true,
      createdAt: '2024-01-15',
      lastUsed: '2024-01-20'
    },
    {
      id: '2',
      currency: 'ETH',
      network: 'ERC20',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b5',
      label: 'MetaMask Wallet',
      isWhitelisted: false,
      isVerified: false,
      createdAt: '2024-01-22'
    }
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    currency: '',
    network: '',
    address: '',
    label: ''
  })

  const selectedCurrency = supportedCurrencies.find(c => c.symbol === formData.currency)

  const validateAddress = (address: string, currency: string, network: string) => {
    // Basic validation - in real app, use proper address validation
    if (!address) return false
    
    if (currency === 'BTC' && network === 'BTC') {
      return address.match(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/) || address.match(/^bc1[a-z0-9]{39,59}$/)
    }
    
    if (network === 'ERC20' || network === 'BSC' || network === 'POLYGON') {
      return address.match(/^0x[a-fA-F0-9]{40}$/)
    }
    
    if (network === 'TRC20') {
      return address.match(/^T[A-Za-z1-9]{33}$/)
    }
    
    return true
  }

  const handleAddAddress = () => {
    if (!formData.currency || !formData.network || !formData.address || !formData.label) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive"
      })
      return
    }

    if (!validateAddress(formData.address, formData.currency, formData.network)) {
      toast({
        title: "Địa chỉ không hợp lệ",
        description: "Vui lòng kiểm tra lại định dạng địa chỉ",
        variant: "destructive"
      })
      return
    }

    const newAddress: WithdrawalAddress = {
      id: Date.now().toString(),
      currency: formData.currency,
      network: formData.network,
      address: formData.address,
      label: formData.label,
      isWhitelisted: false,
      isVerified: false,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setAddresses([...addresses, newAddress])
    setFormData({ currency: '', network: '', address: '', label: '' })
    setIsAddDialogOpen(false)
    
    toast({
      title: "Thành công",
      description: "Địa chỉ rút tiền đã được thêm. Sẽ được kích hoạt sau 24h.",
    })
  }

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id))
    toast({
      title: "Đã xóa",
      description: "Địa chỉ rút tiền đã được xóa",
    })
  }

  const handleWhitelistAddress = (id: string) => {
    setAddresses(addresses.map(addr => 
      addr.id === id ? { ...addr, isWhitelisted: true, isVerified: true } : addr
    ))
    toast({
      title: "Đã thêm vào whitelist",
      description: "Địa chỉ đã được xác thực và thêm vào danh sách an toàn",
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Đã sao chép",
      description: "Địa chỉ đã được sao chép vào clipboard",
    })
  }

  const getCurrencyIcon = (currency: string) => {
    const icons: { [key: string]: string } = {
      'BTC': '₿',
      'ETH': 'Ξ',
      'USDT': '₮',
      'USDC': '$'
    }
    return icons[currency] || '🪙'
  }

  const getNetworkColor = (network: string) => {
    const colors: { [key: string]: string } = {
      'BTC': 'bg-orange-600',
      'ERC20': 'bg-blue-600',
      'BSC': 'bg-yellow-600',
      'TRC20': 'bg-red-600',
      'POLYGON': 'bg-purple-600'
    }
    return colors[network] || 'bg-gray-600'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Địa chỉ rút tiền</h2>
          <p className="text-gray-400">Quản lý địa chỉ ví để rút tiền điện tử</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Thêm địa chỉ
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0F172A] border-[#1E293B] text-white max-w-md">
            <DialogHeader>
              <DialogTitle>Thêm địa chỉ rút tiền</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="currency">Loại tiền</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData({...formData, currency: value, network: ''})}>
                  <SelectTrigger className="bg-[#1E293B] border-[#334155] text-white">
                    <SelectValue placeholder="Chọn loại tiền" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1E293B] border-[#334155]">
                    {supportedCurrencies.map((currency) => (
                      <SelectItem key={currency.symbol} value={currency.symbol} className="text-white hover:bg-[#334155]">
                        {getCurrencyIcon(currency.symbol)} {currency.symbol} - {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedCurrency && (
                <div>
                  <Label htmlFor="network">Mạng lưới</Label>
                  <Select value={formData.network} onValueChange={(value) => setFormData({...formData, network: value})}>
                    <SelectTrigger className="bg-[#1E293B] border-[#334155] text-white">
                      <SelectValue placeholder="Chọn mạng lưới" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1E293B] border-[#334155]">
                      {selectedCurrency.networks.map((network) => (
                        <SelectItem key={network.code} value={network.code} className="text-white hover:bg-[#334155]">
                          {network.name} (Phí: {network.fee})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <Label htmlFor="address">Địa chỉ ví</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Nhập địa chỉ ví"
                  className="bg-[#1E293B] border-[#334155] text-white font-mono text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="label">Nhãn địa chỉ</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({...formData, label: e.target.value})}
                  placeholder="VD: My Ledger Wallet"
                  className="bg-[#1E293B] border-[#334155] text-white"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddAddress} className="bg-blue-600 hover:bg-blue-700">
                  Thêm địa chỉ
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {addresses.map((address) => (
          <Card key={address.id} className="bg-[#0F172A] border-[#1E293B]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl">{getCurrencyIcon(address.currency)}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-white">{address.label}</h3>
                      <Badge className={getNetworkColor(address.network) + ' text-white'}>
                        {address.network}
                      </Badge>
                      {address.isWhitelisted ? (
                        <Badge className="bg-green-600 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Whitelist
                        </Badge>
                      ) : (
                        <Badge className="bg-orange-600 text-white">
                          <Clock className="w-3 h-3 mr-1" />
                          Chờ 24h
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <code className="text-sm text-gray-300 bg-[#1E293B] px-2 py-1 rounded">
                        {address.address.slice(0, 20)}...{address.address.slice(-10)}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(address.address)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                      <span>Thêm: {new Date(address.createdAt).toLocaleDateString('vi-VN')}</span>
                      {address.lastUsed && (
                        <span>Dùng lần cuối: {new Date(address.lastUsed).toLocaleDateString('vi-VN')}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!address.isWhitelisted && (
                    <Button
                      size="sm"
                      onClick={() => handleWhitelistAddress(address.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Shield className="w-4 h-4 mr-1" />
                      Whitelist
                    </Button>
                  )}
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#0F172A] border-[#1E293B] text-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          Bạn có chắc chắn muốn xóa địa chỉ rút tiền này không? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-[#1E293B] border-[#334155] text-white hover:bg-[#334155]">
                          Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteAddress(address.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Xóa
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {addresses.length === 0 && (
          <Card className="bg-[#0F172A] border-[#1E293B] border-dashed">
            <CardContent className="p-12 text-center">
              <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Chưa có địa chỉ rút tiền</h3>
              <p className="text-gray-400 mb-4">Thêm địa chỉ ví để có thể rút tiền điện tử</p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Thêm địa chỉ đầu tiên
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Security Notice */}
      <Card className="bg-orange-600/10 border-orange-600/20">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-400 mb-1">Lưu ý bảo mật</h4>
              <ul className="text-sm text-orange-300 space-y-1">
                <li>• Địa chỉ mới cần chờ 24h trước khi có thể rút tiền</li>
                <li>• Địa chỉ chưa whitelist có giới hạn rút tiền thấp</li>
                <li>• Kiểm tra kỹ địa chỉ và mạng lưới trước khi rút tiền</li>
                <li>• Giao dịch blockchain không thể hoàn tác</li>
                <li>• Cần xác thực 2FA để thêm địa chỉ mới</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
