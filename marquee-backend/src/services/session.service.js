// src/services/session.service.js
const { newJti, sign, verify } = require('../lib/jwt');
const { daysFromNowISO } = require('../lib/time');
const repo = require('../data/session.repo');

const cookieBase = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};
const cookieMaxAgeMs = Number(process.env.JWT_EXPIRES_DAYS || 7)*24*60*60*1000;

exports.startSession = async ({ res, userId, email, userAgent, ip }) => {
  const jti = newJti();
  const token = sign({ uid: userId, email, jti });
  await repo.create({
    jti,
    userId,
    userAgent,
    ip,
    expiresAtISO: daysFromNowISO(Number(process.env.JWT_EXPIRES_DAYS || 7)),
  });
  res.cookie('session', token, { ...cookieBase, maxAge: cookieMaxAgeMs });
  return { jti, token };
};

exports.verifySession = async (token) => {
  const payload = verify(token); // { uid, email, jti, iat, exp }
  const active = await repo.isActive(payload.jti);
  if (!active) throw new Error('Session revoked');
  return payload;
};

exports.endSession = async ({ res, jti }) => {
  if (jti) await repo.revoke(jti);
  res.clearCookie('session', { ...cookieBase });
};

exports.endAllSessionsForUser = async (userId) => {
  await repo.revokeAllForUser(userId);
};
