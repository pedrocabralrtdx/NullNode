import express from 'express'
import { followUser } from '../controllers/userController.js'
import { protect } from '../middlewares/auth.js'

const router = express.Router()

router.post('/follow', protect, followUser)

export default router
