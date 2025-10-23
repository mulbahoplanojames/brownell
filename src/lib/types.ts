export type UserRole = "buyer" | "seller" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  location?: string
  avatar?: string
  createdAt: Date
}

export interface Breeder {
  id: string
  userId: string
  businessName: string
  verified: boolean
  rating: number
  totalReviews: number
  location: string
  phone: string
  email: string
  description?: string
  avatar?: string
}

export interface Puppy {
  id: string
  name: string
  breed: string
  age: number // in weeks
  price: number
  gender: "male" | "female"
  location: string
  description: string
  images: string[]
  breederId: string
  breeder: Breeder
  healthInfo: {
    vaccinated: boolean
    dewormed: boolean
    vetChecked: boolean
    healthCertificate: boolean
  }
  availability: "available" | "reserved" | "sold"
  size: "small" | "medium" | "large"
  color: string
  temperament: string[]
  createdAt: Date
}

export interface CartItem {
  puppyId: string
  puppy: Puppy
  quantity: number
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "confirmed" | "completed" | "cancelled"
  paymentMethod: "stripe" | "paypal" | "mobile-money"
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  createdAt: Date
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  puppyId?: string
  content: string
  read: boolean
  createdAt: Date
}
