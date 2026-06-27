# RelatorIA 📊

Serviço de análise de dados com IA. Cole uma planilha CSV e gere relatórios executivos profissionais com métricas, insights e pitch de renovação — em segundos.

## Stack
- React + Vite
- Google Gemini API (gratuito)
- localStorage para persistência

## Como rodar localmente

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USUARIO/relatoria.git
cd relatoria

# 2. Instale as dependências
npm install

# 3. Rode o projeto
npm run dev
```

Acesse: http://localhost:5173

## Configuração

1. Acesse **⚙ Configurações** no app
2. Cole sua `GEMINI_API_KEY` (gratuita em [aistudio.google.com](https://aistudio.google.com))
3. Defina sua senha de acesso
4. Salve — pronto!

## Funcionalidades

- 🔐 Login com senha personalizada
- 👥 Cadastro e gestão de clientes com MRR
- 📊 Geração de relatórios via 3 sub-agentes de IA em sequência:
  - **Agente KPI** — extrai métricas dos dados brutos
  - **Agente Relatório** — gera relatório executivo em HTML
  - **Agente Pitch** — escreve proposta de renovação de contrato
- 📄 Upload de arquivos CSV/TXT
- 🖨️ Impressão e cópia do relatório
- 💾 Histórico completo de relatórios

## Modelo de negócio

Ofereça este serviço por R$600–R$2.500/mês para e-commerces, agências digitais e varejo.  
Com 6 clientes = R$4.800/mês recorrente. Custo de operação: praticamente zero.

---

by **Firsight** · Eduardo Henry Carvalho
