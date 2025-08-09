import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import AdminDashboard from './pages/AdminDashboard';

function Nav({ user, setUser }) {
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('role'); setUser(null); navigate('/login'); };
  return (
    <nav style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
      <Link to="/">Home</Link> {' | '}
      {!user && <><Link to="/login">Login</Link> {' | '} <Link to="/register">Register</Link></>}
      {user && user.role === 'patient' && <Link to="/patient"> Patient </Link>}
      {user && user.role === 'admin' && <Link to="/admin"> Admin </Link>}
      {user && <span style={{ float:'right' }}>Hello {user.name} <button onClick={logout}>Logout</button></span>}
    </nav>
  );
}

export default function App(){
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    if (token) setUser({ role, name });
  }, []);

  return (
    <div>
      <Nav user={user} setUser={setUser} />
      <div style={{ padding: 12 }}>
        <Routes>
          <Route path="/" element={<div><h2>Appointment Booking</h2><p>Use the nav to login or register.</p></div>} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </div>
  );
}
