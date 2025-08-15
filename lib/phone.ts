type ValidationResult = {
  isValid: boolean
  message: string
  normalizedLocal?: string // 0XXXXXXXXX
  e164?: string // +84XXXXXXXXX
}

const VALID_PREFIXES = ["03", "05", "07", "08", "09"]

export function validateVNPhone(input: string): ValidationResult {
  if (!input || !input.trim()) {
    return { isValid: false, message: "Vui lòng nhập số điện thoại." }
  }

  // Keep only digits and optional leading +
  const sanitized = input.replace(/[^\d+]/g, "")
  let local = ""

  if (sanitized.startsWith("+84")) {
    const withoutCC = sanitized.slice(3) // drop +84
    if (withoutCC.length !== 9) {
      return { isValid: false, message: "Định dạng +84 cần 9 chữ số phía sau (VD: +84912345678)." }
    }
    local = "0" + withoutCC
  } else if (/^84\d+$/.test(sanitized)) {
    const withoutCC = sanitized.slice(2)
    if (withoutCC.length !== 9) {
      return { isValid: false, message: "Định dạng 84 cần 9 chữ số phía sau (VD: 84912345678)." }
    }
    local = "0" + withoutCC
  } else if (sanitized.startsWith("0")) {
    local = sanitized
  } else {
    return { isValid: false, message: "Số điện thoại phải bắt đầu bằng 0 hoặc +84." }
  }

  if (!/^\d{10}$/.test(local)) {
    return { isValid: false, message: "Số điện thoại phải có 10 chữ số (VD: 0912345678)." }
  }

  const prefix = local.slice(0, 2)
  if (!VALID_PREFIXES.includes(prefix)) {
    return { isValid: false, message: "Đầu số không hợp lệ. Hỗ trợ 03, 05, 07, 08, 09." }
  }

  const e164 = "+84" + local.slice(1)
  return { isValid: true, message: "Số hợp lệ.", normalizedLocal: local, e164 }
}
