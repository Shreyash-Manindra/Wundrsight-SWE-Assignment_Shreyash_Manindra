require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const slotsRoutes = require('./routes/slots');
const bookingRoutes = require('./routes/bookings');

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));

app.use('/api', authRoutes);
app.use('/api', slotsRoutes);
app.use('/api', bookingRoutes);

const PORT = process.env.PORT || 4000;
(async () => {
  await sequelize.sync(); // creates tables if not exist
  app.listen(PORT, () => console.log(`API listening on ${PORT}`));
})();
