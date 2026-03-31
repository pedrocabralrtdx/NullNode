import express from 'express'
import { getPosts, createPost, likePost } from '../controllers/postController.js'
import { protect } from '../middlewares/auth.js'

const router = express.Router()

router.get('/', getPosts)
router.post('/', protect, createPost)
router.post('/like', protect, likePost)

export default router
