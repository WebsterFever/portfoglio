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
    'Environment variables (dotenv)', 'Linux'
  ],
  'Quality / Tooling': [
    'Git & GitHub', 'ESLint / Prettier', 'Postman/Insomnia',
    'Logging & error handling'
  ],
  'Data Science': [
    // From your list (grouped/condensed for clean display)
    'Python for Data Analysis',
    'NumPy (arrays, broadcasting)',
    'Pandas (ETL, joins, groupby, time series)',
    'Matplotlib & Seaborn (visualization)',
    'Statistics (descriptive & inferential)',
    'APIs & data ingestion / cleaning',
    'Feature engineering',
    'scikit-learn (regression & classification)',
    'Decision Trees / Random Forests',
    'SVM (support vector machines)',
    'kNN (nearest neighbors)',
    'Dimensionality reduction (PCA)',
    'Clustering (K-Means, etc.)',
    'Model selection & cross-validation',
    'TensorFlow / Keras (DL basics)',
    'DL projects: MNIST / CIFAR / IMDB / AutoMPG',
    'SQL for Data Science',
    'Storytelling with data using SQL (sales dataset)',
    'R (basics) & project work',
    'End-to-end projects: IBM Attrition, Fraud, CO₂, Segmentation, iFood, House Prices'
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
        <h2>Webster — full-stack data scientist </h2>
        <p className="intro">
          I build full-stack web apps end-to-end: React on the frontend and
          Node/Express on the backend with PostgreSQL/SQLite. I also work across the
          data-science stack — Python (NumPy, Pandas), visualization (Matplotlib/Seaborn),
          statistics, and machine learning with scikit-learn (regression/classification,
          decision trees, SVM, kNN, clustering, PCA). I use TensorFlow/Keras for
          deep-learning (MNIST, CIFAR, IMDB, AutoMPG) and deliver end-to-end pipelines
          with API ingestion and SQL storytelling. Comfortable with Docker, Koyeb/Vercel
          deployments, and Neon for managed Postgres.
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
