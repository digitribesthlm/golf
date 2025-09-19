import { getUserByIdentity, getUserPasswordHash, verifyPassword, generateToken } from '../../../lib/auth';

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Check environment variables
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI not set');
    return res.status(500).json({ message: 'Database configuration error' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    console.log('Attempting login for:', username);
    
    // Get user from database by username or email (case-insensitive)
    const user = await getUserByIdentity(username);
    
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User found, verifying password');

    // Verify password (support multiple hash field names)
    const passwordHash = getUserPasswordHash(user);
    if (!passwordHash) {
      console.log('No password hash found for user:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await verifyPassword(password, passwordHash);
    
    if (!isValidPassword) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful for:', username);

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

