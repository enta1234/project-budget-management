const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

const API_PREFIX = process.env.API_PREFIX || '/api/v1';

// Dummy user database
const users = [
  { id: 1, username: 'admin', passwordHash: bcrypt.hashSync('password', 8) }
];

const SECRET = 'replace_this_secret';

app.post(`${API_PREFIX}/login`, (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'invalid credentials' });
  }
  const valid = bcrypt.compareSync(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: 'invalid credentials' });
  }
  const token = jwt.sign({ sub: user.id }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.get(`${API_PREFIX}/profile`, (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'missing token' });
  const token = auth.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, SECRET);
    const user = users.find(u => u.id === decoded.sub);
    res.json({ id: user.id, username: user.username });
  } catch (e) {
    res.status(401).json({ error: 'invalid token' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Service running on port ${PORT}`));
