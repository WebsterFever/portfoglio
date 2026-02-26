import React from "react";

export default function ProjectCard() {
  const projects = [
    {
      id: 1,
      title: "E-Commerce Website",
      description:
        "Full-stack MERN e-commerce platform with authentication and Stripe payments.",
      liveUrl: "https://your-ecommerce-demo.com",
      codeUrl: "https://github.com/yourname/ecommerce",
      tags: ["React", "Node", "MongoDB"],
      imagePath: "/images/ecommerce.png"
    },
    {
      id: 2,
      title: "Portfolio Website",
      description:
        "Modern responsive portfolio built with React and clean UI design.",
      liveUrl: "https://yourportfolio.com",
      codeUrl: "https://github.com/yourname/portfolio",
      tags: ["React", "CSS"],
      imagePath: "/images/portfolio.png"
    },
    {
      id: 3,
      title: "Task Manager App",
      description:
        "CRUD task manager with authentication and REST API backend.",
      liveUrl: "https://taskapp-demo.com",
      codeUrl: "https://github.com/yourname/taskmanager",
      tags: ["React", "Express"],
      imagePath: "/images/taskapp.png"
    }
  ];

  const nice = (url) =>
    typeof url === "string"
      ? url.replace(/^https?:\/\//, "").replace(/\/$/, "")
      : url;

  return (
    <div className="projects-container">
      <h1 className="page-title">My Projects</h1>

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="card">
            {project.imagePath && (
              <img src={project.imagePath} alt={project.title} />
            )}

            <h3 className="title">{project.title}</h3>

            {project.liveUrl && (
              <>
                <div className="live-label">Live URL</div>
                <a
                  className="cta live-pill"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {nice(project.liveUrl)}
                </a>
              </>
            )}

            {project.description && (
              <p className="desc">{project.description}</p>
            )}

            {project.tags?.length > 0 && (
              <div className="badges">
                {project.tags.map((t, i) => (
                  <span key={i} className="badge">
                    #{t}
                  </span>
                ))}
              </div>
            )}

            <div className="cta-row">
              {project.codeUrl && (
                <a
                  className="cta"
                  href={project.codeUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Code
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}