// src/middlewares/auth.js
const { verifySession } = require('../services/session.service');

exports.requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.session;
    if (!token) return res.status(401).json({ ok:false, error:'Unauthorized' });
    const payload = await verifySession(token);
    req.user = payload; // { uid, email, jti, ... }
    next();
  } catch {
    return res.status(401).json({ ok:false, error:'Unauthorized' });
  }
};
