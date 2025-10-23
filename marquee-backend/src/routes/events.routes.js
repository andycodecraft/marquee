const { Router } = require('express');
const c = require('../controllers/events.controller');

const r = Router();
r.get('/events', c.getUpcoming);   // GET /api/events?from=2025-10-01&limit=20
module.exports = r;
