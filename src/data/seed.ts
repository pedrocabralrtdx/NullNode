import type { Activity, Comment, Notification, Post, Trend, User } from '../types'

const now = Date.now()
const minutes = (value: number) => new Date(now - value * 60 * 1000).toISOString()

export const currentUser: User = {
  id: 'u0',
  username: 'Astra Vega',
  handle: '@astra',
  avatar: 'AV',
  bio: 'Founder of NullNode. Mapping the pulse of the network in neon and noise.',
  followers: 18240,
  following: 342,
  followingIds: ['u1', 'u2', 'u3']
}

export const users: User[] = [
  currentUser,
  {
    id: 'u1',
    username: 'Cipher Bloom',
    handle: '@cipherb',
    avatar: 'CB',
    bio: 'Signals analyst. Watching the grid for emergent behavior.',
    followers: 8200,
    following: 310,
    followingIds: ['u0', 'u2']
  },
  {
    id: 'u2',
    username: 'Nova Lin',
    handle: '@novalin',
    avatar: 'NL',
    bio: 'UX architect. Building luminous spaces for human connection.',
    followers: 12740,
    following: 502,
    followingIds: ['u0', 'u1']
  },
  {
    id: 'u3',
    username: 'Echo Drift',
    handle: '@echod',
    avatar: 'ED',
    bio: 'Realtime systems. If it moves, I visualize it.',
    followers: 6540,
    following: 188,
    followingIds: ['u0']
  }
]

export const posts: Post[] = [
  {
    id: 'p1',
    userId: 'u1',
    username: 'Cipher Bloom',
    handle: '@cipherb',
    avatar: 'CB',
    content:
      'NullNode is live. The timeline breathes again. Follow the signals, trust the pulse.',
    timestamp: minutes(6),
    likes: 218,
    comments: 42,
    reposts: 31,
    liked: true
  },
  {
    id: 'p2',
    userId: 'u2',
    username: 'Nova Lin',
    handle: '@novalin',
    avatar: 'NL',
    content:
      'Designing a social layer that feels alive. Neon edges, soft glows, zero noise.',
    timestamp: minutes(18),
    likes: 146,
    comments: 18,
    reposts: 12
  },
  {
    id: 'p3',
    userId: 'u0',
    username: 'Astra Vega',
    handle: '@astra',
    avatar: 'AV',
    content:
      'Tonight we ship the network map. Every follow, reply, and repost becomes light.',
    timestamp: minutes(26),
    likes: 390,
    comments: 68,
    reposts: 44
  },
  {
    id: 'p4',
    userId: 'u3',
    username: 'Echo Drift',
    handle: '@echod',
    avatar: 'ED',
    content:
      'Realtime feed latency is now under 120ms. The grid feels instant.',
    timestamp: minutes(42),
    likes: 98,
    comments: 11,
    reposts: 9
  },
  {
    id: 'p5',
    userId: 'u2',
    username: 'Nova Lin',
    handle: '@novalin',
    avatar: 'NL',
    content:
      'NullNode is a public social platform. No dark net vibes, just luminous conversation.',
    timestamp: minutes(65),
    likes: 206,
    comments: 22,
    reposts: 17
  },
  {
    id: 'p6',
    userId: 'u1',
    username: 'Cipher Bloom',
    handle: '@cipherb',
    avatar: 'CB',
    content:
      'Trending graph is peaking. Keep sharing, keep connecting.',
    timestamp: minutes(110),
    likes: 74,
    comments: 6,
    reposts: 4
  }
]

export const trends: Trend[] = [
  { id: 't1', topic: '#NullNodeLaunch', mentions: '24.8k mentions' },
  { id: 't2', topic: '#NeonFeeds', mentions: '12.1k mentions' },
  { id: 't3', topic: '#CyberSocial', mentions: '9.4k mentions' },
  { id: 't4', topic: '#RealtimePulse', mentions: '6.9k mentions' }
]

export const notifications: Notification[] = [
  {
    id: 'n1',
    title: 'New follower',
    detail: 'Nova Lin started following you.',
    timestamp: minutes(4),
    tone: 'success'
  },
  {
    id: 'n2',
    title: 'Post traction spike',
    detail: 'Your post reached 1.2k impressions in the last hour.',
    timestamp: minutes(22),
    tone: 'info'
  },
  {
    id: 'n3',
    title: 'Mention detected',
    detail: 'Cipher Bloom mentioned you in #NullNodeLaunch.',
    timestamp: minutes(57),
    tone: 'warning'
  }
]

export const activities: Activity[] = [
  {
    id: 'a1',
    label: 'Realtime map updated',
    detail: 'Connections recalculated 12s ago.',
    timestamp: minutes(2)
  },
  {
    id: 'a2',
    label: 'New repost streak',
    detail: 'Three reposts within 5 minutes.',
    timestamp: minutes(15)
  },
  {
    id: 'a3',
    label: 'Profile scan',
    detail: 'Suggested profile: @echod',
    timestamp: minutes(33)
  }
]

export const liveDrops = [
  'Pulse check: the grid is humming tonight.',
  'New connection cluster detected near #NeonFeeds.',
  'Live audio channel replaced by text-first focus. Staying pure.',
  'Energy spike in global feed. Keep the signal clean.'
]

export const commentsByPost: Record<string, Comment[]> = {
  p1: [
    {
      id: 'c1',
      postId: 'p1',
      userId: 'u2',
      username: 'Nova Lin',
      handle: '@novalin',
      avatar: 'NL',
      content: 'The feed finally feels alive again.',
      timestamp: minutes(2)
    },
    {
      id: 'c2',
      postId: 'p1',
      userId: 'u3',
      username: 'Echo Drift',
      handle: '@echod',
      avatar: 'ED',
      content: 'Signal clarity is perfect tonight.',
      timestamp: minutes(1)
    }
  ],
  p3: [
    {
      id: 'c3',
      postId: 'p3',
      userId: 'u1',
      username: 'Cipher Bloom',
      handle: '@cipherb',
      avatar: 'CB',
      content: 'Map visuals are locked in. Ship it.',
      timestamp: minutes(4)
    }
  ]
}
