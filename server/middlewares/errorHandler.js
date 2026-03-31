export const errorHandler = (err, req, res, next) => {
  console.error('[Server Error Detail]:', err.stack)
  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      // Hide stack trace in production if we were using NODE_ENV
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    }
  })
}

export const notFound = (req, res, next) => {
  res.status(404).json({ error: `Endpoint Not Found - ${req.originalUrl}` })
}
