import * as authService from '../services/authService.js'
import { loginSchema } from '../utils/schemas.js'

export const login = async (req, res, next) => {
  try {
    const parsedData = loginSchema.parse(req.body)
    const result = await authService.loginUser(parsedData)
    res.json(result)
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }
    next(error)
  }
}
