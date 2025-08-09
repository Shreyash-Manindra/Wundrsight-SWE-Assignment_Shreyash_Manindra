const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'data.sqlite'),
  logging: false
});

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('patient','admin'), defaultValue: 'patient' }
}, { timestamps: true });

const Booking = sequelize.define('Booking', {
  // slotId stored as string ISO start time to keep it simple
  slotId: { type: DataTypes.STRING, allowNull: false, unique: true }
}, { timestamps: true });

const Slot = sequelize.define('Slot', {
  start_at: { type: DataTypes.DATE, allowNull: false },
  end_at: { type: DataTypes.DATE, allowNull: false }
}, { timestamps: true });

User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Slot.hasOne(Booking, { foreignKey: 'slotId', sourceKey: 'start_at' });
// Note: Slot is optional - we generate slots on demand; booking.slotId is unique string.

module.exports = { sequelize, User, Booking, Slot };
