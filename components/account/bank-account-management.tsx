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
import { Plus, Edit, Trash2, CreditCard, Shield, CheckCircle, AlertCircle, Star } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

interface BankAccount {
  id: string
  bankName: string
  bankCode: string
  accountNumber: string
  accountName: string
  isDefault: boolean
  isVerified: boolean
  createdAt: string
}

const vietnameseBanks = [
  { code: 'VCB', name: 'Vietcombank', fullName: 'Ngân hàng TMCP Ngoại thương Việt Nam' },
  { code: 'TCB', name: 'Techcombank', fullName: 'Ngân hàng TMCP Kỹ thương Việt Nam' },
  { code: 'BIDV', name: 'BIDV', fullName: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam' },
  { code: 'VTB', name: 'Vietinbank', fullName: 'Ngân hàng TMCP Công thương Việt Nam' },
  { code: 'ACB', name: 'ACB', fullName: 'Ngân hàng TMCP Á Châu' },
  { code: 'MB', name: 'MBBank', fullName: 'Ngân hàng TMCP Quân đội' },
  { code: 'TPB', name: 'TPBank', fullName: 'Ngân hàng TMCP Tiên Phong' },
  { code: 'VPB', name: 'VPBank', fullName: 'Ngân hàng TMCP Việt Nam Thịnh vượng' },
  { code: 'SHB', name: 'SHB', fullName: 'Ngân hàng TMCP Sài Gòn - Hà Nội' },
  { code: 'EIB', name: 'Eximbank', fullName: 'Ngân hàng TMCP Xuất Nhập khẩu Việt Nam' }
]

export function BankAccountManagement() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      bankName: 'Vietcombank',
      bankCode: 'VCB',
      accountNumber: '1234567890',
      accountName: 'NGUYEN VAN A',
      isDefault: true,
      isVerified: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      bankName: 'Techcombank',
      bankCode: 'TCB',
      accountNumber: '0987654321',
      accountName: 'NGUYEN VAN A',
      isDefault: false,
      isVerified: false,
      createdAt: '2024-01-20'
    }
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null)
  const [formData, setFormData] = useState({
    bankCode: '',
    accountNumber: '',
    accountName: ''
  })

  const handleAddAccount = () => {
    if (!formData.bankCode || !formData.accountNumber || !formData.accountName) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive"
      })
      return
    }

    const selectedBank = vietnameseBanks.find(bank => bank.code === formData.bankCode)
    if (!selectedBank) return

    const newAccount: BankAccount = {
      id: Date.now().toString(),
      bankName: selectedBank.name,
      bankCode: formData.bankCode,
      accountNumber: formData.accountNumber,
      accountName: formData.accountName.toUpperCase(),
      isDefault: bankAccounts.length === 0,
      isVerified: false,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setBankAccounts([...bankAccounts, newAccount])
    setFormData({ bankCode: '', accountNumber: '', accountName: '' })
    setIsAddDialogOpen(false)
    
    toast({
      title: "Thành công",
      description: "Đã thêm tài khoản ngân hàng. Vui lòng chờ xác thực.",
    })
  }

  const handleDeleteAccount = (id: string) => {
    setBankAccounts(bankAccounts.filter(account => account.id !== id))
    toast({
      title: "Đã xóa",
      description: "Tài khoản ngân hàng đã được xóa",
    })
  }

  const handleSetDefault = (id: string) => {
    setBankAccounts(bankAccounts.map(account => ({
      ...account,
      isDefault: account.id === id
    })))
    toast({
      title: "Đã cập nhật",
      description: "Đã đặt làm tài khoản mặc định",
    })
  }

  const handleVerifyAccount = (id: string) => {
    setBankAccounts(bankAccounts.map(account => 
      account.id === id ? { ...account, isVerified: true } : account
    ))
    toast({
      title: "Xác thực thành công",
      description: "Tài khoản ngân hàng đã được xác thực",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Tài khoản ngân hàng</h2>
          <p className="text-gray-400">Quản lý tài khoản ngân hàng để nạp và rút tiền</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Thêm tài khoản
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0F172A] border-[#1E293B] text-white">
            <DialogHeader>
              <DialogTitle>Thêm tài khoản ngân hàng</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bank">Ngân hàng</Label>
                <Select value={formData.bankCode} onValueChange={(value) => setFormData({...formData, bankCode: value})}>
                  <SelectTrigger className="bg-[#1E293B] border-[#334155] text-white">
                    <SelectValue placeholder="Chọn ngân hàng" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1E293B] border-[#334155]">
                    {vietnameseBanks.map((bank) => (
                      <SelectItem key={bank.code} value={bank.code} className="text-white hover:bg-[#334155]">
                        {bank.name} - {bank.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="accountNumber">Số tài khoản</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                  placeholder="Nhập số tài khoản"
                  className="bg-[#1E293B] border-[#334155] text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="accountName">Tên chủ tài khoản</Label>
                <Input
                  id="accountName"
                  value={formData.accountName}
                  onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                  placeholder="Nhập tên chủ tài khoản (viết hoa, không dấu)"
                  className="bg-[#1E293B] border-[#334155] text-white"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddAccount} className="bg-blue-600 hover:bg-blue-700">
                  Thêm tài khoản
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {bankAccounts.map((account) => (
          <Card key={account.id} className="bg-[#0F172A] border-[#1E293B]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-400" />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-white">{account.bankName}</h3>
                      {account.isDefault && (
                        <Badge className="bg-yellow-600 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Mặc định
                        </Badge>
                      )}
                      {account.isVerified ? (
                        <Badge className="bg-green-600 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Đã xác thực
                        </Badge>
                      ) : (
                        <Badge className="bg-orange-600 text-white">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Chờ xác thực
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-400">
                      {account.accountNumber} - {account.accountName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Thêm ngày: {new Date(account.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!account.isVerified && (
                    <Button
                      size="sm"
                      onClick={() => handleVerifyAccount(account.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Shield className="w-4 h-4 mr-1" />
                      Xác thực
                    </Button>
                  )}
                  
                  {!account.isDefault && account.isVerified && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetDefault(account.id)}
                      className="border-[#334155] text-gray-300 hover:text-white"
                    >
                      Đặt mặc định
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
                          Bạn có chắc chắn muốn xóa tài khoản ngân hàng này không? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-[#1E293B] border-[#334155] text-white hover:bg-[#334155]">
                          Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteAccount(account.id)}
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
        
        {bankAccounts.length === 0 && (
          <Card className="bg-[#0F172A] border-[#1E293B] border-dashed">
            <CardContent className="p-12 text-center">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Chưa có tài khoản ngân hàng</h3>
              <p className="text-gray-400 mb-4">Thêm tài khoản ngân hàng để có thể nạp và rút tiền</p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Thêm tài khoản đầu tiên
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Security Notice */}
      <Card className="bg-blue-600/10 border-blue-600/20">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-400 mb-1">Bảo mật tài khoản ngân hàng</h4>
              <ul className="text-sm text-blue-300 space-y-1">
                <li>• Tài khoản ngân hàng phải trùng tên với tài khoản CryptoTrade</li>
                <li>• Cần xác thực 2FA để thêm tài khoản ngân hàng mới</li>
                <li>• Tài khoản mới sẽ có giới hạn giao dịch trong 24h đầu</li>
                <li>• Chỉ có thể rút tiền về tài khoản đã xác thực</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
