
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Header from './components/Header.jsx';
import ProjectForm from './components/ProjectForm.jsx';
import ProjectCard from './components/ProjectCard.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
    return projects.filter(p => p.title.toLowerCase().includes(q) || (p.tags||[]).some(t => t.toLowerCase().includes(q)));
  }, [projects, query]);

  const onCreated = (project) => setProjects(prev => [project, ...prev]);
  const onDeleted = (id) => setProjects(prev => prev.filter(p => p.id !== id));

  return (
    <div className="container">
      <Header query={query} setQuery={setQuery} />

      <ProjectForm onCreated={onCreated} />

      <div className="grid">
        {filtered.map(p => (
          <ProjectCard key={p.id} project={p} onDeleted={onDeleted} />
        ))}
      </div>
    </div>
  );
}
