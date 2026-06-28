const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: '5mb' }));

// In-memory DB (para você conseguir logar e testar rapidamente)
const db = {
  users: [],
  clients: [],
  reports: []
};

// Config (padrão)
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '8h' });
}

function auth(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Sem token.' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}

// Seed de usuário (pra login funcionar sem você precisar criar backend manualmente)
async function seed() {
  if (db.users.length) return;
  const email = process.env.SEED_EMAIL || 'admin@relatoria.com';
  const password = process.env.SEED_PASSWORD || 'admin123';
  const hash = await bcrypt.hash(password, 10);
  db.users.push({
    id: nanoid(),
    email,
    passwordHash: hash
  });

  // Seed clients
  db.clients.push(
    {
      id: nanoid(),
      name: 'João Silva',
      company: 'Loja XYZ',
      email: 'joao@empresa.com',
      segment: 'E-commerce',
      plan: 'starter',
      monthlyValue: 800,
      notes: '',
      active: true,
    },
    {
      id: nanoid(),
      name: 'Maria Souza',
      company: 'Agência ABC',
      email: 'maria@abc.com',
      segment: 'Agência Digital',
      plan: 'growth',
      monthlyValue: 1600,
      notes: '',
      active: true,
    }
  );
}

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Informe email e senha.' });

  const user = db.users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas.' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Credenciais inválidas.' });

  return res.json({ token: signToken(user) });
});

app.get('/api/clients', auth, (req, res) => {
  res.json(db.clients);
});

app.post('/api/clients', auth, (req, res) => {
  const body = req.body || {};
  const required = ['name', 'company', 'email'];
  for (const k of required) {
    if (!body[k] || !String(body[k]).trim()) return res.status(400).json({ error: `Campo obrigatório: ${k}` });
  }

  const client = {
    id: nanoid(),
    name: String(body.name),
    company: String(body.company),
    email: String(body.email),
    segment: body.segment || 'E-commerce',
    plan: body.plan || 'starter',
    monthlyValue: Number(body.monthlyValue || 0),
    notes: body.notes || '',
    active: true,
  };

  db.clients.push(client);
  res.json(client);
});

app.delete('/api/clients/:id', auth, (req, res) => {
  const id = req.params.id;
  const before = db.clients.length;
  db.clients = db.clients.filter(c => c.id !== id);
  if (db.clients.length === before) return res.status(404).json({ error: 'Cliente não encontrado.' });
  return res.json({ ok: true });
});

// Geração dummy (pra front funcionar end-to-end)
app.post('/api/reports/generate', auth, (req, res) => {
  const { client_id, csv_data } = req.body || {};
  if (!client_id) return res.status(400).json({ error: 'client_id é obrigatório.' });
  if (!csv_data || !String(csv_data).trim()) return res.status(400).json({ error: 'csv_data é obrigatório.' });

  const client = db.clients.find(c => c.id === client_id);
  if (!client) return res.status(404).json({ error: 'Cliente não encontrado.' });

  const id = nanoid();
  const createdAt = new Date().toISOString();

  const report = {
    id,
    clientId: client_id,
    createdAt,
    pitchText:
      `Olá! Segue um resumo executivo para renovação.
\n- Cliente: ${client.company}
- Segmento: ${client.segment}
\nCom base nos dados enviados, preparamos KPIs e sugestões de melhoria.` ,
    kpis: {
      receitaBruta: 10000,
      lucroBruto: 4200,
      margemBruta: 42.0,
      totalVendas: 120,
      taxaCancelamento: 7.5,
      ticketMedio: 83,
      tendencia: 'crescimento',
      melhorProduto: 'Produto A',
      alertas: ['Exemplo: dados aceitos e relatório gerado.' ]
    },
    reportHtml: `
      <h1>Relatório Executivo — ${client.company}</h1>
      <p>Este relatório foi gerado para teste (dummy).</p>
      <h2>KPIs</h2>
      <ul>
        <li>Receita Bruta: R$ 10.000</li>
        <li>Lucro Bruto: R$ 4.200</li>
        <li>Margem Bruta: 42%</li>
      </ul>
      <h2>Próximos Passos</h2>
      <p>Focar em alavancas para crescimento e reduzir cancelamentos.</p>
    `
  };

  db.reports.push(report);
  res.json({ report });
});

app.get('/api/reports', auth, (req, res) => {
  // lista enxuta compatível com src/App.jsx
  const list = db.reports
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(r => ({
      id: r.id,
      clientId: r.clientId,
      createdAt: r.createdAt,
      kpis: r.kpis,
    }));
  res.json(list);
});

app.get('/api/reports/:id', auth, (req, res) => {
  const rep = db.reports.find(r => r.id === req.params.id);
  if (!rep) return res.status(404).json({ error: 'Relatório não encontrado.' });
  res.json(rep);
});

// Substitua o final do seu index.js por isto:
seed().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n==================================================`);
    console.log(`[OK] O BACKEND ESTÁ RODANDO COM SUCESSO!`);
    console.log(`[URL] Disponível em: http://localhost:${PORT}`);
    console.log(`[LOGIN] E-mail: admin@relatoria.com`);
    console.log(`[SENHA] Senha: admin123`);
    console.log(`==================================================\n`);
  });
}).catch(err => {
  console.error("Erro ao iniciar o banco de dados temporário:", err);
});


