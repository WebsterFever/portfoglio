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
  const [error, setError] = useState(null);

  const load = async (retries = 5) => {
    try {
      const { data } = await axios.get(`${API}/api/projects`);
      setProjects(data);
      setLoading(false);
    } catch (err) {
      console.log('Server waking up... retrying');

      if (retries > 0) {
        setTimeout(() => load(retries - 1), 2000);
      } else {
        setError('Server is taking too long to respond.');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return projects;

    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }, [projects, query]);

  const onCreated = (project) => {
    setProjects((prev) => [project, ...prev]);
  };

  const onDeleted = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>{error}</h2>

        <button onClick={() => window.location.reload()}>
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <Header query={query} setQuery={setQuery} />

      <section className="card about">
        <h2>
          Webster Fievre — Full-Stack Developer & AI Engineering
        </h2>

        <p className="intro">
          I am a Full-Stack Developer expanding my software engineering
          expertise into AI Engineering and enterprise backend development.
          I build modern web applications using React, Next.js, TypeScript,
          Node.js and NestJS, with a strong focus on scalable APIs,
          authentication, databases and clean application architecture.
          <br />
          <br />
          My AI Engineering work focuses on building intelligent applications
          powered by large language models, including RAG systems, vector
          search, AI agents, multi-agent orchestration, multimodal AI and
          production-oriented AI workflows.
          <br />
          <br />
          I am also expanding my backend engineering expertise with Java and
          Spring Boot, as well as C# and .NET, strengthening my knowledge of
          object-oriented programming, enterprise APIs, security, database
          persistence, microservices and scalable backend architecture.
          <br />
          <br />
          My goal is to combine full-stack software engineering, enterprise
          backend development and artificial intelligence to build complete,
          secure and intelligent applications from concept to production.
        </p>

        {Object.entries(SKILLS).map(([group, items]) => (
          <div key={group} className="skill-group">
            <h4 className="skill-title">{group}</h4>

            <div className="badges" style={{ marginTop: 0 }}>
              {items.map((skill, index) => (
                <span key={index} className="badge">
                  #{skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      <ProjectForm onCreated={onCreated} />

      <div className="grid" id="projects">
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