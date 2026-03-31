import express from 'express'
import cors from 'cors'
import { WebSocketServer } from 'ws'
import { readDb } from './utils/db.js'

import postsRouter from './routes/posts.js'
import usersRouter from './routes/users.js'
import authRouter from './routes/auth.js'
import { errorHandler, notFound } from './middlewares/errorHandler.js'

const app = express()
const PORT = process.env.PORT || 5174

app.use(cors())
app.use(express.json())

app.get('/api/boot', async (_req, res, next) => {
  try {
    const db = await readDb()
    res.json(db)
  } catch (err) {
    next(err)
  }
})

app.use('/api/posts', postsRouter)
app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)

app.use(notFound)
app.use(errorHandler)

const server = app.listen(PORT, () => {
  console.log(`NullNode server running on http://localhost:${PORT}`)
})

const wss = new WebSocketServer({ server, path: '/ws' })
app.locals.wss = wss

wss.on('connection', (socket) => {
  socket.send(JSON.stringify({ type: 'hello', data: 'NullNode socket ready' }))
})
