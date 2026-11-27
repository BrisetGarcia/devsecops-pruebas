const express = require('express');
const Database = require('better-sqlite3');
const _ = require('lodash');
const config = require('./config');

const app = express();
app.use(express.json());

const db = new Database(':memory:');
db.exec('CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)');

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/login', (req, res) => {
  // VULNERABLE A PROPÓSITO (demo): concatena la entrada del usuario en la consulta SQL
  const query = "SELECT id, username FROM users WHERE username = '" + req.body.username +
    "' AND password = '" + req.body.password + "'";
  const user = db.prepare(query).get();
  if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
  res.json({ message: 'Bienvenido', user: _.pick(user, ['id', 'username']) });
});

app.listen(3000, () => console.log('App en puerto 3000 - ' + config.appName));
