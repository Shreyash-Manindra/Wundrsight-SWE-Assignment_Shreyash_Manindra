import React, { useEffect, useState } from 'react';
import { getSlots, bookSlot, myBookings } from '../api';

export default function PatientDashboard(){
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [err, setErr] = useState(null);
  useEffect(()=> {
    const today = new Date().toISOString().slice(0,10);
    const to = new Date(); to.setDate(to.getDate()+6);
    const toStr = to.toISOString().slice(0,10);
    getSlots(today,toStr).then(r => {
      setSlots(r.slots || []);
    }).catch(e => setErr('Could not load slots'));
    fetchBookings();
  }, []);

  async function fetchBookings(){
    const res = await myBookings();
    setBookings(res.bookings || []);
  }

  async function handleBook(slotId){
    setErr(null);
    const res = await bookSlot(slotId);
    if (res.status === 201) {
      await fetchBookings();
      alert('Booked!');
    } else {
      const body = await res.json();
      setErr(body.error?.message || 'Could not book');
    }
  }

  const bookedSet = new Set(bookings.map(b => b.slotId));

  return (
    <div>
      <h3>Patient Dashboard</h3>
      {err && <div style={{ color:'red' }}>{err}</div>}
      <h4>Next 7 days - Available Slots (UTC)</h4>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
        {slots.map(s => (
          <div key={s.id} style={{ border:'1px solid #ccc', padding:8 }}>
            <div>{new Date(s.start_at).toUTCString().slice(0,25)}</div>
            <div>{new Date(s.end_at).toUTCString().slice(16,25)}</div>
            <div>
              {bookedSet.has(s.id) ? <em>Your booking</em> :
                <button onClick={()=>handleBook(s.id)}>Book</button>}
            </div>
          </div>
        ))}
      </div>

      <h4 style={{ marginTop:20 }}>My Bookings</h4>
      <ul>
        {bookings.map(b => <li key={b.id}>{new Date(b.slotId).toUTCString()} (booked at {new Date(b.createdAt).toLocaleString()})</li>)}
      </ul>
    </div>
  );
}
