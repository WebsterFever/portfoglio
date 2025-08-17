import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Header from './components/Header.jsx';
import ProjectForm from './components/ProjectForm.jsx';
import ProjectCard from './components/ProjectCard.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const SKILLS = {
  Core: [
    'JavaScript (ES202x)', 'TypeScript (comfortable)',
    'HTML5', 'CSS3', 'Responsive UI', 'Accessibility (a11y)'
  ],
  Frontend: [
    'React', 'Vite', 'Hooks/Context', 'React Router',
    'TailwindCSS / custom CSS', 'Axios'
  ],
  Backend: [
    'Node.js', 'Express', 'REST APIs', 'Sequelize ORM',
    'PostgreSQL (Neon)', 'SQLite', 'Multer uploads',
    'Auth (JWT / headers)', 'Validation & security basics'
  ],
  'DevOps / Cloud': [
    'Docker', 'Koyeb (deploy)', 'Vercel (frontend)',
    'Environment variables (dotenv)', 'Linux basics'
  ],
  'Quality / Tooling': [
    'Git & GitHub', 'ESLint / Prettier', 'Postman/Insomnia',
    'Logging & error handling'
  ]
};

export default function App() {
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState('');

  const load = async () => {
    const { data } = await axios.get(`${API}/api/projects`);
    setProjects(data);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }, [projects, query]);

  const onCreated = (project) => setProjects((prev) => [project, ...prev]);
  const onDeleted = (id) => setProjects((prev) => prev.filter((p) => p.id !== id));

  return (
    <div className="container">
      <Header query={query} setQuery={setQuery} />

      {/* About / Skills */}
      <section className="card about">
        <h2>Webster — Full-Stack Developer</h2>
        <p className="intro">
          I build full-stack web apps end-to-end: React on the frontend and
          Node/Express on the backend with PostgreSQL/SQLite. Comfortable with Docker,
          Koyeb/Vercel deployments, and Neon for managed Postgres.
        </p>

        {Object.entries(SKILLS).map(([group, items]) => (
          <div key={group} className="skill-group">
            <h4 className="skill-title">{group}</h4>
            <div className="badges" style={{ marginTop: 0 }}>
              {items.map((s, i) => (
                <span key={i} className="badge">#{s}</span>
              ))}
            </div>
          </div>
        ))}
      </section>

      <ProjectForm onCreated={onCreated} />

      <div className="grid">
        {filtered.map((p) => (
          <ProjectCard key={p.id} project={p} onDeleted={onDeleted} />
        ))}
      </div>
    </div>
  );
}
