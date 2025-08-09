const express = require('express');
const { addMinutes, startOfDay, addDays } = require('date-fns');
const router = express.Router();

// GET /api/slots?from=YYYY-MM-DD&to=YYYY-MM-DD
// Returns available slots for the date range. Each slot: { id, start_at, end_at, available }
router.get('/slots', (req, res) => {
  try {
    const fromParam = req.query.from;
    const toParam = req.query.to;
    const from = fromParam ? new Date(fromParam + 'T00:00:00Z') : new Date();
    const to = toParam ? new Date(toParam + 'T23:59:59Z') : addDays(from, 7);

    // generate 30-min blocks between 09:00 - 17:00 (UTC) between from..to
    const results = [];
    const curDate = new Date(from.toISOString().slice(0,10) + 'T00:00:00Z');
    for (let dt = new Date(curDate); dt <= to; dt.setUTCDate(dt.getUTCDate()+1)) {
      // day start
      const yyyyMMdd = dt.toISOString().slice(0,10);
      const dayStart = new Date(yyyyMMdd + 'T09:00:00Z'); // 09:00 UTC
      const dayEnd = new Date(yyyyMMdd + 'T17:00:00Z'); // exclusive
      for (let t = new Date(dayStart); t < dayEnd; t = addMinutes(t, 30)) {
        const start = new Date(t);
        const end = addMinutes(start, 30);
        results.push({
          id: start.toISOString(),
          start_at: start.toISOString(),
          end_at: end.toISOString(),
          available: true // frontend will check bookings endpoint for real availability
        });
      }
    }
    return res.json({ slots: results });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: { code:'SERVER_ERROR', message: 'Could not generate slots' }});
  }
});

module.exports = router;
