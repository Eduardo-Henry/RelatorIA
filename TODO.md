# TODO - Integração React (src/App.jsx) com Backend Node.js

- [ ] 1) Remover callGemini, agentKPI/agentReport/agentPitch, save/load e useEffect/localStorage de clients/reports/apiKey/password
- [ ] 2) Adicionar `API = "http://localhost:3001/api"` e helper `apiFetch(path, options)` com token Bearer
- [ ] 3) Atualizar componente `Login`: adicionar campo de e-mail, chamar `/auth/login`, salvar `token` em localStorage
- [ ] 4) Atualizar `App` principal: carregar `/clients` e `/reports` via `apiFetch`, manter somente `localStorage.getItem('token')` para sessão
- [ ] 5) Atualizar `Clients`: add/rem via endpoints e recarregar lista após cada operação
- [ ] 6) Atualizar `NewReport`: gerar via `/reports/generate` sem apiKey, usar `report.id` para navegação
- [ ] 7) Atualizar `Reports`: renderizar dados carregados pelo App (via apiFetch `/reports`)
- [ ] 8) Atualizar `ReportDetail`: carregar via `apiFetch(/reports/:id)` e remover JSON.parse (kpis já parseados)
- [ ] 9) Remover componente `Settings` e link “Config” da navbar + rota settings
- [ ] 10) Testar manualmente login, clientes, geração e detalhe do relatório

