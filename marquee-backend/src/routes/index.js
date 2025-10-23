const { Router } = require('express');
const authRoutes = require('./auth.routes');
const eventsRoutes = require('./events.routes');

const router = Router();

router.get('/healthz', (_req, res) => res.json({ ok: true }));
router.use('/api', authRoutes);
router.use('/api', eventsRoutes);

module.exports = router;
