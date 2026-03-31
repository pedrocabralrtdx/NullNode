import { useStore } from '../contexts/StoreContext'
import { AuthPayload } from '../components/AuthPanel'
import { User } from '../types'

export function useAuth() {
  const { currentUser, setCurrentUser, setUsers, serverStatus } = useStore()

  const handleAuth = async (payload: AuthPayload) => {
    const updated: User = {
      ...currentUser,
      username: payload.username,
      handle: payload.handle
    }
    
    // Optimistic UI update
    setCurrentUser(updated)
    setUsers((prev) =>
      prev.map((user) =>
        user.id === currentUser.id ? { ...user, username: payload.username, handle: payload.handle } : user
      )
    )

    if (serverStatus === 'online') {
      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const data = await res.json()
        if (data.token) {
          localStorage.setItem('nullnode_token', data.token)
        }
      } catch (err) {
        console.error('Auth failed', err)
      }
    }
  }

  const handleFollow = async (userId: string) => {
    if (currentUser.followingIds.includes(userId)) return

    setCurrentUser((prev) => ({
      ...prev,
      followingIds: [...prev.followingIds, userId],
      following: prev.following + 1
    }))
    
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, followers: user.followers + 1 } : user
      )
    )

    if (serverStatus === 'online') {
      try {
        const token = localStorage.getItem('nullnode_token')
        await fetch('/api/users/follow', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ userId })
        })
      } catch (err) {
        console.error('Follow failed', err)
      }
    }
  }

  return {
    currentUser,
    handleAuth,
    handleFollow
  }
}
