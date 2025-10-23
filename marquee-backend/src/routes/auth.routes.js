const { Router } = require('express');
const { validate } = require('../middlewares/validate');
const { requireAuth } = require('../middlewares/auth');
const c = require('../controllers/auth.controller');
const v = require('../validators');

const r = Router();
r.post('/signup', validate(v.signupSchema), c.signup);
r.post('/login/google', validate(v.googleLoginSchema), c.loginWithGoogle);
r.get('/me', requireAuth, c.me);
r.post('/logout', requireAuth, c.logout);
module.exports = r;
