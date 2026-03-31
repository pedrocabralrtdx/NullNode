import { UserModel } from '../models/UserModel.js'

export const followUser = async (currentUserId, targetId) => {
  if (!targetId) {
    const error = new Error('Target User ID is required')
    error.statusCode = 400
    throw error
  }

  const result = await UserModel.addFollowing(currentUserId, targetId)
  if (!result) {
    const error = new Error('Target User not found')
    error.statusCode = 404
    throw error
  }

  return result
}
