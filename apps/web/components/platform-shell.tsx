"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type ViewKey = "overview" | "workflows" | "projects" | "activity" | "integrations";
type Workflow = {
  id: number;
  name: string;
  project: string;
  status: "Ativo" | "Rascunho" | "Pausado";
  runs: number;
  updated: string;
};

const initialWorkflows: Workflow[] = [
  { id: 1, name: "Onboarding de clientes", project: "Customer success", status: "Ativo", runs: 248, updated: "há 4 min" },
  { id: 2, name: "Qualificação de leads", project: "Growth engine", status: "Ativo", runs: 186, updated: "há 18 min" },
  { id: 3, name: "Triagem de suporte", project: "Customer success", status: "Pausado", runs: 64, updated: "há 2 h" },
  { id: 4, name: "Resumo semanal", project: "Operations", status: "Rascunho", runs: 0, updated: "ontem" },
];

const projects = [
  { name: "Customer success", description: "Jornadas e suporte ao cliente", workflows: 8, color: "mint" },
  { name: "Growth engine", description: "Aquisição, leads e campanhas", workflows: 6, color: "blue" },
  { name: "Operations", description: "Rotinas internas da equipe", workflows: 4, color: "orange" },
];

const navItems: { key: ViewKey; label: string; icon: string }[] = [
  { key: "overview", label: "Visão geral", icon: "grid" },
  { key: "workflows", label: "Workflows", icon: "workflow" },
  { key: "projects", label: "Projetos", icon: "folder" },
  { key: "activity", label: "Atividade", icon: "activity" },
  { key: "integrations", label: "Integrações", icon: "plug" },
];

const activityItems = [
  { name: "Onboarding de clientes", detail: "Execução concluída", time: "09:42:18", status: "success" },
  { name: "Qualificação de leads", detail: "Novo lead processado", time: "09:39:02", status: "success" },
  { name: "Triagem de suporte", detail: "Workflow pausado", time: "09:25:41", status: "paused" },
  { name: "Onboarding de clientes", detail: "Execução concluída", time: "09:18:06", status: "success" },
];

const executionSeries = [
  { day: "07 nov", runs: 870 },
  { day: "08 nov", runs: 1118 },
  { day: "09 nov", runs: 1090 },
  { day: "10 nov", runs: 1268 },
  { day: "11 nov", runs: 1112 },
  { day: "12 nov", runs: 1370 },
  { day: "13 nov", runs: 1634 },
];

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    workflow: <><rect x="3" y="4" width="6" height="6" rx="1.5" /><rect x="15" y="14" width="6" height="6" rx="1.5" /><path d="M9 7h3a3 3 0 0 1 3 3v4" /><path d="m12 12 3 3 3-3" /></>,
    folder: <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
    activity: <><path d="M3 12h4l3-8 4 16 3-8h4" /></>,
    plug: <><path d="M8 3v5M16 3v5M6 8h12v2a6 6 0 0 1-6 6v5" /><path d="M4 8h16" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    spark: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7z" /><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
  };

  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name] ?? paths.grid}</svg>;
}

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><span /></span>;
}

function Status({ status }: { status: Workflow["status"] }) {
  const className = status === "Ativo" ? "status status-active" : status === "Pausado" ? "status status-paused" : "status status-draft";
  return <span className={className}><span className="status-dot" />{status}</span>;
}

function MetricCard({ label, value, change, icon, note }: { label: string; value: string; change: string; icon: string; note: string }) {
  return (
    <article className="metric-card">
      <div className="metric-top"><span className="metric-label">{label}</span><span className="metric-icon"><Icon name={icon} size={17} /></span></div>
      <div className="metric-value">{value}</div>
      <div className="metric-foot"><span className="metric-change">{change}</span><span>{note}</span></div>
    </article>
  );
}

function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return <div className="section-heading"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2></div>{action}</div>;
}

function WorkflowTable({ items, onOpen }: { items: Workflow[]; onOpen: (workflow: Workflow) => void }) {
  if (!items.length) return <div className="empty-state"><span className="empty-icon"><Icon name="workflow" size={22} /></span><h3>Nenhum workflow encontrado</h3><p>Tente mudar a busca ou crie um novo workflow.</p></div>;
  return (
    <div className="table-wrap"><table className="workflow-table"><thead><tr><th>Nome</th><th>Projeto</th><th>Status</th><th>Execuções</th><th>Atualizado</th></tr></thead>
      <tbody>{items.map((item) => <tr key={item.id}>
        <td><button className="workflow-row-link" onClick={() => onOpen(item)}><span className="workflow-glyph"><Icon name="workflow" size={16} /></span><strong>{item.name}</strong></button></td><td className="muted-cell">{item.project}</td><td><Status status={item.status} /></td><td>{item.runs.toLocaleString("pt-BR")}</td><td className="muted-cell">{item.updated}</td>
      </tr>)}</tbody></table></div>
  );
}

function ActivityFeed() {
  return <div className="activity-feed">{activityItems.map((item, index) => <div className="feed-item" key={`${item.time}-${index}`}><span className={`feed-mark ${item.status}`}><Icon name={item.status === "success" ? "check" : "clock"} size={13} /></span><div className="feed-copy"><strong>{item.name}</strong><span>{item.detail}</span></div><time>{item.time}</time></div>)}</div>;
}

function Overview({ workflows, onNavigate, onOpen, onCreate, showDemoNotice, onDismissNotice }: { workflows: Workflow[]; onNavigate: (key: ViewKey) => void; onOpen: (workflow: Workflow) => void; onCreate: () => void; showDemoNotice: boolean; onDismissNotice: () => void }) {
  const latest = workflows.slice(0, 4);
  return <>
    <div className="page-intro"><div><p className="eyebrow">SEXTA-FEIRA, 13 DE NOVEMBRO</p><h1>Seu workspace, em foco.</h1><p className="intro-subtitle">Acompanhe seus projetos e automações em um só lugar.</p></div><button className="primary-button" onClick={onCreate}><Icon name="plus" size={17} /> Novo workflow</button></div>
    {showDemoNotice && <div className="demo-notice"><span className="notice-dot" /><span><strong>Ambiente de demonstração</strong> · números e execuções são exemplos; ainda não vêm da API.</span><button aria-label="Fechar aviso" className="notice-close" onClick={onDismissNotice}><Icon name="close" size={15} /></button></div>}
    <section className="metrics-grid" aria-label="Indicadores do workspace">
      <MetricCard label="Workflows ativos" value="18" change="+12,8%" note="vs. período anterior" icon="workflow" />
      <MetricCard label="Execuções hoje" value="1.284" change="+8,2%" note="vs. período anterior" icon="activity" />
      <MetricCard label="Taxa de sucesso" value="94,2%" change="+2,4%" note="vs. período anterior" icon="check" />
      <MetricCard label="Projetos" value="03" change="+1 novo" note="neste mês" icon="folder" />
    </section>
    <section className="overview-grid">
      <article className="surface chart-card"><div className="card-heading"><div><p className="eyebrow">DESEMPENHO</p><h2>Execuções ao longo do tempo</h2></div><span className="select-button">Últimos 7 dias</span></div>
        <div className="chart-summary"><strong>8.462</strong><span className="chart-up">↗ 12,8%</span><span>vs. semana anterior</span></div>
        <div className="chart-area" role="img" aria-label="Gráfico de exemplo com execuções diárias entre 7 e 13 de novembro">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart accessibilityLayer data={executionSeries} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--line)" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#899087", fontSize: 10 }} minTickGap={12} />
              <YAxis width={42} domain={[0, 2000]} ticks={[0, 500, 1000, 1500, 2000]} axisLine={false} tickLine={false} tick={{ fill: "#899087", fontSize: 9 }} tickFormatter={(value: number) => value.toLocaleString("pt-BR")} />
              <Tooltip cursor={false} contentStyle={{ border: "1px solid var(--line)", borderRadius: 8, fontSize: 11 }} labelFormatter={(label) => `Dia ${label}`} />
              <Bar dataKey="runs" name="Execuções" radius={[4, 4, 0, 0]} maxBarSize={28}>
                {executionSeries.map((entry, index) => <Cell key={entry.day} fill={index === executionSeries.length - 1 ? "var(--chart-accent)" : "var(--chart-muted)"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
      <article className="surface activity-card"><div className="card-heading"><div><p className="eyebrow">AGORA</p><h2>Atividade recente</h2></div><button className="text-button" onClick={() => onNavigate("activity")}>Ver tudo <Icon name="arrow" size={15} /></button></div><ActivityFeed /></article>
    </section>
    <section className="surface recent-card"><div className="card-heading"><div><p className="eyebrow">NO SEU WORKSPACE</p><h2>Workflows recentes</h2></div><button className="text-button" onClick={() => onNavigate("workflows")}>Ver workflows <Icon name="arrow" size={15} /></button></div><WorkflowTable items={latest} onOpen={onOpen} /></section>
  </>;
}

function WorkflowsView({ workflows, query, onOpen, onCreate }: { workflows: Workflow[]; query: string; onOpen: (workflow: Workflow) => void; onCreate: () => void }) {
  const filtered = workflows.filter((item) => `${item.name} ${item.project} ${item.status}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="subpage"><div className="page-intro"><div><p className="eyebrow">AUTOMAÇÕES</p><h1>Workflows</h1><p className="intro-subtitle">Crie e organize as automações dos seus projetos.</p></div><button className="primary-button" onClick={onCreate}><Icon name="plus" size={17} /> Novo workflow</button></div><section className="surface recent-card"><div className="card-heading"><div><h2>Todos os workflows</h2><p className="card-caption">{filtered.length} de {workflows.length} workflows neste workspace</p></div><span className="demo-tag">Dados de exemplo</span></div><WorkflowTable items={filtered} onOpen={onOpen} /></section></div>;
}

function ProjectsView({ onNotify }: { onNotify: (message: string) => void }) {
  return <div className="subpage"><div className="page-intro"><div><p className="eyebrow">ORGANIZAÇÃO</p><h1>Projetos</h1><p className="intro-subtitle">Workflows organizados por objetivo e equipe.</p></div><button className="primary-button" onClick={() => onNotify("A criação de projetos ainda não está disponível neste protótipo.")}><Icon name="plus" size={17} /> Novo projeto</button></div><div className="project-grid">{projects.map((project) => <article className="surface project-card" key={project.name}><div className={`project-icon ${project.color}`}><Icon name="folder" size={20} /></div><button className="icon-button" aria-label={`Opções de ${project.name}`} disabled><Icon name="more" /></button><h2>{project.name}</h2><p>{project.description}</p><div className="project-foot"><span>{project.workflows} workflows</span><span className="project-open">Abrir <Icon name="arrow" size={14} /></span></div></article>)}</div><p className="footnote">Projetos de exemplo inspirados no modelo <code>Project</code> do repositório.</p></div>;
}

function ActivityView() {
  return <div className="subpage"><div className="page-intro"><div><p className="eyebrow">MONITORAMENTO</p><h1>Atividade</h1><p className="intro-subtitle">Acompanhe o histórico recente das automações.</p></div><span className="demo-tag">Dados de exemplo</span></div><section className="surface activity-page"><SectionHeading eyebrow="HOJE · 13 DE NOVEMBRO" title="Execuções recentes" /><ActivityFeed /><p className="footnote">O repositório ainda não possui endpoints de execução. Estes eventos são ilustrativos.</p></section></div>;
}

function IntegrationsView() {
  return <div className="subpage"><div className="page-intro"><div><p className="eyebrow">ECOSSISTEMA</p><h1>Integrações</h1><p className="intro-subtitle">Conecte as ferramentas que fazem parte dos seus fluxos.</p></div></div><section className="surface integrations-empty"><span className="empty-icon"><Icon name="plug" size={23} /></span><h2>Conectores em breve</h2><p>A API atual ainda não implementa integrações externas. Esta área está preparada para evoluir junto com os próximos endpoints.</p><span className="demo-tag">Nenhuma integração conectada</span></section></div>;
}

function WorkflowDialog({ onClose, onSave }: { onClose: () => void; onSave: (name: string, project: string) => void }) {
  const [name, setName] = useState("");
  const [project, setProject] = useState(projects[0].name);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (name.trim()) onSave(name.trim(), project); }
  return <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} onKeyDown={(event) => { if (event.key === "Escape") onClose(); }}><section className="workflow-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><div className="dialog-top"><span className="dialog-icon"><Icon name="workflow" size={19} /></span><button className="icon-button" onClick={onClose} aria-label="Fechar"><Icon name="close" /></button></div><p className="eyebrow">NOVO WORKFLOW</p><h2 id="dialog-title">Comece com uma ideia.</h2><p className="dialog-copy">Defina um nome e escolha onde organizar sua automação.</p><form onSubmit={submit}><label htmlFor="workflow-name">Nome do workflow</label><input id="workflow-name" autoFocus required maxLength={80} value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Boas-vindas a novos clientes" /><label htmlFor="workflow-project">Projeto</label><select id="workflow-project" value={project} onChange={(event) => setProject(event.target.value)}>{projects.map((item) => <option key={item.name}>{item.name}</option>)}</select><p className="form-note">Este protótipo não salva informações na API.</p><div className="dialog-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancelar</button><button type="submit" className="primary-button">Criar rascunho <Icon name="arrow" size={15} /></button></div></form></section></div>;
}

export default function PlatformShell() {
  const [view, setView] = useState<ViewKey>("overview");
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [showDemoNotice, setShowDemoNotice] = useState(true);
  const visibleWorkflows = useMemo(() => workflows.filter((item) => `${item.name} ${item.project} ${item.status}`.toLowerCase().includes(query.toLowerCase())), [workflows, query]);
  const titles: Record<ViewKey, string> = { overview: "Visão geral", workflows: "Workflows", projects: "Projetos", activity: "Atividade", integrations: "Integrações" };

  function createWorkflow(name: string, project: string) {
    setWorkflows((current) => [{ id: Date.now(), name, project, status: "Rascunho", runs: 0, updated: "agora" }, ...current]);
    setDialogOpen(false);
    setView("workflows");
    setToast("Rascunho adicionado a esta sessão — não foi salvo no servidor.");
    window.setTimeout(() => setToast(""), 4200);
  }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNavOpen ? "sidebar-open" : ""}`}>
      <a className="brand" href="#overview" onClick={(event) => { event.preventDefault(); setView("overview"); }}><BrandMark /><span>throidcore<span className="brand-period">.</span></span></a>
      <button className="workspace-switcher"><span className="workspace-avatar">T</span><span className="workspace-label"><strong>Throidcore Studio</strong><small>Workspace pessoal</small></span><Icon name="chevron" size={15} /></button>
      <p className="nav-caption">WORKSPACE</p><nav className="main-nav" aria-label="Navegação principal">{navItems.map((item) => <button key={item.key} className={`nav-item ${view === item.key ? "nav-active" : ""}`} aria-current={view === item.key ? "page" : undefined} onClick={() => { setView(item.key); setMobileNavOpen(false); }}><Icon name={item.icon} /><span>{item.label}</span>{item.key === "workflows" && <span className="nav-count">18</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="sidebar-help"><span className="help-icon"><Icon name="spark" size={17} /></span><strong>Um espaço para criar</strong><p>Organize ideias em fluxos que movem seu trabalho.</p></div><button className="profile-button"><span className="profile-avatar">TC</span><span><strong>Seu perfil</strong><small>Plano gratuito</small></span><Icon name="more" size={18} /></button></div>
    </aside>
    <main className="main-content"><header className="topbar"><button className="mobile-menu icon-button" aria-label="Abrir menu" onClick={() => setMobileNavOpen(!mobileNavOpen)}><Icon name="menu" /></button><div className="breadcrumbs"><span>Throidcore Studio</span><span className="breadcrumb-slash">/</span><strong>{titles[view]}</strong></div><div className="topbar-actions"><label className="search-box"><Icon name="search" size={17} /><input aria-label="Buscar workflows" placeholder="Buscar workflows..." value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>⌘ K</kbd></label><button className="icon-button notification-button" aria-label="Notificações"><Icon name="bell" size={18} /><span /></button><span className="topbar-divider" /><span className="topbar-avatar" aria-label="Perfil Throidcore">T</span></div></header>
      <div className="content-area">{view === "overview" && <Overview workflows={visibleWorkflows} onNavigate={setView} onOpen={setSelectedWorkflow} onCreate={() => setDialogOpen(true)} showDemoNotice={showDemoNotice} onDismissNotice={() => setShowDemoNotice(false)} />} {view === "workflows" && <WorkflowsView workflows={workflows} query={query} onOpen={setSelectedWorkflow} onCreate={() => setDialogOpen(true)} />}{view === "projects" && <ProjectsView onNotify={(message) => { setToast(message); window.setTimeout(() => setToast(""), 4200); }} />}{view === "activity" && <ActivityView />}{view === "integrations" && <IntegrationsView />}</div>
    </main>
    {dialogOpen && <WorkflowDialog onClose={() => setDialogOpen(false)} onSave={createWorkflow} />}
    {selectedWorkflow && <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedWorkflow(null); }}><section className="workflow-dialog detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title"><div className="dialog-top"><span className="dialog-icon"><Icon name="workflow" size={19} /></span><button className="icon-button" onClick={() => setSelectedWorkflow(null)} aria-label="Fechar"><Icon name="close" /></button></div><p className="eyebrow">DETALHES DO WORKFLOW</p><h2 id="detail-title">{selectedWorkflow.name}</h2><p className="dialog-copy">Organizado em <strong>{selectedWorkflow.project}</strong></p><div className="detail-summary"><span>Status</span><Status status={selectedWorkflow.status} /><span>Execuções registradas</span><strong>{selectedWorkflow.runs}</strong><span>Última atualização</span><strong>{selectedWorkflow.updated}</strong></div><p className="form-note">Dados de demonstração. O repositório ainda não possui endpoints para workflows.</p></section></div>}
    {toast && <div className="toast" role="status"><Icon name="check" size={17} />{toast}<button onClick={() => setToast("")} aria-label="Fechar aviso"><Icon name="close" size={15} /></button></div>}
  </div>;
}
