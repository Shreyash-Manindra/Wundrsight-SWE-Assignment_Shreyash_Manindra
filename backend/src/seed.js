require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User } = require('./models');

async function seed() {
  await sequelize.sync({ alter: true });
  const adminEmail = 'admin@example.com';
  const patientEmail = 'patient@example.com';
  const pass = 'Passw0rd!';

  const adminHash = await bcrypt.hash(pass, 10);
  const patientHash = await bcrypt.hash(pass, 10);

  const [admin, createdAdmin] = await User.findOrCreate({
    where: { email: adminEmail },
    defaults: { name: 'Admin', email: adminEmail, password_hash: adminHash, role: 'admin' }
  });

  const [patient, createdPatient] = await User.findOrCreate({
    where: { email: patientEmail },
    defaults: { name: 'Patient', email: patientEmail, password_hash: patientHash, role: 'patient' }
  });

  console.log('Seeded users:');
  console.log('Admin ->', adminEmail, '/ Passw0rd!');
  console.log('Patient ->', patientEmail, '/ Passw0rd!');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
