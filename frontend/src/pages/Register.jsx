import React, { useState } from 'react';
import { register } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const [msg,setMsg] = useState(null);
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    const res = await register(name,email,password);
    if (res.id) {
      setMsg('Registered. You may login now.');
      setTimeout(()=>navigate('/login'), 1200);
    } else {
      setMsg(res.error?.message || 'Registration failed');
    }
  }

  return (
    <form onSubmit={submit} style={{ maxWidth:420 }}>
      <h3>Register</h3>
      {msg && <div>{msg}</div>}
      <div><input placeholder="name" value={name} onChange={e=>setName(e.target.value)} /></div>
      <div><input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
      <div><input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
      <button type="submit">Register</button>
    </form>
  );
}
