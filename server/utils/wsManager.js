import { WebSocketServer } from 'ws'

export class WebSocketManager {
  constructor(server) {
    this.wss = new WebSocketServer({ server, path: '/ws' })
    
    this.wss.on('connection', (socket) => {
      socket.send(JSON.stringify({ type: 'hello', data: 'NullNode socket ready' }))
      
      socket.on('error', console.error)
    })
  }

  broadcast(message) {
    try {
      const data = JSON.stringify(message)
      this.wss.clients.forEach((client) => {
        if (client.readyState === 1 /* ws.OPEN */) {
          client.send(data)
        }
      })
    } catch (err) {
      console.error('Failed to broadcast message:', err)
    }
  }

  getWss() {
    return this.wss
  }
}

let wsManagerInstance = null

export const initWsManager = (server) => {
  wsManagerInstance = new WebSocketManager(server)
  return wsManagerInstance
}

export const broadcast = (message) => {
  if (wsManagerInstance) {
    wsManagerInstance.broadcast(message)
  } else {
    console.warn('WebSocketManager not initialized, cannot broadcast')
  }
}
