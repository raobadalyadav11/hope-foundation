import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key', {
  apiVersion: '2025-11-17.clover',
})

export default stripe

// Currency conversion utility
const exchangeRates = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
}

// Convert amount from one currency to another
export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  const fromRate = exchangeRates[fromCurrency as keyof typeof exchangeRates] || 1
  const toRate = exchangeRates[toCurrency as keyof typeof exchangeRates] || 1
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / fromRate
  return Math.round(usdAmount * toRate)
}

// Get currency symbol
export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
  }
  return symbols[currency] || currency
}

// Format currency amount
export function formatCurrency(amount: number, currency: string): string {
  const symbol = getCurrencySymbol(currency)
  const formattedAmount = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: currency === 'INR' ? 0 : 2,
    maximumFractionDigits: currency === 'INR' ? 0 : 2,
  }).format(amount)
  
  return `${symbol}${formattedAmount}`
}

// Select payment gateway based on currency and location
export function selectPaymentGateway(currency: string, userCountry?: string): 'razorpay' | 'stripe' {
  // Use Razorpay for INR transactions (India-focused)
  if (currency === 'INR') {
    return 'razorpay'
  }
  
  // Use Stripe for international transactions
  return 'stripe'
}