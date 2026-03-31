import jwt from 'jsonwebtoken'
import { UserModel } from '../models/UserModel.js'

const JWT_SECRET = process.env.JWT_SECRET || 'nullnode_super_secret_dev_key'

export const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, JWT_SECRET)

      const user = await UserModel.findById(decoded.id)
      if (!user) {
        return res.status(401).json({ error: 'Not authorized: user not found' })
      }

      req.user = user
      return next()
    } catch (error) {
      console.error('Token verification failed:', error)
      return res.status(401).json({ error: 'Not authorized: invalid token' })
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized: no token provided' })
  }
}

export const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' })
}
