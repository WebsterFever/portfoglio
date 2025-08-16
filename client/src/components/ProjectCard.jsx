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

  // Support both your old fields and the new ones
  const live = project.liveUrl || project.link2 || null;     // live / online
  const code = project.codeUrl || project.link || null;      // repo / project url

  return (
    <div className="card">
      {project.imagePath && (
        <img src={`${API}${project.imagePath}`} alt={project.title} />
      )}

      <h3>{project.title}</h3>

      {(project.developedAt || project.inProduction) && (
        <p style={{ margin: '0 6px 8px', fontSize: 13, opacity: 0.85 }}>
          {project.developedAt && <>Built: <strong>{project.developedAt}</strong>{' '}</>}
          {project.inProduction ? (
            <span style={{ color: '#60a5fa' }}>(in production)</span>
          ) : (
            <span>(stable)</span>
          )}
        </p>
      )}

      {project.description && <p>{project.description}</p>}

      {project.tags?.length > 0 && (
        <div className="badges">
          {project.tags.map((t, i) => (
            <span key={i} className="badge">#{t}</span>
          ))}
        </div>
      )}

      {/* Buttons row — always two columns on mobile */}
      <div className="btnrow">
        {code && (
          <a className="btn" href={code} target="_blank" rel="noreferrer">
            Project URL
          </a>
        )}
        {live && (
          <a className="btn" href={live} target="_blank" rel="noreferrer">
            Live URL
          </a>
        )}
      </div>

      <a onClick={del} style={{ cursor: 'pointer' }}>Delete</a>
    </div>
  );
}
