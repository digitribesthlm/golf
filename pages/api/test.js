export default function handler(req, res) {
  try {
    res.status(200).json({ 
      message: 'API routes are working',
      timestamp: new Date().toISOString(),
      method: req.method,
      env: {
        hasMongoUri: !!process.env.MONGODB_URI,
        hasMongoDb: !!process.env.MONGODB_DB,
        hasSecret: !!process.env.NEXTAUTH_SECRET,
        hasCollection: !!process.env.MONGODB_DB_COLLECTION,
        nodeEnv: process.env.NODE_ENV
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Test endpoint failed',
      message: error.message 
    });
  }
}

