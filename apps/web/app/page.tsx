const stats = [
  { label: "Workflows ativos", value: "18" },
  { label: "Execuções hoje", value: "1.2k" },
  { label: "Sucesso", value: "94.2%" },
  { label: "Alertas", value: "03" },
];

const workflows = [
  { name: "Onboarding SaaS", runs: "245", status: "active" },
  { name: "Lead nurturing", runs: "182", status: "active" },
  { name: "Support triage", runs: "64", status: "paused" },
];

export default function HomePage() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">Throidcore</div>
        <nav className="nav">
          <div className="nav-item active">Dashboard</div>
          <div className="nav-item">Workflows</div>
          <div className="nav-item">Projects</div>
          <div className="nav-item">Dashboards</div>
          <div className="nav-item">Integrations</div>
          <div className="nav-item">AI Copilot</div>
        </nav>
      </aside>

      <section className="main">
        <div className="topbar">
          <div className="title">Dashboard</div>
          <div className="actions">
            <button className="secondary-btn">Invite</button>
            <button className="primary-btn">New workflow</button>
          </div>
        </div>

        <div className="grid stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="card">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="two-col" style={{ marginTop: 20 }}>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Workflows</h3>
            <div className="workflow-list">
              {workflows.map((workflow) => (
                <div key={workflow.name} className="workflow-item">
                  <div>
                    <div style={{ fontWeight: 700 }}>{workflow.name}</div>
                    <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 4 }}>{workflow.runs} executions</div>
                  </div>
                  <span className={`badge ${workflow.status}`}>{workflow.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0 }}>AI Copilot</h3>
            <div className="ai-box">
              “Crie um workflow para onboarding de novos clientes e notifique a equipe no Slack.”
            </div>
            <div style={{ marginTop: 14, color: "#94a3b8" }}>
              Sugestão: webhook → CRM → email → slack
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
