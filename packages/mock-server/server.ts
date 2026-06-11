import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Simulate realistic network latency
app.use((_req, _res, next) => {
  setTimeout(() => next(), 300);
});

const dbPath = path.join(__dirname, 'db.json');

let _db: ReturnType<typeof JSON.parse> | null = null;
function getDb() {
  if (!_db) _db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  return _db;
}

app.get('/hero', (_req, res) => {
  res.json(getDb().hero);
});

app.get('/member', (_req, res) => {
  res.json(getDb().member);
});

app.get('/plan', (_req, res) => {
  res.json(getDb().plan);
});

app.get('/quickActions', (_req, res) => {
  res.json(getDb().quickActions);
});

app.get('/recentActivity', (_req, res) => {
  res.json(getDb().recentActivity);
});

app.get('/actionAlert', (_req, res) => {
  res.json(getDb().actionAlert);
});

app.get('/navigation', (_req, res) => {
  res.json(getDb().navigation);
});

app.get('/benefits', (_req, res) => {
  res.json(getDb().benefits);
});

app.get('/wellnessWisdom', (_req, res) => {
  res.json(getDb().wellnessWisdom);
});

app.get('/claims', (_req, res) => {
  res.json(getDb().claims);
});

app.get('/claims/:id', (req, res) => {
  const claim = getDb().claims.find((c: any) => c.id === req.params.id);
  if (!claim) return res.status(404).json({ error: 'Not found' });
  res.json(claim);
});

app.get('/reviews', (_req, res) => {
  res.json(getDb().reviews);
});

app.get('/prescriptions', (_req, res) => {
  res.json(getDb().prescriptions);
});

app.get('/providers/:id', (req, res) => {
  const provider = getDb().providers.find((p: any) => p.id === req.params.id);
  if (!provider) return res.status(404).json({ error: 'Not found' });
  res.json(provider);
});

app.get('/medicalHistory', (_req, res) => {
  res.json(getDb().medicalHistory);
});

app.get('/settings', (_req, res) => {
  res.json(getDb().settings);
});

app.patch('/settings/member', (req, res) => {
  const db = getDb();
  db.settings.member = { ...db.settings.member, ...req.body };
  fs.promises.writeFile(dbPath, JSON.stringify(db, null, 2)).catch(() => {});
  res.json(db.settings.member);
});

app.patch('/settings/preferences', (req, res) => {
  const db = getDb();
  db.settings.preferences = { ...db.settings.preferences, ...req.body };
  fs.promises.writeFile(dbPath, JSON.stringify(db, null, 2)).catch(() => {});
  res.json(db.settings.preferences);
});

app.patch('/notifications/:id/read', (req, res) => {
  const db = getDb();
  const notif = (db.notifications ?? []).find((n: any) => n.id === req.params.id);
  if (!notif) return res.status(404).json({ error: 'Not found' });
  notif.read = true;
  fs.promises.writeFile(dbPath, JSON.stringify(db, null, 2)).catch(() => {});
  res.json({ id: notif.id, read: true });
});

app.get('/notifications', (_req, res) => {
  const raw: any[] = getDb().notifications ?? [];
  const now = new Date();
  const result = raw.map(({ daysAgo = 0, hour = 9, minute = 0, ...rest }) => {
    const ts = new Date(now);
    ts.setDate(ts.getDate() - daysAgo);
    ts.setHours(hour, minute, 0, 0);
    return { ...rest, timestamp: ts.toISOString() };
  });
  res.json(result);
});

app.get('/providers', (req, res) => {
  let providers: any[] = getDb().providers;
  const { category, maxDistance, name } = req.query;

  if (category && category !== 'All') {
    providers = providers.filter(p => p.category === category);
  }
  if (maxDistance) {
    providers = providers.filter(p => p.distance <= parseFloat(maxDistance as string));
  }
  if (name) {
    const q = (name as string).toLowerCase();
    providers = providers.filter(p => p.name.toLowerCase().includes(q));
  }

  res.json(providers);
});

app.listen(PORT, '0.0.0.0', () => {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  let lanIp = 'unknown';
  for (const iface of Object.values(nets) as any[]) {
    for (const net of iface) {
      if (net.family === 'IPv4' && !net.internal) { lanIp = net.address; break; }
    }
    if (lanIp !== 'unknown') break;
  }
  console.log(`\n✅  Mock server running`);
  console.log(`   iOS  → http://localhost:${PORT}`);
  console.log(`   Android / physical device → http://${lanIp}:${PORT}\n`);
  console.log('  GET /hero');
  console.log('  GET /member');
  console.log('  GET /plan');
  console.log('  GET /quickActions');
  console.log('  GET /recentActivity');
  console.log('  GET /actionAlert');
  console.log('  GET /wellnessWisdom');
  console.log('  GET /navigation');
  console.log('  GET /benefits');
  console.log('  GET /claims');
  console.log('  GET /claims/:id');
  console.log('  GET /providers?category=&maxDistance=&name=');
  console.log('  GET /reviews');
  console.log('  GET /prescriptions');
  console.log('  GET /notifications');
  console.log('  GET /medicalHistory');
  console.log('  PATCH /notifications/:id/read\n');
});
