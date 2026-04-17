import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../../types'

type AuthState = {
  currentUser: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
  followToggle: (targetUserId: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      token: null,
      setAuth: (user, token) => set({ currentUser: user, token }),
      logout: () => set({ currentUser: null, token: null }),
      followToggle: (targetUserId) => {
        const { currentUser } = get()
        if (!currentUser) return

        const isFollowing = currentUser.followingIds.includes(targetUserId)
        const updatedFollowing = isFollowing
          ? currentUser.followingIds.filter((id: string) => id !== targetUserId)
          : [...currentUser.followingIds, targetUserId]

        set({ currentUser: { ...currentUser, followingIds: updatedFollowing } })
      }
    }),
    {
      name: 'nullnode-auth-storage',
    }
  )
)
