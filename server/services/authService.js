import { generateToken } from '../middlewares/auth.js'
import { UserModel } from '../models/UserModel.js'

export const loginUser = async ({ username, handle }) => {
  if (!username && !handle) {
    const error = new Error('Must provide username or handle to authenticate')
    error.statusCode = 400
    throw error
  }

  const updatedUser = await UserModel.updateCurrentUser({ username, handle })
  const token = generateToken(updatedUser.id)

  return {
    user: updatedUser,
    token
  }
}
