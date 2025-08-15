export const CoinIcon = ({ symbol, size = 32 }: { symbol: string; size?: number }) => {
  const iconStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size * 0.5,
    fontWeight: 'bold',
    color: 'white'
  }

  const getIconConfig = (symbol: string) => {
    switch (symbol.toLowerCase()) {
      case 'btc':
        return { bg: 'linear-gradient(135deg, #f7931a 0%, #ff8c00 100%)', text: '₿' }
      case 'eth':
        return { bg: 'linear-gradient(135deg, #627eea 0%, #4169e1 100%)', text: 'Ξ' }
      case 'bnb':
        return { bg: 'linear-gradient(135deg, #f3ba2f 0%, #ffd700 100%)', text: 'B' }
      case 'sol':
        return { bg: 'linear-gradient(135deg, #9945ff 0%, #14f195 100%)', text: 'S' }
      case 'ada':
        return { bg: 'linear-gradient(135deg, #0033ad 0%, #1e88e5 100%)', text: '₳' }
      case 'avax':
        return { bg: 'linear-gradient(135deg, #e84142 0%, #ff6b6b 100%)', text: 'A' }
      case 'dot':
        return { bg: 'linear-gradient(135deg, #e6007a 0%, #ff1493 100%)', text: '●' }
      case 'matic':
        return { bg: 'linear-gradient(135deg, #8247e5 0%, #9c27b0 100%)', text: 'M' }
      case 'link':
        return { bg: 'linear-gradient(135deg, #375bd2 0%, #2196f3 100%)', text: 'L' }
      case 'uni':
        return { bg: 'linear-gradient(135deg, #ff007a 0%, #e91e63 100%)', text: 'U' }
      case 'ltc':
        return { bg: 'linear-gradient(135deg, #bfbbbb 0%, #9e9e9e 100%)', text: 'Ł' }
      case 'atom':
        return { bg: 'linear-gradient(135deg, #2e3148 0%, #5c6bc0 100%)', text: '⚛' }
      case 'xrp':
        return { bg: 'linear-gradient(135deg, #23292f 0%, #546e7a 100%)', text: 'X' }
      case 'doge':
        return { bg: 'linear-gradient(135deg, #c2a633 0%, #ffeb3b 100%)', text: 'D' }
      case 'shib':
        return { bg: 'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)', text: 'S' }
      case 'trx':
        return { bg: 'linear-gradient(135deg, #ff060a 0%, #f44336 100%)', text: 'T' }
      case 'near':
        return { bg: 'linear-gradient(135deg, #00c08b 0%, #4caf50 100%)', text: 'N' }
      case 'ftm':
        return { bg: 'linear-gradient(135deg, #1969ff 0%, #2196f3 100%)', text: 'F' }
      case 'algo':
        return { bg: 'linear-gradient(135deg, #000000 0%, #424242 100%)', text: 'A' }
      case 'vet':
        return { bg: 'linear-gradient(135deg, #15bdff 0%, #03a9f4 100%)', text: 'V' }
      default:
        return { bg: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)', text: symbol.charAt(0).toUpperCase() }
    }
  }

  const config = getIconConfig(symbol)

  return (
    <div style={{ ...iconStyle, background: config.bg }}>
      {config.text}
    </div>
  )
}
