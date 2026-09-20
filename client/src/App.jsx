import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

import Header from './components/Header.jsx';
import ProjectForm from './components/ProjectForm.jsx';
import ProjectCard from './components/ProjectCard.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';

const API =
  import.meta.env.VITE_API_URL ||
  'https://portfolio-production.up.railway.app';

const SKILLS = {
  Frontend: [
    'React',
    'Next.js',
    'TypeScript',
    'JavaScript',
    'HTML5',
    'CSS3',
    'Tailwind CSS',
    'Responsive Design',
  ],

  Backend: [
    'Node.js',
    'NestJS',
    'Express',
    'REST APIs',
    'PostgreSQL',
    'MongoDB',
    'JWT Authentication',
  ],

  'AI Engineering': [
    'Generative AI',
    'LLM Applications',
    'RAG',
    'Vector Search',
    'AI Agents',
    'Multi-Agent Systems',
    'Multimodal AI',
    'MCP',
  ],

  'Java Backend': [
    'Java',
    'Spring Boot',
    'JPA / Hibernate',
    'Spring Data JPA',
    'Spring Security',
  ],

  '.NET Backend': [
    'C#',
    '.NET',
    'ASP.NET Core',
    'Entity Framework',
    'LINQ',
  ],

  'DevOps & Tools': [
    'Docker',
    'Docker Compose',
    'Railway',
    'Vercel',
    'Git',
    'GitHub',
  ],
};

// ==========================================
// PLACEHOLDER DATA
// Replace later with your real information.
// ==========================================

const EXPERIENCE = [
  {
    role: 'AI Full Stack Engineer',
    company: 'Self Employed · Freelance',
    period: 'Sep 2023 — Present',
    description:
      'Designing, building and deploying full-stack applications across modern frontend technologies, backend systems, databases, APIs and cloud infrastructure, with a growing focus on AI-powered software.',
  },
  {
    role: 'Developer',
    company: 'Ambev',
    period: 'Sep 2019 — May 2022',
    description:
      'Developed and maintained applications using C# and .NET, while building and supporting backend functionality, APIs and database integrations.',
  },
  {
    role: 'Support Analyst',
    company: 'T-Systems do Brasil',
    period: 'Jun 2017 — Nov 2019',
    description:
      'Provided technical support for software, hardware and network systems, and resolved customer issues in German and English.',
  },
];

const EDUCATION = [
  {
    program: 'Computer Engineering',
    school: 'Instituto Infnet',
    period: 'In Progress',
    description:
      'Software engineering, programming, frontend development, mobile development and computer engineering studies.',
  },
  {
    program: 'Full-Stack Development & AI Engineering',
    school: 'Soy Henry',
    period: 'Professional Training',
    description:
      'Full-stack web development and AI engineering, including React, TypeScript, Node.js, APIs, databases, Generative AI, LLM applications, RAG, AI agents and modern AI-powered applications.',
  },
];

const TRAINING = [
  {
    title: 'AI Engineering',
    description:
      'Generative AI, LLM applications, RAG, vector search, agents, multimodal systems and AI application architecture.',
  },
  {
    title: 'Full-Stack Development',
    description:
      'Modern frontend and backend application development, APIs, databases, authentication and deployment.',
  },
  {
    title: 'Java & Spring Boot',
    description:
      'Java, object-oriented programming, JPA/Hibernate, Spring Boot, Spring Data and application security.',
  },
  {
    title: 'C# & .NET',
    description:
      'C#, ASP.NET Core, Entity Framework, LINQ, APIs and enterprise backend development.',
  },
];

export default function App() {
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [projectError, setProjectError] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showAllProduction, setShowAllProduction] = useState(false);
  const [showAllEducational, setShowAllEducational] = useState(false);

  const load = async () => {
    try {
      setProjectError(false);

      const { data } = await axios.get(`${API}/api/projects`);

      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Unable to load projects:', err);
      setProjectError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return projects;

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

  const productionProjects = useMemo(
    () =>
      filtered.filter(
        (project) =>
          (project.category || 'production') !== 'educational'
      ),
    [filtered]
  );

  const educationalProjects = useMemo(
    () =>
      filtered.filter(
        (project) => project.category === 'educational'
      ),
    [filtered]
  );

  const visibleProductionProjects = showAllProduction
    ? productionProjects
    : productionProjects.slice(0, 3);

  const visibleEducationalProjects = showAllEducational
    ? educationalProjects
    : educationalProjects.slice(0, 3);

  const onCreated = (project) => {
    setProjects((prev) => [project, ...prev]);
    setShowProjectForm(false);
  };

  const onDeleted = (id) => {
    setProjects((prev) =>
      prev.filter((project) => project.id !== id)
    );
  };
  const onUpdated = (updatedProject) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === updatedProject.id
          ? updatedProject
          : project
      )
    );
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="resume-page">

      <Header />

      <main className="resume-container">

        {/* PROFESSIONAL SUMMARY */}

        <section
          className="resume-section summary-section"
          id="about"
        >
          <div className="section-heading">
            <span>01</span>
            <h2>Professional Summary</h2>
          </div>

          <p className="professional-summary">
            Full-Stack Developer building scalable web applications
            with modern frontend, backend, database and cloud
            technologies. Expanding my expertise in AI Engineering,
            Java/Spring Boot and C#/.NET, with a focus on intelligent,
            secure and production-ready software.
          </p>
        </section>

        {/* TECHNICAL SKILLS */}

        <section
          className="resume-section"
          id="skills"
        >
          <div className="section-heading">
            <span>02</span>
            <h2>Technical Skills</h2>
          </div>

          <div className="skills-resume-grid">
            {Object.entries(SKILLS).map(([group, items]) => (
              <div
                className="resume-skill-group"
                key={group}
              >
                <h3>{group}</h3>

                <p>
                  {items.join(' • ')}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* EXPERIENCE */}

        <section
          className="resume-section"
          id="experience"
        >
          <div className="section-heading">
            <span>03</span>
            <h2>Experience</h2>
          </div>

          <div className="timeline">
            {EXPERIENCE.map((item, index) => (
              <article
                className="timeline-item"
                key={`${item.role}-${index}`}
              >
                <div className="timeline-dot" />

                <div className="timeline-content">
                  <div className="timeline-top">
                    <div>
                      <h3>{item.role}</h3>
                      <h4>{item.company}</h4>
                    </div>

                    <span className="period">
                      {item.period}
                    </span>
                  </div>

                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* EDUCATION */}

        <section
          className="resume-section"
          id="education"
        >
          <div className="section-heading">
            <span>04</span>
            <h2>Education</h2>
          </div>

          <div className="education-grid">
            {EDUCATION.map((item, index) => (
              <article
                className="resume-info-card"
                key={`${item.school}-${index}`}
              >
                <span className="info-label">
                  {item.period}
                </span>

                <h3>{item.program}</h3>
                <h4>{item.school}</h4>

                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* TRAINING */}

        <section
          className="resume-section"
          id="training"
        >
          <div className="section-heading">
            <span>05</span>
            <h2>
              Certifications & Continuing Education
            </h2>
          </div>

          <div className="training-grid">
            {TRAINING.map((item, index) => (
              <article
                className="training-card"
                key={`${item.title}-${index}`}
              >
                <div className="training-number">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* PROJECTS - FINAL SECTION */}

        <section
          className="resume-section projects-section"
          id="projects"
        >
          <div className="projects-heading-row">

            <div className="section-heading">
              <span>06</span>
              <h2>Projects</h2>
            </div>

            <button
              className="add-project-button"
              type="button"
              onClick={() =>
                setShowProjectForm((prev) => !prev)
              }
            >
              {showProjectForm
                ? 'Close'
                : '+ Add Project'}
            </button>

          </div>

          <p className="projects-intro">
            Selected applications and software projects I have
            designed and developed.
          </p>

          {showProjectForm && (
            <div className="project-form-wrapper">
              <div className="form-heading">
                <h3>Add New Project</h3>
                <p>
                  Add a project to your portfolio.
                </p>
              </div>

              <ProjectForm
                onCreated={onCreated}
              />
            </div>
          )}

          <div className="project-toolbar">

            <input
              type="text"
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              placeholder="Search projects by title or technology..."
              aria-label="Search projects"
            />

            <span>
              {filtered.length}{' '}
              {filtered.length === 1
                ? 'project'
                : 'projects'}
            </span>

          </div>

          {projectError && (
            <div className="projects-error">
              <div>
                <strong>
                  Projects could not be loaded.
                </strong>

                <p>
                  The rest of the portfolio is still
                  available.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  load();
                }}
              >
                Try Again
              </button>
            </div>
          )}

          {!projectError && filtered.length === 0 && (
            <div className="empty-projects">
              No projects match your search.
            </div>
          )}

          {!projectError && filtered.length > 0 && (
            <>
              <section className="project-category-section production-projects-section">
                <div className="project-category-header">
                  <div>
                    <h3>Freelance & Production Projects</h3>
                    <p>
                      Production-ready applications, deployed products and client-style work.
                    </p>
                  </div>

                  <span className="project-category-count">
                    {productionProjects.length}{' '}
                    {productionProjects.length === 1 ? 'project' : 'projects'}
                  </span>
                </div>

                {productionProjects.length > 0 ? (
                  <>
                    <div className="projects-grid">
                      {visibleProductionProjects.map((project) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          onDeleted={onDeleted}
                          onUpdated={onUpdated}
                        />
                      ))}
                    </div>

                    {productionProjects.length > 3 && (
                      <button
                        type="button"
                        className="projects-see-more"
                        onClick={() =>
                          setShowAllProduction((prev) => !prev)
                        }
                      >
                        {showAllProduction
                          ? 'Show Less'
                          : `See ${productionProjects.length - 3} More`}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="empty-projects">
                    No freelance or production projects match your search.
                  </div>
                )}
              </section>

              <section className="project-category-section educational-projects-section">
                <div className="project-category-header">
                  <div>
                    <h3>Educational Projects</h3>
                    <p>
                      Academic and training projects that demonstrate technologies,
                      architecture and software-engineering skills.
                    </p>
                  </div>

                  <span className="project-category-count">
                    {educationalProjects.length}{' '}
                    {educationalProjects.length === 1 ? 'project' : 'projects'}
                  </span>
                </div>

                {educationalProjects.length > 0 ? (
                  <>
                    <div className="projects-grid">
                      {visibleEducationalProjects.map((project) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          onDeleted={onDeleted}
                          onUpdated={onUpdated}
                        />
                      ))}
                    </div>

                    {educationalProjects.length > 3 && (
                      <button
                        type="button"
                        className="projects-see-more"
                        onClick={() =>
                          setShowAllEducational((prev) => !prev)
                        }
                      >
                        {showAllEducational
                          ? 'Show Less'
                          : `See ${educationalProjects.length - 3} More`}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="empty-projects">
                    No educational projects match your search.
                  </div>
                )}
              </section>
            </>
          )}

        </section>

      </main>

      <footer className="resume-footer">
        <p>
          © {new Date().getFullYear()} Webster Fievre
        </p>

        <a href="#top">
          Back to top ↑
        </a>
      </footer>

    </div>
  );
}