// src/lib/jwt.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error('JWT_SECRET is not set');
const days = Number(process.env.JWT_EXPIRES_DAYS || 7);

exports.newJti = () => crypto.randomBytes(16).toString('hex');

exports.sign = (claims) => jwt.sign(claims, secret, { expiresIn: `${days}d` });

exports.verify = (token) => jwt.verify(token, secret);
