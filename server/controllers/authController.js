import * as authService from '../services/authService.js'

export const login = async (req, res, next) => {
  try {
    const { username, handle } = req.body || {}
    const result = await authService.loginUser({ username, handle })
    res.json(result)
  } catch (error) {
    next(error)
  }
}
