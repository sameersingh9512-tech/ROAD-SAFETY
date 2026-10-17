const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 8000;
const API_ROOT = '/api';
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const REPORTS_FILE = path.join(DATA_DIR, 'reports.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(REPORTS_FILE)) {
  fs.writeFileSync(REPORTS_FILE, JSON.stringify([], null, 2));
}

const readJsonFile = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return [];
  }
};

const writeJsonFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const hashPassword = (password) => crypto.createHash('sha256').update(password).digest('hex');
const verifyPassword = (password, storedHash) => hashPassword(password) === storedHash;

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(payload));
};

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`);
  const pathname = url.pathname;

  if (pathname === `${API_ROOT}/auth.php`) {
    if (req.method !== 'POST') {
      sendJson(res, 405, { status: 'error', message: 'Method not allowed.' });
      return;
    }

    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      let payload = {};
      try {
        payload = body ? JSON.parse(body) : {};
      } catch {
        payload = {};
      }

      const action = (payload.action || 'login').toLowerCase();
      const name = String(payload.name || '').trim();
      const email = String(payload.email || '').trim().toLowerCase();
      const password = String(payload.password || '');
      const role = ['user', 'authority'].includes(payload.role) ? payload.role : 'user';

      const users = readJsonFile(USERS_FILE);

      if (action === 'signup') {
        if (!name || !email || password.length < 6) {
          sendJson(res, 400, { status: 'error', message: 'Please provide a name, a valid email, and a password with at least 6 characters.' });
          return;
        }

        if (users.some((user) => user.email === email)) {
          sendJson(res, 409, { status: 'error', message: 'An account with this email already exists.' });
          return;
        }

        const newUser = {
          id: Date.now(),
          name,
          email,
          password: hashPassword(password),
          role,
          createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        writeJsonFile(USERS_FILE, users);

        sendJson(res, 200, { status: 'success', message: 'Account created successfully', role, email });
        return;
      }

      if (!email || password.length < 1) {
        sendJson(res, 400, { status: 'error', message: 'Please provide an email and password.' });
        return;
      }

      const user = users.find((entry) => entry.email === email);
      if (!user || !verifyPassword(password, user.password)) {
        sendJson(res, 400, { status: 'error', message: 'Invalid email or password.' });
        return;
      }

      sendJson(res, 200, { status: 'success', message: 'Login successful', role: user.role, name: user.name, email: user.email });
    });

    return;
  }

  if (pathname === `${API_ROOT}/reports.php`) {
    if (req.method !== 'POST') {
      sendJson(res, 405, { status: 'error', message: 'Method not allowed.' });
      return;
    }

    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      let payload = {};
      try {
        payload = body ? JSON.parse(body) : {};
      } catch {
        payload = {};
      }

      const reports = readJsonFile(REPORTS_FILE);
      reports.push({
        id: Date.now(),
        type: payload.type || 'general',
        description: payload.description || 'No details provided',
        createdAt: new Date().toISOString(),
      });
      writeJsonFile(REPORTS_FILE, reports);

      sendJson(res, 200, { status: 'success', message: 'Report submitted successfully', type: payload.type || 'general', description: payload.description || 'No details provided' });
    });

    return;
  }

  sendJson(res, 404, { status: 'error', message: 'Endpoint not found.' });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend listening on http://127.0.0.1:${PORT}`);
});
