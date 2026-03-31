import * as userService from '../services/userService.js'

export const followUser = async (req, res, next) => {
  try {
    const { userId } = req.body || {}
    const result = await userService.followUser(req.user.id, userId)
    res.json(result)
  } catch (error) {
    next(error)
  }
}
