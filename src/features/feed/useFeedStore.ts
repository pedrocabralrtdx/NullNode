import { create } from 'zustand'
import type { Post, Comment } from '../../types'

type FeedState = {
  posts: Post[]
  commentsByPost: Record<string, Comment[]>
  feedMode: 'following' | 'global'
  setPosts: (posts: Post[]) => void
  addPost: (post: Post) => void
  setComments: (postId: string, comments: Comment[]) => void
  addCommentToPost: (postId: string, comment: Comment) => void
  toggleLike: (postId: string, userId: string) => void
  toggleRepost: (postId: string, userId: string) => void
  setFeedMode: (mode: 'following' | 'global') => void
}

export const useFeedStore = create<FeedState>((set) => ({
  posts: [],
  commentsByPost: {},
  feedMode: 'following',
  
  setPosts: (posts) => set({ posts }),
  
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  
  setComments: (postId, comments) => set((state) => ({
    commentsByPost: { ...state.commentsByPost, [postId]: comments }
  })),
  
  addCommentToPost: (postId, comment) => set((state) => {
    const existing = state.commentsByPost[postId] || []
    return {
      commentsByPost: { ...state.commentsByPost, [postId]: [...existing, comment] }
    }
  }),

  toggleLike: (postId, userId) => set((state) => {
    const updated = state.posts.map(post => {
      if (post.id === postId) {
        const hasLiked = post.likes.includes(userId)
        return {
          ...post,
          likes: hasLiked ? post.likes.filter((id: string) => id !== userId) : [...post.likes, userId]
        }
      }
      return post
    })
    return { posts: updated }
  }),

  toggleRepost: (postId, userId) => set((state) => {
    const updated = state.posts.map(post => {
      if (post.id === postId) {
        const hasReposted = post.reposts.includes(userId)
        return {
          ...post,
          reposts: hasReposted ? post.reposts.filter((id: string) => id !== userId) : [...post.reposts, userId]
        }
      }
      return post
    })
    return { posts: updated }
  }),

  setFeedMode: (mode) => set({ feedMode: mode }),
}))
