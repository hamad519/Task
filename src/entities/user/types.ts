export type UserRole = 'admin' | 'user' | 'moderator'
export type UserStatus = 'active' | 'banned' | 'pending'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  createdAt: string
}

export interface CreateUserInput {
  name: string
  email: string
  role: UserRole
  status: UserStatus
}

export interface UpdateUserInput {
  name?: string
  email?: string
  role?: UserRole
  status?: UserStatus
}

export interface UsersResponse {
  data: User[]
  total: number
  page: number
  limit: number
}

export interface GetUsersVariables {
  page?: number
  limit?: number
  email?: string
  role?: UserRole
} 