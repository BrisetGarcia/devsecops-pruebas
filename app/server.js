const express = require('express');
const Database = require('better-sqlite3');

const app = express();
app.use(express.json());

const db = new Database(':memory:');
db.exec('CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)');

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Consulta parametrizada: segura contra inyección SQL
  const user = db
    .prepare('SELECT id, username FROM users WHERE username = ? AND password = ?')
    .get(username, password);
  if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
  res.json({ message: 'Bienvenido', user });
});

app.listen(3000, () => console.log('App en puerto 3000'));
