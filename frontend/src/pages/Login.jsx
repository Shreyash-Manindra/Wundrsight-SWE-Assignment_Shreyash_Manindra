import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

export default function Login({ setUser }) {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [err,setErr] = useState(null);
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    setErr(null);
    const res = await login(email,password);
    if (res.token) {
      localStorage.setItem('token', res.token);
      localStorage.setItem('role', res.role);
      localStorage.setItem('name', res.name);
      setUser({ role: res.role, name: res.name });
      if (res.role === 'admin') navigate('/admin'); else navigate('/patient');
    } else {
      setErr(res.error?.message || 'Login failed');
    }
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 420 }}>
      <h3>Login</h3>
      {err && <div style={{ color:'red' }}>{err}</div>}
      <div><input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
      <div><input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
      <button type="submit">Login</button>
    </form>
  );
}
