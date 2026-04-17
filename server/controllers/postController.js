import * as postService from '../services/postService.js'
import { broadcast } from '../utils/wsManager.js'
import { createPostSchema } from '../utils/schemas.js'

export const getPosts = async (req, res, next) => {
  try {
    const posts = await postService.fetchAllPosts()
    res.json(posts)
  } catch (error) {
    next(error)
  }
}

export const createPost = async (req, res, next) => {
  try {
    const { content } = createPostSchema.parse(req.body)
    // req.user is populated by the protect middleware
    const newPost = await postService.createPost({ content, user: req.user })
    
    broadcast({ type: 'post', data: newPost })
    res.status(201).json(newPost)
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }
    next(error)
  }
}

export const likePost = async (req, res, next) => {
  try {
    const { postId } = req.body || {}
    const post = await postService.likePost(postId)
    res.json(post)
  } catch (error) {
    next(error)
  }
}
