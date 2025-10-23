const { listUpcomingEvents } = require('../snowflake');

exports.getUpcoming = async (req, res, next) => {
  try {
    const { from, limit } = req.query;
    const rows = await listUpcomingEvents({ from, limit });
    // Shape response for the frontend
    const items = rows.map(r => ({
      id: r.ID,
      title: r.TITLE,
      date: r.EVENT_DATE,     // ISO YYYY-MM-DD from Snowflake
      venue: r.VENUE,
      image: r.IMAGE_URL,
    }));
    res.json({ ok: true, items });
  } catch (e) { next(e); }
};
