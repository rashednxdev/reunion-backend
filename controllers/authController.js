import jwt from 'jsonwebtoken';

export const login = (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`[Auth] Login attempt for username: "${username}"`);
    console.log(`[Auth] Expected username: "${process.env.ADMIN_USERNAME}"`);
    console.log(`[Auth] Passwords match: ${password === process.env.ADMIN_PASSWORD}`);

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      console.log('[Auth] Login failed: Invalid credentials');
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    console.log('[Auth] Login success! Generating JWT token.');
    const token = jwt.sign(
      { role: 'admin', username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
