export type ViewKey = 'home' | 'explore' | 'network' | 'terminal' | 'notifications' | 'profile'

export type User = {
  id: string
  username: string
  handle: string
  avatar: string
  bio: string
  followers: number
  following: number
  followingIds: string[]
}

export type Post = {
  id: string
  userId: string
  username: string
  handle: string
  avatar: string
  content: string
  timestamp: string
  likes: number
  comments: number
  reposts: number
  liked?: boolean
  reposted?: boolean
}

export type Comment = {
  id: string
  postId: string
  userId: string
  username: string
  handle: string
  avatar: string
  content: string
  timestamp: string
}

export type Notification = {
  id: string
  title: string
  detail: string
  timestamp: string
  tone: 'info' | 'warning' | 'success'
}

export type Trend = {
  id: string
  topic: string
  mentions: string
}

export type Activity = {
  id: string
  label: string
  detail: string
  timestamp: string
}
