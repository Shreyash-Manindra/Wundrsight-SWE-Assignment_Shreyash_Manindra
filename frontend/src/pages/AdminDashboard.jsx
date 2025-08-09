import React, { useEffect, useState } from 'react';
import { allBookings } from '../api';

export default function AdminDashboard(){
  const [bookings, setBookings] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(()=> {
    allBookings().then(r => { setBookings(r.bookings || r); }).catch(e => setErr('Could not load'));
  }, []);

  return (
    <div>
      <h3>Admin Dashboard</h3>
      {err && <div style={{ color:'red' }}>{err}</div>}
      <table border="1" cellPadding="6">
        <thead><tr><th>ID</th><th>Slot (UTC)</th><th>User</th><th>Created At</th></tr></thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{new Date(b.slotId).toUTCString()}</td>
              <td>{b.User ? `${b.User.name} (${b.User.email})` : b.userId}</td>
              <td>{new Date(b.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
