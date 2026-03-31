export const broadcast = (wss, payload) => {
  if (!wss) return
  const message = JSON.stringify(payload)
  wss.clients.forEach((client) => {
    // 1 corresponds to WebSocket.OPEN
    if (client.readyState === 1) {
      client.send(message)
    }
  })
}
