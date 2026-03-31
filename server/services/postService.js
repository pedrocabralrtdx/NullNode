import xss from 'xss'
import { PostModel } from '../models/PostModel.js'

export const fetchAllPosts = async () => {
  return await PostModel.findAll()
}

export const createPost = async ({ content, user }) => {
  if (!content || typeof content !== 'string') {
    const error = new Error('Content is required and must be a string')
    error.statusCode = 400
    throw error
  }

  const sanitizedContent = xss(content).slice(0, 280)

  if (!sanitizedContent) {
    const error = new Error('Content cannot be empty after sanitization')
    error.statusCode = 400
    throw error
  }

  const newPost = await PostModel.create({ content: sanitizedContent }, user)
  return newPost
}

export const likePost = async (postId) => {
  if (!postId) {
    const error = new Error('Post ID is required')
    error.statusCode = 400
    throw error
  }

  const post = await PostModel.incrementLikes(postId)
  if (!post) {
    const error = new Error('Post not found')
    error.statusCode = 404
    throw error
  }
  return post
}
