import { readDb, writeDb } from '../utils/db.js'

export const UserModel = {
  async findById(id) {
    const db = await readDb()
    if (id === db.currentUser.id) return db.currentUser
    return db.users.find(u => u.id === id) || null
  },

  async findByUsernameOrHandle(identifier) {
    const db = await readDb()
    if (db.currentUser.username === identifier || db.currentUser.handle === identifier) {
      return db.currentUser
    }
    return db.users.find(u => u.username === identifier || u.handle === identifier) || null
  },

  async updateCurrentUser(data) {
    const db = await readDb()
    if (data.username) db.currentUser.username = data.username
    if (data.handle) db.currentUser.handle = data.handle
    await writeDb(db)
    return db.currentUser
  },

  async addFollowing(currentUserId, targetId) {
    const db = await readDb()
    if (currentUserId !== db.currentUser.id) {
      throw new Error('MOCK DB LIMITATION: Can only add following for currentUser')
    }

    const target = db.users.find((user) => user.id === targetId)
    if (!target) return null

    if (!db.currentUser.followingIds.includes(targetId)) {
      db.currentUser.followingIds.push(targetId)
      db.currentUser.following += 1
      target.followers += 1
      await writeDb(db)
    }
    return { currentUser: db.currentUser, target }
  }
}
