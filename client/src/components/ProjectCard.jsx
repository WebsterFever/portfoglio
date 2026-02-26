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
    },
    {
      id: 4,
      title: "Weather Dashboard",
      description:
        "Real-time weather app with 5-day forecast and location search.",
      liveUrl: "https://weather-demo.com",
      codeUrl: "https://github.com/yourname/weather",
      tags: ["React", "API"],
      imagePath: "/images/weather.png"
    }
  ];

  const nice = (url) =>
    typeof url === "string"
      ? url.replace(/^https?:\/\//, "").replace(/\/$/, "")
      : url;

  return (
    <div className="container">
      <header className="header">
        <div className="brand">My Projects</div>
        <div className="search">
          <input type="search" placeholder="Search projects..." />
        </div>
      </header>

      <div className="grid">
        {projects.map((project) => (
          <div key={project.id} className="card">
            {project.imagePath && (
              <img src={project.imagePath} alt={project.title} />
            )}

            <h3 className="title">{project.title}</h3>

            {project.liveUrl && (
              <div className="live-row">
                <span className="live-label">Live URL</span>
                <a
                  className="live-link"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {nice(project.liveUrl)}
                </a>
              </div>
            )}

            {project.description && (
              <p className="desc">{project.description}</p>
            )}

            {project.tags?.length > 0 && (
              <div className="badges">
                {project.tags.map((t, i) => (
                  <span key={i} className="badge">
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="btnrow">
              {project.liveUrl && (
                <a
                  className="btn"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live Demo
                </a>
              )}
              {project.codeUrl && (
                <a
                  className="btn"
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