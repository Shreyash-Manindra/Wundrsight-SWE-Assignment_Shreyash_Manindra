const jwt = require('jsonwebtoken');
const { User } = require('./models');

const jwtSecret = process.env.JWT_SECRET || 'dev_secret';

function signToken(user) {
  const payload = { id: user.id, role: user.role, email: user.email, name: user.name };
  return jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
}

async function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: { code: 'UNAUTH', message: 'Missing token' }});
  const token = h.replace('Bearer ','');
  try {
    const decoded = jwt.verify(token, jwtSecret);
    // attach user minimal
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ error: { code:'UNAUTH', message: 'Invalid user' }});
    req.user = { id: user.id, role: user.role, email: user.email, name: user.name };
    next();
  } catch (e) {
    return res.status(401).json({ error: { code: 'UNAUTH', message: 'Invalid token' }});
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: { code: 'UNAUTH', message: 'Missing auth' }});
    if (req.user.role !== role) return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Insufficient privileges' }});
    next();
  };
}

module.exports = { signToken, authMiddleware, requireRole };
