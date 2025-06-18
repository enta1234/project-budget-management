import { useState } from 'react';

export default function Home() {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState(null);

  async function login(e) {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    setToken(data.token);
  }

  async function getProfile() {
    const res = await fetch('http://localhost:3000/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProfile(await res.json());
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={login}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="username" />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="password" type="password" />
        <button type="submit">Login</button>
      </form>
      {token && <button onClick={getProfile}>Get Profile</button>}
      {profile && <pre>{JSON.stringify(profile, null, 2)}</pre>}
    </div>
  );
}
