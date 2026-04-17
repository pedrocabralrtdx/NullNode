import * as userService from '../services/userService.js'
import { followUserSchema } from '../utils/schemas.js'

export const followUser = async (req, res, next) => {
  try {
    const { targetUserId } = followUserSchema.parse(req.body)
    const result = await userService.followUser(req.user.id, targetUserId)
    res.json(result)
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }
    next(error)
  }
}
