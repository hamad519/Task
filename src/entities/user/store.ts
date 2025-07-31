import { create } from 'zustand'
import type { User } from './types'

interface UserState {
  users: User[]
  loading: boolean
  error: string | null
  total: number
  page: number
  limit: number
  
  // Actions
  setUsers: (users: User[]) => void
  addUser: (user: User) => void
  updateUser: (id: string, updates: Partial<User>) => void
  removeUser: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setPagination: (page: number, limit: number, total: number) => void
  clearError: () => void
  refreshUsers: () => void
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,

  setUsers: (users) => set({ users }),
  
  addUser: (user) => set((state) => ({ 
    users: [user, ...state.users],
    total: state.total + 1
  })),
  
  updateUser: (id, updates) => set((state) => ({
    users: state.users.map(user => 
      user.id === id ? { ...user, ...updates } : user
    )
  })),
  
  removeUser: (id) => set((state) => ({
    users: state.users.filter(user => user.id !== id),
    total: Math.max(0, state.total - 1)
  })),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  setPagination: (page, limit, total) => set({ page, limit, total }),
  
  clearError: () => set({ error: null }),

  refreshUsers: () => {
    // This will be called to trigger a refetch from the parent component
    // The actual refetch logic is handled in the component
  }
})) 