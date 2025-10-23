// src/snowflake.js
const snowflake = require('snowflake-sdk');

const cfg = {
  account:   process.env.SNOWFLAKE_ACCOUNT,
  username:  process.env.SNOWFLAKE_USERNAME,
  password:  process.env.SNOWFLAKE_PASSWORD,
  warehouse: process.env.SNOWFLAKE_WAREHOUSE,
  database:  process.env.SNOWFLAKE_DATABASE,
  schema:    process.env.SNOWFLAKE_SCHEMA,
  role:      process.env.ROLE,
};

let connection;          // connection object
let connected = false;   // connection state

async function connectOnce() {
  if (connected && connection) return connection;

  connection = snowflake.createConnection(cfg);

  await new Promise((resolve, reject) => {
    connection.connect((err) => (err ? reject(err) : resolve()));
  });

  connected = true;
  return connection;
}

/** Generic executor (Promise-based) */
async function exec(sqlText, binds = []) {
  await connectOnce();

  return new Promise((resolve, reject) => {
    connection.execute({
      sqlText,
      binds,
      complete: (err, stmt, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      },
    });
  });
}

/** ---- Example higher-level helpers (keep/merge yours) ---- */

async function upsertUserFromSignup(row) {
  // try by email
  const sel = await exec(
    `SELECT ID FROM USERS WHERE EMAIL = ? ORDER BY ID DESC LIMIT 1`,
    [row.email]
  );

  if (sel.length) {
    const id = sel[0].ID;
    await exec(
      `UPDATE USERS SET
         FIRST_NAME=?, LAST_NAME=?, PHONE=?, BIRTHDAY=?,
         TIKTOK=?, INSTAGRAM=?,
         GOOGLE_SUB=?, GOOGLE_EMAIL=?, GOOGLE_EMAIL_VERIFIED=?
       WHERE ID = ?`,
      [
        row.firstName || null,
        row.lastName || null,
        row.phone || null,
        row.birthday || null,
        row.tiktok || null,
        row.instagram || null,
        row.googleSub || null,
        row.googleEmail || null,
        row.googleEmailVerified ?? null,
        id,
      ]
    );
    return { id };
  } else {
    await exec(
      `INSERT INTO USERS(
         FIRST_NAME, LAST_NAME, PHONE, EMAIL, BIRTHDAY,
         TIKTOK, INSTAGRAM, GOOGLE_SUB, GOOGLE_EMAIL, GOOGLE_EMAIL_VERIFIED
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        row.firstName || null,
        row.lastName || null,
        row.phone || null,
        row.email || null,
        row.birthday || null,
        row.tiktok || null,
        row.instagram || null,
        row.googleSub || null,
        row.googleEmail || null,
        row.googleEmailVerified ?? null,
      ]
    );
    const got = await exec(
      `SELECT ID FROM USERS WHERE EMAIL = ? ORDER BY ID DESC LIMIT 1`,
      [row.email]
    );
    return { id: got[0]?.ID };
  }
}

async function findUserById(id) {
  const rows = await exec(`
    SELECT ID, EMAIL, FIRST_NAME, LAST_NAME, PHONE, BIRTHDAY, TIKTOK, INSTAGRAM,
           GOOGLE_SUB, GOOGLE_EMAIL, GOOGLE_EMAIL_VERIFIED, CREATED_AT
    FROM USERS WHERE ID = ? LIMIT 1
  `, [id]);
  return rows[0] || null;
}

async function findUserByEmail(email) {
  const rows = await exec(`
    SELECT ID, EMAIL, FIRST_NAME, LAST_NAME, PHONE, BIRTHDAY, TIKTOK, INSTAGRAM,
           GOOGLE_SUB, GOOGLE_EMAIL, GOOGLE_EMAIL_VERIFIED, CREATED_AT
    FROM USERS WHERE EMAIL = ? ORDER BY ID DESC LIMIT 1
  `, [email]);
  return rows[0] || null;
}

async function findUserByGoogleSub(sub) {
  const rows = await exec(
    `SELECT ID, EMAIL, FIRST_NAME, LAST_NAME, GOOGLE_SUB, GOOGLE_EMAIL, GOOGLE_EMAIL_VERIFIED
     FROM USERS WHERE GOOGLE_SUB = ? ORDER BY ID DESC LIMIT 1`,
    [sub]
  );
  return rows[0] || null;
}

async function attachGoogleToEmailIfMissing(email, claims) {
  await exec(
    `UPDATE USERS SET GOOGLE_SUB=?, GOOGLE_EMAIL=?, GOOGLE_EMAIL_VERIFIED=?
     WHERE EMAIL = ?`,
    [claims.sub || null, claims.email || null, !!claims.email_verified, email]
  );
}

async function listUsers(limit = 20) {
  return exec(
    `SELECT ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE, BIRTHDAY, CREATED_AT
     FROM USERS ORDER BY CREATED_AT DESC LIMIT ?`,
    [limit]
  );
}

async function listUpcomingEvents({ from, limit = 32 } = {}) {
  if (from) {
    return exec(
      `SELECT ID, TITLE, EVENT_DATE, VENUE, IMAGE_URL
       FROM EVENTS
       WHERE IS_PUBLISHED = TRUE
       ORDER BY EVENT_DATE ASC
       LIMIT ?`,
      [from, Number(limit)]
    );
  }
  return exec(
    `SELECT ID, TITLE, EVENT_DATE, VENUE, IMAGE_URL
     FROM EVENTS
     WHERE IS_PUBLISHED = TRUE
     ORDER BY EVENT_DATE ASC
     LIMIT ?`,
    [Number(limit)]
  );
}

module.exports = {
  // low-level
  exec,
  connectOnce,
  // user helpers
  upsertUserFromSignup,
  findUserById,
  findUserByEmail,
  findUserByGoogleSub,
  attachGoogleToEmailIfMissing,
  listUsers,
  listUpcomingEvents,
};
