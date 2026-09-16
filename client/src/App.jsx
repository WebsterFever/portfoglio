import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

import Header from './components/Header.jsx';
import ProjectForm from './components/ProjectForm.jsx';
import ProjectCard from './components/ProjectCard.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';

const API = 'https://portfolio-production.up.railway.app';

const SKILLS = {
  'Full-Stack Development': [
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'Express',
    'NestJS',
    'REST APIs',
    'PostgreSQL',
    'MongoDB',
    'Authentication & Authorization',
  ],

  'AI Engineering': [
    'Generative AI',
    'LLM Application Development',
    'Prompt Engineering',
    'Structured AI Outputs',
    'RAG',
    'Embeddings & Vector Search',
    'AI Agents',
    'Multi-Agent Systems',
    'AI Orchestration',
    'Multimodal AI',
    'Model Context Protocol (MCP)',
    'AI Observability',
  ],

  'Java Backend': [
    'Java',
    'Object-Oriented Programming',
    'JPA / Hibernate',
    'Spring Boot',
    'Spring Data JPA',
    'Spring Security',
    'REST API Development',
  ],

  '.NET Backend': [
    'C#',
    '.NET',
    'ASP.NET Core',
    'Entity Framework',
    'LINQ',
    'Dependency Injection',
    'REST API Development',
    'Microservices',
  ],

  'Cloud & DevOps': [
    'Docker',
    'Docker Compose',
    'Vercel',
    'Railway',
    'Cloud Deployment',
    'Environment Configuration',
    'Git & GitHub',
  ],

  'Software Engineering': [
    'Object-Oriented Programming',
    'Clean Architecture',
    'SOLID Principles',
    'Database Modeling',
    'API Design',
    'Authentication & Security',
    'Testing',
    'Error Handling',
    'Scalable Application Architecture',
  ],
};

export default function App() {
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Load projects from backend
  // If Railway is sleeping, retry a few times.
  // If it still fails, show the portfolio without blocking the page.
  const load = async (retries = 5) => {
    try {
      const { data } = await axios.get(`${API}/api/projects`);

      setProjects(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.log('Server waking up... retrying');

      if (retries > 0) {
        setTimeout(() => {
          load(retries - 1);
        }, 2000);
      } else {
        console.error('Backend unavailable:', err);

        // IMPORTANT:
        // Do not block the entire portfolio if backend is unavailable.
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Search/filter projects
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) {
      return projects;
    }

    return projects.filter((project) => {
      const title = project.title?.toLowerCase() || '';

      const tags = Array.isArray(project.tags)
        ? project.tags
        : [];

      return (
        title.includes(q) ||
        tags.some((tag) =>
          String(tag).toLowerCase().includes(q)
        )
      );
    });
  }, [projects, query]);

  // Add new project to UI
  const onCreated = (project) => {
    setProjects((prev) => [project, ...prev]);
  };

  // Remove project from UI
  const onDeleted = (id) => {
    setProjects((prev) =>
      prev.filter((project) => project.id !== id)
    );
  };

  // Show loading screen while first trying to reach Railway
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="container">

      <Header
        query={query}
        setQuery={setQuery}
      />

      <section className="card about">

        <h2>
          Webster Fievre — Full-Stack Developer | AI Engineering
        </h2>

        <p className="intro">
          I build scalable full-stack applications with modern frontend,
          backend, database, and cloud technologies. I’m expanding my
          expertise in AI Engineering, Java/Spring Boot, and C#/.NET,
          with a focus on intelligent, secure, and production-ready
          software.
        </p>

        {Object.entries(SKILLS).map(([group, items]) => (
          <div
            key={group}
            className="skill-group"
          >
            <h4 className="skill-title">
              {group}
            </h4>

            <div
              className="badges"
              style={{ marginTop: 0 }}
            >
              {items.map((skill) => (
                <span
                  key={`${group}-${skill}`}
                  className="badge"
                >
                  #{skill}
                </span>
              ))}
            </div>
          </div>
        ))}

      </section>

      <ProjectForm
        onCreated={onCreated}
      />

      <div
        className="grid"
        id="projects"
      >
        {filtered.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDeleted={onDeleted}
          />
        ))}
      </div>

    </div>
  );
}