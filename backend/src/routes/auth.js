const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { signToken } = require('../auth');

const router = express.Router();

// POST /api/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: { code:'INVALID_INPUT', message: 'name,email,password required' }});
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password_hash: hash, role: 'patient' });
    return res.status(201).json({ id: user.id });
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: { code: 'EMAIL_TAKEN', message: 'Email already in use' }});
    }
    console.error(e);
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Unable to register' }});
  }
});

// POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: { code:'INVALID_INPUT', message: 'email,password required' }});
    const user = await User.findOne({ where: { email }});
    if (!user) return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Wrong email or password' }});
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Wrong email or password' }});
    const token = signToken(user);
    return res.status(200).json({ token, role: user.role, name: user.name });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Login failed' }});
  }
});

module.exports = router;
