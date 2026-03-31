import { nanoid } from 'nanoid'
import { readDb, writeDb } from '../utils/db.js'

export const PostModel = {
  async findAll() {
    const db = await readDb()
    return db.posts
  },

  async findById(id) {
    const db = await readDb()
    return db.posts.find(p => p.id === id) || null
  },

  async create(data, author) {
    const db = await readDb()
    const newPost = {
      id: nanoid(),
      userId: author.id,
      username: author.username,
      handle: author.handle,
      avatar: author.avatar,
      content: data.content,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      reposts: 0
    }
    db.posts.unshift(newPost)
    await writeDb(db)
    return newPost
  },

  async incrementLikes(id) {
    const db = await readDb()
    const post = db.posts.find(p => p.id === id)
    if (!post) return null
    
    post.likes += 1
    await writeDb(db)
    return post
  }
}
