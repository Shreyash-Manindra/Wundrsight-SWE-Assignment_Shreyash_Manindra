const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function register(name,email,password){
  const res = await fetch(`${API_BASE}/register`, {
    method:'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({name,email,password})
  });
  return res.json();
}
export async function login(email,password){
  const res = await fetch(`${API_BASE}/login`, {
    method:'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({email,password})
  });
  return res.json();
}
export async function getSlots(from,to){
  const url = new URL(`${API_BASE}/slots`);
  if(from) url.searchParams.set('from', from);
  if(to) url.searchParams.set('to', to);
  const res = await fetch(url.toString(), { headers: { ...authHeader() }});
  return res.json();
}
export async function bookSlot(slotId){
  const res = await fetch(`${API_BASE}/book`, {
    method:'POST', headers: {'Content-Type':'application/json', ...authHeader()}, body: JSON.stringify({ slotId })
  });
  return res;
}
export async function myBookings(){
  const res = await fetch(`${API_BASE}/my-bookings`, { headers: { ...authHeader() }});
  return res.json();
}
export async function allBookings(){
  const res = await fetch(`${API_BASE}/all-bookings`, { headers: { ...authHeader() }});
  return res.json();
}
