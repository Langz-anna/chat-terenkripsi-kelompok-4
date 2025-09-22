require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Server
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
const AES_KEY_HEX = process.env.AES_KEY || '';
if (AES_KEY_HEX.length !== 64) {
  console.warn('WARNING: AES_KEY should be 64 hex chars (32 bytes). Current length:', AES_KEY_HEX.length);
}
const AES_KEY = Buffer.from(AES_KEY_HEX, 'hex');

// MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'kripto_demo',
  waitForConnections: true,
  connectionLimit: 10,
});

// --- enkripsi url nya ---
function encryptForUrl(plainText) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', AES_KEY, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const payload = Buffer.concat([iv, Buffer.from(encrypted, 'base64')]).toString('base64');
  return encodeURIComponent(payload);
}

function decryptFromUrl(payloadB64) {
  
  const payload = Buffer.from(decodeURIComponent(payloadB64), 'base64');
  const iv = payload.slice(0, 16);
  const ciphertext = payload.slice(16);
  const decipher = crypto.createDecipheriv('aes-256-cbc', AES_KEY, iv);
  let dec = decipher.update(ciphertext, undefined, 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

// --- enkripsi di database nya ---
function encryptText(plainText) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', AES_KEY, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const payload = Buffer.concat([iv, Buffer.from(encrypted, 'base64')]).toString('base64');
  return payload;
}

function decryptText(payloadB64) {
  const payload = Buffer.from(payloadB64, 'base64');
  const iv = payload.slice(0, 16);
  const ciphertext = payload.slice(16);
  const decipher = crypto.createDecipheriv('aes-256-cbc', AES_KEY, iv);
  let dec = decipher.update(ciphertext, undefined, 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

// --- endpoints: register, login, profile ---
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.post('/api/register', async (req, res) => {
  try {
    const { username, password, display_name } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username & password required' });
    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (username, password_hash, display_name) VALUES (?, ?, ?)',
      [username, password_hash, display_name || username]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('Register error:', err.message);
    if (err && err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'username already exists' });
    res.status(500).json({ error: 'db error', detail: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.query('SELECT id, password_hash FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(401).json({ error: 'invalid credentials' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });

    const uidEncrypted = encryptForUrl(String(user.id));
    const profileUrl = `/profile.html?uid=${uidEncrypted}`;
    console.log('Login success, profileUrl =', profileUrl);
    res.json({ success: true, profileUrl });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'internal error', detail: err.message });
  }
});

// profile API
app.get('/api/profile', async (req, res) => {
  const uid = req.query.uid;
  if (!uid) return res.status(400).json({ error: 'uid required' });
  try {
    const idStr = decryptFromUrl(uid);
    const id = parseInt(idStr, 10);
    if (isNaN(id)) throw new Error('invalid id');
    const [rows] = await pool.query('SELECT id, username, display_name, created_at FROM users WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'user not found' });
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    console.error('Profile error:', err && err.message ? err.message : err);
    res.status(400).json({ error: 'invalid uid or decryption failed', detail: err.message });
  }
});


// ------------------ chat endpoints ------------------

// GET /api/users
// returns list of users with encrypted uid (so frontend can reference receiver securely)
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, display_name FROM users ORDER BY created_at DESC');
    const out = rows.map(r => ({
      username: r.username,
      display_name: r.display_name,
      uid: encryptForUrl(String(r.id))
    }));
    res.json({ success: true, users: out });
  } catch (err) {
    console.error('GET /api/users error:', err);
    res.status(500).json({ error: 'db error', detail: err.message });
  }
});

// POST /api/send
app.post('/api/send', async (req, res) => {
  try {
    const { senderUid, receiverUid, message } = req.body;
    if (!senderUid || !receiverUid || !message) return res.status(400).json({ error: 'missing fields' });

    
    const senderId = parseInt(decryptFromUrl(senderUid), 10);
    const receiverId = parseInt(decryptFromUrl(receiverUid), 10);
    if (isNaN(senderId) || isNaN(receiverId)) throw new Error('invalid uid');

    
    const message_encrypted = encryptText(message);
    await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, message_encrypted) VALUES (?, ?, ?)',
      [senderId, receiverId, message_encrypted]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('POST /api/send error:', err && err.message ? err.message : err);
    res.status(500).json({ error: 'send failed', detail: err.message });
  }
});

// GET /api/messages?uid=...&with=...
app.get('/api/messages', async (req, res) => {
  try {
    const uid = req.query.uid;
    const withUid = req.query.with;
    if (!uid || !withUid) return res.status(400).json({ error: 'uid & with required' });

    const userA = parseInt(decryptFromUrl(uid), 10);
    const userB = parseInt(decryptFromUrl(withUid), 10);
    if (isNaN(userA) || isNaN(userB)) throw new Error('invalid uid');

    const [rows] = await pool.query(
      `SELECT id, sender_id, receiver_id, message_encrypted, created_at
       FROM messages
       WHERE (sender_id = ? AND receiver_id = ?)
          OR (sender_id = ? AND receiver_id = ?)
       ORDER BY created_at ASC`,
      [userA, userB, userB, userA]
    );

    // decrypt messages
    const msgs = rows.map(r => {
      let plain = '';
      try {
        plain = decryptText(r.message_encrypted);
      } catch (e) {
        console.error('decryptText failed for message id', r.id, e.message);
        plain = '[decryption failed]';
      }
      return {
        id: r.id,
        sender_id: r.sender_id,
        receiver_id: r.receiver_id,
        message: plain,
        created_at: r.created_at
      };
    });

    res.json({ success: true, messages: msgs });
  } catch (err) {
    console.error('GET /api/messages error:', err && err.message ? err.message : err);
    res.status(500).json({ error: 'failed', detail: err.message });
  }
});


app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
