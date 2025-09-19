export default function handler(req, res) {
  res.status(200).json({ 
    message: 'API routes are working',
    env: {
      hasMongoUri: !!process.env.MONGODB_URI,
      hasMongoDb: !!process.env.MONGODB_DB,
      hasSecret: !!process.env.NEXTAUTH_SECRET,
      hasCollection: !!process.env.MONGODB_DB_COLLECTION
    }
  });
}

