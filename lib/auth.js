import jwt from 'jsonwebtoken';
import clientPromise from './mongodb';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-key';

export async function verifyPassword(password, storedPassword) {
  // Direct string comparison for plain text passwords
  return password === storedPassword;
}

export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function getUserByUsername(username) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const collection = db.collection(process.env.MONGODB_DB_COLLECTION);
  
  return await collection.findOne({ username });
}

