import { useState, useEffect, useRef } from "react";

// ── TOKENS ───────────────────────────────────────────────────
const G   = "#2DC76D";
const GL  = "#F0FBF5";
const GD  = "#1FAE58";
const TX  = "#111827";
const TS  = "#4B5563";
const TM  = "#9CA3AF";
const BD  = "#E5E7EB";
const BG  = "#FFFFFF";
const RED = "#EF4444";
const REDL = "#FEF2F2";

// ── API (backend Node.js local) ───────────────────────────────
const API = "http://localhost:3001/api";

function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  return fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  }).then(async (r) => {
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Erro na requisição");
    return data;
  });
}


// ── UTILS ────────────────────────────────────────────────────
const uid  = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
const brl  = n  => "R$ " + Number(n || 0).toLocaleString("pt-BR", { maximumFractionDigits: 0 });
const pct  = n  => Number(n || 0).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + "%";
const dt   = s  => new Date(s).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

// ── STYLE HELPERS ────────────────────────────────────────────
const btn = (variant = "primary") => ({
  display: "inline-flex", alignItems: "center", gap: 7,
  padding: "8px 16px", borderRadius: 999, cursor: "pointer",
  fontWeight: 700, fontSize: 13, border: "none",
  transition: "all 0.15s", fontFamily: "inherit",
  ...(variant === "primary"
    ? { background: G, color: "#fff" }
    : variant === "ghost"
    ? { background: GL, color: GD, border: `1px solid ${G}33` }
    : variant === "danger"
    ? { background: REDL, color: RED, border: `1px solid ${RED}33` }
    : { background: "transparent", color: TS, border: `1px solid ${BD}` }
  ),
});
const inp = {
  width: "100%", padding: "9px 12px", borderRadius: 8,
  border: `1px solid ${BD}`, fontSize: 13, color: TX,
  outline: "none", fontFamily: "inherit", background: "#FAFAFA",
};
const lbl = {
  fontSize: 10, fontWeight: 700, color: TM, display: "block",
  marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px",
};
const card = {
  background: BG, border: `1px solid ${BD}`,
  borderRadius: 12, padding: "16px 18px",
};

const SEGS = ["E-commerce", "Agência Digital", "Varejo Físico", "Serviços", "Restaurante", "Outro"];

// ── LOGO ─────────────────────────────────────────────────────
function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <div style={{ width: 30, height: 30, background: G, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
          <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.95" />
          <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" opacity="0.7" />
          <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.7" />
          <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" opacity="0.45" />
        </svg>
      </div>
      <span style={{ fontWeight: 900, fontSize: 15, color: TX, letterSpacing: "-0.5px" }}>RelatorIA</span>
    </div>
  );
}

// ── NAVBAR ───────────────────────────────────────────────────
function Navbar({ page, go, onLogout }) {
  const nav = [
    { k: "dashboard", l: "Dashboard" },
    { k: "clients",   l: "Clientes"  },
    { k: "reports",   l: "Relatórios"},
  ];
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(255,255,255,0.97)",
      backdropFilter: "blur(10px)",
      borderBottom: `1px solid ${BD}`,
      padding: "0 28px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 54,
    }}>
      <Logo />
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {nav.map(n => (
          <button key={n.k} onClick={() => go(n.k)} style={{
            background: page === n.k ? GL : "transparent",
            color: page === n.k ? GD : TM,
            border: "none", borderRadius: 8,
            padding: "6px 14px",
            fontWeight: page === n.k ? 700 : 500,
            fontSize: 13, cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.15s",
          }}>
            {n.l}
          </button>
        ))}

        <div style={{ width: 1, height: 18, background: BD, margin: "0 10px" }} />

        {/* ── BOTÃO SAIR — VERMELHO E BONITO ── */}

        <button onClick={onLogout} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: `linear-gradient(135deg, ${RED}, #DC2626)`,
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "7px 14px",
          cursor: "pointer",
          fontWeight: 700, fontSize: 13,
          fontFamily: "inherit",
          boxShadow: `0 2px 8px ${RED}44`,
          transition: "all 0.15s",
          marginLeft: 4,
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 4px 14px ${RED}55`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 2px 8px ${RED}44`; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sair
        </button>
      </div>
    </nav>
  );
}

// ── LOGIN ────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");


  async function go() {
    setErr("");
    if (!email.trim()) return setErr("Informe o e-mail.");
    if (!pw) return setErr("Informe a senha.");

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password: pw }),
      });
      localStorage.setItem("token", data.token);
      onLogin();
    } catch (e) {
      setErr("Erro: " + e.message);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...card, width: 360, padding: 40 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Logo />
          <p style={{ color: TM, fontSize: 12, marginTop: 10 }}>Painel · Acesso restrito</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={lbl}>E-mail</label>
            <input
              style={inp}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && go()}
              placeholder="voce@empresa.com"
            />
          </div>
          <div>
            <label style={lbl}>Senha</label>
            <div style={{ position: "relative" }}>
              <input
                style={{ ...inp, paddingRight: 46 }}
                type={showPw ? "text" : "password"}
                value={pw}
                onChange={e => setPw(e.target.value)}
                onKeyDown={e => e.key === "Enter" && go()}
                placeholder="••••••••"
                aria-label="Senha"
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? "Ocultar senha" : "Mostrar senha"}
                title={showPw ? "Ocultar senha" : "Mostrar senha"}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  border: `1px solid ${BD}`,
                  background: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.15s",
                  padding: 0,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = G;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${G}18`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = BD;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {showPw ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GD} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7-10-7-10-7" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={TM} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7-10-7-10-7" />
                    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                    <path d="M1 1l22 22" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {err && <p style={{ color: RED, fontSize: 12 }}>{err}</p>}
          <button style={{ ...btn(), width: "100%", justifyContent: "center", padding: "12px" }} onClick={go}>
            Entrar
          </button>
          <p style={{ textAlign: "center", fontSize: 11, color: TM }}>Acesso via conta autorizada</p>
        </div>
      </div>
    </div>
  );
}


// ── DASHBOARD ────────────────────────────────────────────────
function Dashboard({ clients, reports, go, setRep }) {
  const active = clients.filter(c => c.active);
  const week   = reports.filter(r => (Date.now() - new Date(r.createdAt)) / 864e5 <= 7);

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "52px 24px" }}>
      {/* Badge */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 16px", border: `1px solid ${G}44`, borderRadius: 999, background: GL }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: G }} />
          <span style={{ fontSize: 12, color: TS }}>Relatórios automáticos com IA · v1.0</span>
        </div>
      </div>

      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 style={{ fontSize: 50, fontWeight: 900, lineHeight: 1.1, color: TX, margin: "0 0 14px", letterSpacing: "-2px" }}>
          Seus dados, <span style={{ color: G }}>em um relatório.</span>
        </h1>
        <p style={{ fontSize: 15, color: TS, maxWidth: 480, margin: "0 auto", lineHeight: 1.65 }}>
          Cole uma planilha CSV e gere um relatório executivo profissional com métricas, insights e pitch — em segundos.
        </p>
      </div>

      {/* CTA */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 44 }}>
        <button style={{ ...btn(), padding: "13px 32px", fontSize: 15, boxShadow: `0 6px 22px ${G}44` }} onClick={() => go("new-report")}>
          ✦ Novo Relatório
        </button>
      </div>

      {/* Métricas */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 44 }}>
        {[
          { v: reports.length, l: "RELATÓRIOS GERADOS" },
          { v: week.length,    l: "ESTA SEMANA"        },
          { v: active.length,  l: "CLIENTES ATIVOS"    },
        ].map((m, i, a) => (
          <div key={i} style={{ flex: 1, textAlign: "center", padding: "14px 20px", borderRight: i < a.length - 1 ? `1px solid ${BD}` : "none" }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: TX, letterSpacing: "-1px" }}>{m.v}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: TM, letterSpacing: "0.8px", marginTop: 4 }}>{m.l}</div>
          </div>
        ))}
      </div>

      {/* Recentes */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: TM, textTransform: "uppercase", letterSpacing: "0.8px" }}>◷ Relatórios recentes</span>
          <button onClick={() => go("reports")} style={{ background: "none", border: "none", color: G, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Ver todos</button>
        </div>

        {reports.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <p style={{ color: TM, fontSize: 13, marginBottom: 10 }}>Nenhum relatório gerado ainda.</p>
            <button style={{ background: "none", border: "none", color: G, fontSize: 13, fontWeight: 700, cursor: "pointer" }} onClick={() => go("new-report")}>
              Gerar primeiro relatório
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {reports.slice(0, 5).map(r => {
              const c = clients.find(x => x.id === r.clientId);
              return (
                <div key={r.id} onClick={() => { setRep(r.id); go("report-detail"); }}
                  style={{ ...card, padding: "11px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", borderLeft: `3px solid ${G}`, borderRadius: "0 12px 12px 0", transition: "box-shadow 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = `0 4px 16px ${BD}`}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: TX }}>{c?.company || "—"}</div>
                    <div style={{ fontSize: 11, color: TM, marginTop: 2 }}>
                      {r.kpis?.tendencia === "crescimento" ? "📈" : r.kpis?.tendencia === "queda" ? "📉" : "➡"} {r.kpis?.periodo}
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: TM }}>{dt(r.createdAt)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── CLIENTS ──────────────────────────────────────────────────
function Clients({ clients, setClients }) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", segment: "E-commerce", plan: "starter", monthlyValue: 800, notes: "" });
  const f = v => setForm(p => ({ ...p, ...v }));
  const active = clients.filter(c => c.active);
  const mrr    = active.reduce((s, c) => s + (c.monthlyValue || 0), 0);

  async function reload() {
    const list = await apiFetch("/clients");
    setClients(list);
  }

  async function add() {
    try {
      await apiFetch("/clients", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setShow(false);
      setForm({ name: "", company: "", email: "", segment: "E-commerce", plan: "starter", monthlyValue: 800, notes: "" });
      await reload();
    } catch (e) {
      alert(e.message);
    }
  }

  async function rem(id) {
    if (!confirm("Remover este cliente?")) return;
    await apiFetch(`/clients/${id}`, { method: "DELETE" });
    await reload();
  }


  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: TX, margin: 0 }}>Clientes</h2>
          <p style={{ fontSize: 12, color: TM, marginTop: 3 }}>{active.length} ativos · MRR: {brl(mrr)}/mês</p>
        </div>
        <button style={btn()} onClick={() => setShow(!show)}>+ Novo cliente</button>
      </div>

      {show && (
        <div style={{ ...card, marginBottom: 18 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 14px", color: TX }}>Novo cliente</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { k: "name",    l: "Nome do contato", p: "João Silva"        },
              { k: "company", l: "Empresa",          p: "Loja XYZ"          },
              { k: "email",   l: "E-mail",           p: "joao@empresa.com"  },
            ].map(x => (
              <div key={x.k}>
                <label style={lbl}>{x.l}</label>
                <input style={inp} value={form[x.k]} placeholder={x.p} onChange={e => f({ [x.k]: e.target.value })} />
              </div>
            ))}
            <div>
              <label style={lbl}>Segmento</label>
              <select style={inp} value={form.segment} onChange={e => f({ segment: e.target.value })}>
                {SEGS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Plano</label>
              <select style={inp} value={form.plan} onChange={e => f({ plan: e.target.value })}>
                {["starter", "growth", "pro"].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Valor/mês (R$)</label>
              <input style={inp} type="number" value={form.monthlyValue} onChange={e => f({ monthlyValue: Number(e.target.value) })} />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={lbl}>Notas internas</label>
              <textarea style={{ ...inp, resize: "vertical" }} rows={2} value={form.notes} onChange={e => f({ notes: e.target.value })} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button style={btn()} onClick={add}>Salvar</button>
            <button style={btn("outline")} onClick={() => setShow(false)}>Cancelar</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {active.map(c => (
          <div key={c.id} style={{ ...card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: TX }}>{c.company}</div>
              <div style={{ fontSize: 11, color: TM, marginTop: 2 }}>{c.name} · {c.email} · {c.segment}</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ background: GL, color: GD, padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700 }}>{brl(c.monthlyValue)}/mês</span>
              <span style={{ background: "#F3F4F6", color: TS, padding: "2px 10px", borderRadius: 999, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>{c.plan}</span>
              <button onClick={() => rem(c.id)} style={{ background: REDL, color: RED, border: "none", borderRadius: 7, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>✕</button>
            </div>
          </div>
        ))}
        {active.length === 0 && (
          <p style={{ color: TM, fontSize: 13, textAlign: "center", padding: "28px 0" }}>Nenhum cliente. Crie o primeiro!</p>
        )}
      </div>
    </div>
  );
}

// ── NEW REPORT ───────────────────────────────────────────────
function NewReport({ clients, setReports, setRep, go }) {
  const active      = clients.filter(c => c.active);
  const [cid,  setCid]  = useState(active[0]?.id || "");
  const [csv,  setCsv]  = useState("");
  const [step, setStep] = useState(0);
  const [err,  setErr]  = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);


  function readFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const r = new FileReader();
    r.onload = ev => setCsv(ev.target.result);
    r.readAsText(file);
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  async function generate() {
    if (!cid)       { setErr("Selecione um cliente."); return; }
    if (!csv.trim()){ setErr("Cole ou faça upload dos dados CSV."); return; }
    setErr("");

    try {
      setStep(1);
      const res = await apiFetch("/reports/generate", {
        method: "POST",
        body: JSON.stringify({ client_id: cid, csv_data: csv }),
      });

      const { report } = res || {};
      if (!report?.id) throw new Error("Resposta inválida do servidor.");

      setStep(4);
      // Recarrega via App para manter estado consistente
      setTimeout(() => {
        setRep(report.id);
        go("report-detail");
      }, 700);
    } catch (e) {
      setErr("Erro: " + e.message);
      setStep(0);
    }
  }


  const steps = [
    { n: 1, l: "Agente KPI",      d: "Extraindo métricas dos dados..."    },
    { n: 2, l: "Agente Relatório",d: "Gerando relatório executivo HTML..." },
    { n: 3, l: "Agente Pitch",    d: "Escrevendo proposta de renovação..."  },
  ];

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px" }}>
      <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 22px", color: TX }}>✦ Novo relatório</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 210px", gap: 18 }}>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={lbl}>Cliente</label>
            <select style={inp} value={cid} onChange={e => setCid(e.target.value)}>
              {active.length === 0 && <option value="">— Cadastre um cliente primeiro —</option>}
              {active.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
            </select>
          </div>

          <div>
            {/* Input real — invisível mas acessível */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt,.tsv"
              onChange={readFile}
              style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
            />
            <label style={lbl}>Upload de arquivo (.csv, .txt)</label>
            <button
              onClick={openFilePicker}
              style={{
                width: "100%", padding: "14px", borderRadius: 10,
                border: `2px dashed ${BD}`, background: "#FAFAFA",
                cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 8, color: fileName ? GD : TM, fontSize: 13,
                fontWeight: fileName ? 700 : 400,
                marginBottom: 10, transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = G; e.currentTarget.style.background = GL; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = BD; e.currentTarget.style.background = "#FAFAFA"; }}
            >
              {fileName ? `✓ ${fileName}` : "📎 Clique para selecionar arquivo"}
            </button>
            <label style={lbl}>Ou cole os dados aqui</label>
            <textarea style={{ ...inp, fontFamily: "monospace", fontSize: 11, resize: "vertical" }} rows={9}
              value={csv} onChange={e => setCsv(e.target.value)}
              placeholder={"Data,Produto,Vendas,Receita,Custo\n2024-01-01,Produto A,42,8400,4200\n..."} />
          </div>

          {err && (
            <div style={{ background: REDL, border: "1px solid #FECACA", borderRadius: 10, padding: "9px 13px", color: RED, fontSize: 12 }}>{err}</div>
          )}

          <button style={{ ...btn(), width: "100%", justifyContent: "center", padding: "13px", fontSize: 14, opacity: step > 0 && step < 4 ? 0.65 : 1 }}
            onClick={generate} disabled={step > 0 && step < 4}>
            {step === 0 ? "✦ Gerar Relatório com IA" : step === 4 ? "✓ Abrindo..." : "⏳ Processando..."}
          </button>
        </div>

        {/* Pipeline */}
        <div style={{ ...card, padding: 18 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: TM, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.6px" }}>Pipeline · 3 Agentes</div>
          {steps.map(s => (
            <div key={s.n} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: `1px solid ${BD}`, opacity: step === 0 || step >= s.n ? 1 : 0.3 }}>
              <div style={{ width: 23, height: 23, borderRadius: "50%", background: step > s.n ? G : step === s.n ? G : "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: step >= s.n ? "#fff" : TM, flexShrink: 0, transition: "background 0.3s" }}>
                {step > s.n ? "✓" : s.n}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: TX }}>{s.l}</div>
                <div style={{ fontSize: 10, color: TM, marginTop: 1 }}>{step === s.n ? s.d : step > s.n ? "Concluído ✓" : "Aguardando"}</div>
              </div>
            </div>
          ))}
          {step === 4 && (
            <div style={{ marginTop: 12, background: GL, border: `1px solid ${G}33`, borderRadius: 8, padding: "7px 10px", fontSize: 10, color: GD, fontWeight: 700 }}>✓ Relatório gerado!</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── REPORTS LIST ─────────────────────────────────────────────
function Reports({ reports, clients, setRep, go }) {

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px" }}>
      <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 22px", color: TX }}>Relatórios</h2>
      {reports.length === 0
        ? <p style={{ color: TM, textAlign: "center", padding: "32px 0" }}>Nenhum relatório gerado ainda.</p>
        : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {reports.map(r => {
              const c = clients.find(x => x.id === r.clientId);
              return (
                <div key={r.id} onClick={() => { setRep(r.id); go("report-detail"); }}
                  style={{ ...card, padding: "11px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", borderLeft: `3px solid ${G}`, borderRadius: "0 12px 12px 0" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = `0 4px 16px ${BD}`}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: TX }}>{c?.company || "—"}</div>
                    <div style={{ fontSize: 11, color: TM, marginTop: 2 }}>
                      {r.kpis?.tendencia === "crescimento" ? "📈" : r.kpis?.tendencia === "queda" ? "📉" : "➡"} {r.kpis?.periodo} · {brl(r.kpis?.receitaBruta)}
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: TM }}>{dt(r.createdAt)}</span>
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}

// ── REPORT DETAIL ────────────────────────────────────────────
function ReportDetail({ repId, clients, go }) {
  const [tab, setTab] = useState("relatorio");
  const [r, setR] = useState(null);

  useEffect(() => {
    if (!repId) return;
    apiFetch(`/reports/${repId}`).then(setR).catch(() => setR(null));
  }, [repId]);

  if (!r) return <div style={{ padding: 40, color: TM }}>Relatório não encontrado.</div>;

  const c = clients.find(x => x.id === r.clientId);
  const k = r.kpis || {};


  const kpiCards = [
    { l: "Receita Bruta",   v: brl(k.receitaBruta),    co: G    },
    { l: "Lucro Bruto",     v: brl(k.lucroBruto),      co: G    },
    { l: "Margem Bruta",    v: pct(k.margemBruta),     co: k.margemBruta > 40 ? G : "#F59E0B" },
    { l: "Total Vendas",    v: String(k.totalVendas || 0)        },
    { l: "Cancelamentos",   v: pct(k.taxaCancelamento), co: k.taxaCancelamento > 10 ? RED : "#F59E0B" },
    { l: "Ticket Médio",    v: brl(k.ticketMedio)               },
    { l: "Tendência",       v: k.tendencia === "crescimento" ? "📈 Alta" : k.tendencia === "queda" ? "📉 Queda" : "➡ Estável", co: k.tendencia === "crescimento" ? G : k.tendencia === "queda" ? RED : "#F59E0B" },
    { l: "Melhor Produto",  v: k.melhorProduto || "—"           },
  ];

  const tabs = [
    { k: "relatorio", l: "📄 Relatório" },
    { k: "pitch",     l: "🎯 Pitch"     },
    { k: "kpis",      l: "📊 KPIs"      },
  ];

  function print() {
    const w = window.open("", "_blank");
    w.document.write(`<!DOCTYPE html><html><head><title>${c?.company}</title><style>body{font-family:Arial,sans-serif;max-width:780px;margin:32px auto;color:#111}table{width:100%;border-collapse:collapse}td,th{padding:8px 12px;border:1px solid #ddd;text-align:left}th{background:#f5f5f5;font-size:12px;text-transform:uppercase}h2{color:#1FAE58}h1{font-size:22px;font-weight:900}</style></head><body>${r.reportHtml}</body></html>`);
    w.document.close();
    w.print();
  }

  const styledHtml = r.reportHtml
    .replace(/<h1/g, `<h1 style="font-size:20px;font-weight:900;color:${TX};margin:0 0 10px;letter-spacing:-0.5px"`)
    .replace(/<h2/g, `<h2 style="font-size:16px;font-weight:800;color:${G};margin:18px 0 9px"`)
    .replace(/<h3/g, `<h3 style="font-size:13px;font-weight:700;color:${TX};margin:13px 0 7px"`)
    .replace(/<p(?!r)/g, `<p style="margin:7px 0;color:${TS}"`)
    .replace(/<strong/g, `<strong style="color:${TX}"`)
    .replace(/<table/g, `<table style="width:100%;border-collapse:collapse;margin:12px 0;font-size:12px"`)
    .replace(/<th/g, `<th style="background:#F9FAFB;color:${TM};text-align:left;padding:7px 11px;border:1px solid ${BD};font-size:10px;font-weight:700;text-transform:uppercase"`)
    .replace(/<td/g, `<td style="padding:7px 11px;border:1px solid ${BD};color:${TS}"`)
    .replace(/<ul/g, `<ul style="margin:7px 0;padding-left:18px"`)
    .replace(/<li/g, `<li style="color:${TS};margin:4px 0"`)
    .replace(/<hr/g, `<hr style="border:none;border-top:1px solid ${BD};margin:13px 0"`);

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <button onClick={() => go("reports")} style={{ background: "none", border: "none", color: TM, cursor: "pointer", fontSize: 12, padding: 0, marginBottom: 8, fontFamily: "inherit" }}>← Voltar</button>
          <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: TX }}>{c?.company}</h2>
          <p style={{ fontSize: 12, color: TM, margin: "3px 0 0" }}>{dt(r.createdAt)} · {c?.segment} · Plano {c?.plan}</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={btn("outline")} onClick={() => navigator.clipboard.writeText(tab === "pitch" ? r.pitchText : r.reportHtml)}>📋 Copiar</button>
          <button style={btn("ghost")}   onClick={print}>🖨️ Imprimir</button>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 18 }}>
        {kpiCards.map((x, i) => (
          <div key={i} style={{ ...card, padding: "10px 13px" }}>
            <div style={{ fontSize: 9, color: TM, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 4 }}>{x.l}</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: x.co || TX, letterSpacing: "-0.3px" }}>{x.v}</div>
          </div>
        ))}
      </div>

      {/* Alertas */}
      {k.alertas?.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {k.alertas.map((a, i) => (
            <div key={i} style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "3px 10px", fontSize: 11, color: "#92400E" }}>⚠ {a}</div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${BD}`, marginBottom: 16 }}>
        {tabs.map(t => (
          <button key={t.k} onClick={() => setTab(t.k)} style={{ background: "none", border: "none", borderBottom: tab === t.k ? `2px solid ${G}` : "2px solid transparent", padding: "8px 16px", fontSize: 12, fontWeight: tab === t.k ? 700 : 500, color: tab === t.k ? G : TM, cursor: "pointer", fontFamily: "inherit" }}>
            {t.l}
          </button>
        ))}
      </div>

      {tab === "relatorio" && (
        <div style={{ ...card, fontSize: 13, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: styledHtml }} />
      )}
      {tab === "pitch" && (
        <div style={{ background: GL, border: `1px solid ${G}33`, borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: GD, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>🎯 Copie e envie ao cliente</div>
          <p style={{ fontSize: 13, color: TS, lineHeight: 1.8, whiteSpace: "pre-wrap", margin: 0 }}>{r.pitchText}</p>
        </div>
      )}
      {tab === "kpis" && (
        <div style={{ ...card, overflow: "auto" }}>
          <pre style={{ fontSize: 11, color: TS, margin: 0 }}>{JSON.stringify(r.kpis, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}



// ── APP ──────────────────────────────────────────────────────
export default function App() {
  const [logged,   setLogged  ] = useState(false);
  const [page,     setPage    ] = useState("dashboard");
  const [clients,  setClients ] = useState([]);
  const [reports,  setReports ] = useState([]);
  const [rep,      setRep     ] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) return;
    setLogged(true);

    apiFetch("/clients").then(setClients).catch(() => setClients([]));
    apiFetch("/reports").then(setReports).catch(() => setReports([]));
  }, []);

  async function logout() {
    localStorage.removeItem("token");
    setLogged(false);
    setPage("dashboard");
    setClients([]);
    setReports([]);
    setRep(null);
  }


  if (!logged) return <Login onLogin={() => setLogged(true)} />;


  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${BD}; border-radius: 4px; }
        input:focus, select:focus, textarea:focus {
          border-color: ${G} !important;
          box-shadow: 0 0 0 3px ${G}22 !important;
          outline: none;
        }
        button:active { transform: scale(0.98); }
      `}</style>

      <Navbar page={page} go={setPage} onLogout={logout} />


      {page === "dashboard"     && <Dashboard  clients={clients} reports={reports} go={setPage} setRep={setRep} />}
      {page === "clients"       && <Clients    clients={clients} setClients={setClients} />}
      {page === "new-report"    && <NewReport  clients={clients} setReports={setReports} setRep={setRep} go={setPage} />}
      {page === "reports"       && <Reports    reports={reports} clients={clients} setRep={setRep} go={setPage} />}
      {page === "report-detail" && <ReportDetail repId={rep} clients={clients} go={setPage} />}
    </div>

  );
}
