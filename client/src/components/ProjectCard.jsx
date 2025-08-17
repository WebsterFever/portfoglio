// src/components/ProjectCard.jsx
import React from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function ProjectCard({ project, onDeleted }) {
  const del = async () => {
    if (!confirm('Delete this project?')) return;
    try {
      const code = window.prompt('Enter admin code to delete');
      if (!code) return;
      await axios.delete(`${API}/api/projects/${project.id}`, {
        headers: { 'x-portfolio-code': code },
      });
      onDeleted?.(project.id);
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to delete');
    }
  };

  // New fields + fallback for older data
  const live = project.liveUrl || project.link2 || null;   // live site
  const code = project.codeUrl || project.link || null;    // repo / main project link

  // shorten display text but keep full href
  const nice = (url) => (typeof url === 'string'
    ? url.replace(/^https?:\/\//, '').replace(/\/$/, '')
    : url
  );

  return (
    <div className="card">
      {project.imagePath && (
        <img src={`${API}${project.imagePath}`} alt={project.title} />
      )}

      <h3>{project.title}</h3>

      {/* Clickable Live URL line under the title */}
      {live && (
        <div className="live-row">
          <span className="live-label">Live URL</span>
          <a
            className="live-link"
            href={live}
            target="_blank"
            rel="noreferrer"
            title={live}
          >
            {nice(live)}
          </a>
        </div>
      )}

      {project.description && <p>{project.description}</p>}

      {project.tags?.length > 0 && (
        <div className="badges">
          {project.tags.map((t, i) => (
            <span key={i} className="badge">#{t}</span>
          ))}
        </div>
      )}

      {/* Buttons row — same style for both, side by side (mobile-first) */}
      <div className="cta-row">
        {code && (
          <a className="cta" href={code} target="_blank" rel="noreferrer">
            Project URL
          </a>
        )}
        
      </div>

      <a onClick={del} style={{ cursor: 'pointer' }}>Delete</a>
    </div>
  );
}
