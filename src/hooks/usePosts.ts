import { nanoid } from 'nanoid'
import { useStore } from '../contexts/StoreContext'
import { Comment, Post } from '../types'

export function usePosts() {
  const { posts, setPosts, currentUser, serverStatus, commentsByPost, setCommentsByPost } = useStore()

  const handleCreatePost = async (content: string) => {
    const trimmed = content.trim()
    if (!trimmed) return

    const newPost: Post = {
      id: nanoid(),
      userId: currentUser.id,
      username: currentUser.username,
      handle: currentUser.handle,
      avatar: currentUser.avatar,
      content: trimmed.slice(0, 280),
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      reposts: 0
    }

    setPosts((prev) => [newPost, ...prev])

    if (serverStatus === 'online') {
      try {
        const token = localStorage.getItem('nullnode_token')
        await fetch('/api/posts', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ content: newPost.content, userId: currentUser.id })
        })
      } catch (err) {
        console.error('Failed to post', err)
      }
    }
  }

  const updatePost = (id: string, updater: (post: Post) => Post) => {
    setPosts((prev) => prev.map((post) => (post.id === id ? updater(post) : post)))
  }

  const handleLike = async (id: string) => {
    updatePost(id, (post) => ({
      ...post,
      liked: !post.liked,
      likes: post.likes + (post.liked ? -1 : 1)
    }))

    if (serverStatus === 'online') {
      try {
        const token = localStorage.getItem('nullnode_token')
        await fetch('/api/posts/like', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ postId: id })
        })
      } catch (err) {
        console.error('Failed to like', err)
      }
    }
  }

  const handleRepost = (id: string) => {
    updatePost(id, (post) => ({
      ...post,
      reposted: !post.reposted,
      reposts: post.reposts + (post.reposted ? -1 : 1)
    }))
  }

  const handleAddComment = (postId: string, content: string) => {
    const trimmed = content.trim()
    if (!trimmed) return
    const newComment: Comment = {
      id: nanoid(),
      postId,
      userId: currentUser.id,
      username: currentUser.username,
      handle: currentUser.handle,
      avatar: currentUser.avatar,
      content: trimmed.slice(0, 180),
      timestamp: new Date().toISOString()
    }
    setCommentsByPost((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] ?? []), newComment]
    }))
    updatePost(postId, (post) => ({ ...post, comments: post.comments + 1 }))
  }

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  return {
    posts: sortedPosts,
    commentsByPost,
    handleCreatePost,
    handleLike,
    handleRepost,
    handleAddComment
  }
}
