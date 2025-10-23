// src/controllers/auth.controller.js
const { verifyIdToken } = require('../lib/google');
const { startSession, endSession } = require('../services/session.service');
const sf = require('../snowflake');

exports.signup = async (req, res, next) => {
  try {
    const p = req.validatedBody;
    const existing = await sf.findUserByEmail(p.email);
    if (existing) {
      // OPTIONAL: auto send a one-time code to speed up login
      // const code = Math.floor(100000 + Math.random()*900000).toString();
      // const expiresAt = new Date(Date.now() + 5*60*1000).toISOString();
      // await sf.issueEmailCode(p.email, code, expiresAt);
      // console.log(`Login code for ${p.email}: ${code}`);

      return res.status(409).json({
        ok: false,
        code: 'USER_EXISTS',
        message: 'An account with this email already exists. Log in instead.',
        // codeSent: true,  // <- set true if you enabled the auto-send code above
      });
    }
    // Optional Google verify
    let googleSub = null, googleEmail = null, googleEmailVerified = null;
    if (p.googleIdToken) {
      const c = await verifyIdToken(p.googleIdToken);
      googleSub = c.sub; googleEmail = c.email; googleEmailVerified = !!c.email_verified;
    }
    // Upsert user (implement in your snowflake.js)
    const { id } = await sf.upsertUserFromSignup({
      ...p, googleSub, googleEmail, googleEmailVerified
    });

    await startSession({
      res,
      userId: id,
      email: p.email,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });

    return res.status(200).json({ ok: true, userId: id });
  } catch (e) { next(e); }
};

exports.loginWithGoogle = async (req, res, next) => {
  try {
    const { idToken } = req.validatedBody;
    const c = await verifyIdToken(idToken);

    // Find or create user records (use your helpers)
    let u = await sf.findUserByGoogleSub(c.sub);
    if (!u && c.email) {
      u = await sf.findUserByEmail(c.email);
      if (u) await sf.attachGoogleToEmailIfMissing(u.EMAIL, c);
    }
    if (!u) {
      const r = await sf.upsertUserFromSignup({
        firstName: c.given_name || null,
        lastName: c.family_name || null,
        email: c.email || null,
        googleSub: c.sub,
        googleEmail: c.email || null,
        googleEmailVerified: !!c.email_verified
      });
      u = { ID: r.id, EMAIL: c.email || null };
    }

    await startSession({
      res,
      userId: u.ID,
      email: u.EMAIL || c.email || null,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    });

    return res.status(201).json({
      ok: true, user: {
        id: profile.ID,
        email: profile.EMAIL,
        firstName: profile.FIRST_NAME,
        lastName: profile.LAST_NAME,
        phone: profile.PHONE,
        birthday: profile.BIRTHDAY,       // Snowflake returns ISO timestamp/date
        tiktok: profile.TIKTOK,
        instagram: profile.INSTAGRAM,
      }
    });
  } catch (e) { next(e); }
};

exports.logout = async (req, res) => {
  await endSession({ res, jti: req.user?.jti });
  res.json({ ok: true });
};

exports.me = async (req, res, next) => {
  try {
    const u = await sf.findUserById(req.user.uid); // add this helper below
    if (!u) return res.status(404).json({ ok:false, error:'User not found' });
    return res.json({ ok:true, user: {
      id: u.ID,
      email: u.EMAIL,
      firstName: u.FIRST_NAME,
      lastName: u.LAST_NAME,
      phone: u.PHONE,
      birthday: u.BIRTHDAY,
      tiktok: u.TIKTOK,
      instagram: u.INSTAGRAM,
    }});
  } catch (e) { next(e); }
};

