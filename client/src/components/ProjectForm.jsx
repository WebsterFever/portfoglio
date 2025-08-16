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
      onDeleted(project.id);
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to delete');
    }
  };

  const hasLive = !!project.link2; // live/project URL
  const hasCode = !!project.link;  // code/repo URL

  return (
    <div className="card">
      {project.imagePath && (
        <img src={`${API}${project.imagePath}`} alt={project.title} />
      )}

      <h3>{project.title}</h3>

      {project.description && <p>{project.description}</p>}

      {project.tags && project.tags.length > 0 && (
        <div className="badges">
          {project.tags.map((t, i) => (
            <span key={i} className="badge">#{t}</span>
          ))}
        </div>
      )}

      {(hasLive || hasCode) && (
        <div className="cta-row" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '6px' }}>
          {hasLive && (
            <a href={project.link2} target="_blank" rel="noreferrer">
              Live URL
            </a>
          )}
          {hasCode && (
            <a href={project.link} target="_blank" rel="noreferrer">
              Code URL
            </a>
          )}
        </div>
      )}

      <a onClick={del} style={{ cursor: 'pointer' }}>Delete</a>
    </div>
  );
}
