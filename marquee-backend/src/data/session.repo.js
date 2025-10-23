// src/data/session.repo.js
const sf = require('../snowflake');

exports.create = async ({ jti, userId, userAgent, ip, expiresAtISO }) => {
  await sf.exec(`
    INSERT INTO SESSIONS (JTI, USER_ID, USER_AGENT, IP, EXPIRES_AT)
    VALUES (?, ?, ?, ?, ?)`,
    [jti, userId, userAgent || null, ip || null, expiresAtISO]
  );
};

exports.isActive = async (jti) => {
  const rows = await sf.exec(`
    SELECT 1 FROM SESSIONS WHERE JTI = ? AND EXPIRES_AT > CURRENT_TIMESTAMP() LIMIT 1`,
    [jti]
  );
  return rows.length > 0;
};

exports.revoke = async (jti) => {
  await sf.exec(`DELETE FROM SESSIONS WHERE JTI = ?`, [jti]);
};

exports.revokeAllForUser = async (userId) => {
  await sf.exec(`DELETE FROM SESSIONS WHERE USER_ID = ?`, [userId]);
};
