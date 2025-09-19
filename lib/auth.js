import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from './mongodb';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-key';

export async function verifyPassword(password, storedPassword) {
  if (!storedPassword) return false;
  // If it looks like a bcrypt hash, compare with bcrypt; otherwise compare plaintext
  const looksHashed = typeof storedPassword === 'string' && storedPassword.startsWith('$2');
  if (looksHashed) {
    try {
      return await bcrypt.compare(password, storedPassword);
    } catch (e) {
      return false;
    }
  }
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

export async function getUserByIdentity(identity) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);
  const collection = db.collection(process.env.MONGODB_DB_COLLECTION);

  // Case-insensitive exact match for username or email
  const regex = new RegExp(`^${identity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
  return await collection.findOne({ $or: [{ username: regex }, { email: regex }] });
}

export function getUserPasswordHash(user) {
  // Support multiple common password hash field names
  return user?.password || user?.passwordHash || user?.hashedPassword || null;
}

