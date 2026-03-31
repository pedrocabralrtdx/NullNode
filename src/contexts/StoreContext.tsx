import React, { createContext, useContext, useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import { Comment, Notification, Post, User } from '../types'
import {
  commentsByPost as seedCommentsByPost,
  currentUser as seedCurrentUser,
  liveDrops,
  notifications as seedNotifications,
  posts as seedPosts,
  users as seedUsers
} from '../data/seed'

export type ServerStatus = 'online' | 'offline' | 'connecting'

interface StoreContextValue {
  posts: Post[]
  users: User[]
  currentUser: User
  notifications: Notification[]
  commentsByPost: Record<string, Comment[]>
  serverStatus: ServerStatus
  isBooting: boolean
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>
  setCommentsByPost: React.Dispatch<React.SetStateAction<Record<string, Comment[]>>>
  setIsBooting: React.Dispatch<React.SetStateAction<boolean>>
}

const StoreContext = createContext<StoreContextValue | null>(null)

export const useStore = () => {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(seedPosts)
  const [users, setUsers] = useState<User[]>(seedUsers)
  const [currentUser, setCurrentUser] = useState<User>(seedCurrentUser)
  const [notifications, setNotifications] = useState<Notification[]>(seedNotifications)
  const [commentsByPost, setCommentsByPost] = useState<Record<string, Comment[]>>(seedCommentsByPost)
  const [serverStatus, setServerStatus] = useState<ServerStatus>('connecting')
  const [isBooting, setIsBooting] = useState(true)

  useEffect(() => {
    let active = true
    fetch('/api/boot')
      .then((res) => (res.ok ? res.json() : Promise.reject('Failed to boot')))
      .then((data) => {
        if (!active) return
        if (data?.posts) setPosts(data.posts)
        if (data?.users) setUsers(data.users)
        if (data?.currentUser) setCurrentUser(data.currentUser)
        if (data?.notifications) setNotifications(data.notifications)
        setServerStatus('online')
      })
      .catch((err) => {
        console.warn('Boot warning:', err)
        if (active) setServerStatus('offline')
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (serverStatus !== 'online') return
    const wsUrl = `ws://${window.location.hostname}:5174/ws`
    const socket = new WebSocket(wsUrl)

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data)
        if (payload.type === 'post') {
          setPosts((prev) => [payload.data, ...prev])
        }
        if (payload.type === 'notification') {
          setNotifications((prev) => [payload.data, ...prev])
        }
      } catch {
        // ignore malformed
      }
    }

    socket.onclose = () => {
      setServerStatus('offline')
    }

    return () => {
      socket.close()
    }
  }, [serverStatus])

  // Offline demo live drops
  useEffect(() => {
    if (serverStatus !== 'offline') return
    const interval = setInterval(() => {
      const drop = liveDrops[Math.floor(Math.random() * liveDrops.length)]
      const livePost: Post = {
        id: nanoid(),
        userId: 'u3',
        username: 'Echo Drift',
        handle: '@echod',
        avatar: 'ED',
        content: drop,
        timestamp: new Date().toISOString(),
        likes: Math.floor(Math.random() * 80) + 12,
        comments: Math.floor(Math.random() * 12),
        reposts: Math.floor(Math.random() * 18)
      }
      setPosts((prev) => [livePost, ...prev])
    }, 14000)

    return () => clearInterval(interval)
  }, [serverStatus])

  return (
    <StoreContext.Provider
      value={{
        posts,
        users,
        currentUser,
        notifications,
        commentsByPost,
        serverStatus,
        isBooting,
        setPosts,
        setUsers,
        setCurrentUser,
        setCommentsByPost,
        setIsBooting
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}
