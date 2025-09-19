import { getUserByUsername, createUser, generateToken } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    // Check if user already exists
    const existingUser = await getUserByUsername(username);
    
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Create new user
    const result = await createUser(username, password);

    // Generate JWT token
    const token = generateToken(result.insertedId);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: result.insertedId,
        username,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

