import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Header from './components/Header.jsx';
import ProjectForm from './components/ProjectForm.jsx';
import ProjectCard from './components/ProjectCard.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const SKILLS = {
  Core: [
    'JavaScript (ES2023+)',
    'TypeScript',
    'HTML5',
    'CSS3',
    'Responsive Design',
    'Accessibility (a11y)',
    'Asynchronous Programming',
    'REST API principles'
  ],

  Frontend: [
    'React',
    'React Hooks & Context',
    'React Router',
    'Next.js',
    'Vite',
    'TailwindCSS',
    'Custom CSS / CSS Architecture',
    'Data Fetching (SSR / CSR)',
    'Frontend Testing',
    'Axios / Fetch API'
  ],

  Backend: [
    'Node.js',
    'Express',
    'NestJS',
    'REST APIs',
    'Authentication (JWT)',
    'Authorization & Role Handling',
    'TypeORM',
    'Sequelize ORM',
    'PostgreSQL',
    'MongoDB',
    'SQLite',
    'Mongoose',
    'File Upload (Multer)',
    'Validation & Security Best Practices',
    'API Documentation (OpenAPI)'
  ],

  DevOps: [
    'Docker',
    'Vercel',
    'Cloud Deployment (Koyeb)',
    'Environment Configuration (.env)',
    'Linux Basics'
  ],

  Architecture: [
    'Backend Architecture',
    'MVC Pattern',
    'Middleware Design',
    'Database Modeling',
    'Modular Project Structure'
  ],

  Quality: [
    'Git & GitHub',
    'ESLint',
    'Prettier',
    'Postman / Insomnia',
    'Unit & Integration Testing',
    'Logging & Error Handling'
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
        <h2>Webster Fievre— Full-Stack Developer</h2>
        <p className="intro">
          I design and build scalable full-stack web applications from concept to deployment.
          On the frontend, I work with React and Next.js, building responsive,
          accessible, and performant user interfaces. On the backend, I develop
          RESTful APIs using Node.js, Express, and NestJS with PostgreSQL, MongoDB,
          and TypeORM/Sequelize for data management.

          I focus on clean architecture, authentication (JWT), API documentation,
          and secure backend practices. I deploy production-ready applications
          using Docker, Vercel, and cloud platforms, managing environment
          configurations and optimized database workflows.

          I enjoy building complete systems — from database modeling and API
          design to polished UI and scalable deployments.
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

      <div className="grid" id="projects">
        {filtered.map((p) => (
          <ProjectCard key={p.id} project={p} onDeleted={onDeleted} />
        ))}
      </div>
    </div>
  );
}
