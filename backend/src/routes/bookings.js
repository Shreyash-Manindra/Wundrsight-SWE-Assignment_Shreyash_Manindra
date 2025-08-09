const express = require('express');
const { Booking, User } = require('../models');
const { authMiddleware, requireRole } = require('../auth');

const router = express.Router();

// POST /api/book  { slotId }
router.post('/book', authMiddleware, requireRole('patient'), async (req, res) => {
  const t = await Booking.sequelize.transaction();
  try {
    const { slotId } = req.body;
    if (!slotId) {
      await t.rollback();
      return res.status(400).json({ error: { code:'INVALID_INPUT', message: 'slotId required' }});
    }
    // attempt to create booking (unique constraint prevents double-booking)
    const booking = await Booking.create({ slotId, userId: req.user.id }, { transaction: t });
    await t.commit();
    return res.status(201).json({ id: booking.id, slotId: booking.slotId, created_at: booking.createdAt });
  } catch (e) {
    await t.rollback();
    if (e.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: { code: 'SLOT_TAKEN', message: 'Slot already booked' }});
    }
    console.error(e);
    return res.status(500).json({ error: { code:'SERVER_ERROR', message: 'Could not create booking' }});
  }
});

// GET /api/my-bookings
router.get('/my-bookings', authMiddleware, requireRole('patient'), async (req, res) => {
  try {
    const bookings = await Booking.findAll({ where: { userId: req.user.id }, order: [['createdAt','DESC']] });
    return res.json({ bookings });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: { code:'SERVER_ERROR', message: 'Could not fetch bookings' }});
  }
});

// GET /api/all-bookings  (admin)
router.get('/all-bookings', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const bookings = await Booking.findAll({ include: [{ model: User, attributes: ['id','name','email'] }], order: [['createdAt','DESC']] });
    return res.json({ bookings });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: { code:'SERVER_ERROR', message: 'Could not fetch bookings' }});
  }
});

module.exports = router;
