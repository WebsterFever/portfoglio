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

  // Support both schemas (old/new)
  let live = project.liveUrl || project.link2 || null;   // Project / Live URL
  let code = project.codeUrl || project.link || null;    // Repo / Code URL

  // If both are the same, show just one (as Project URL)
  const norm = (u) => (u || '').trim().replace(/\/$/, '');
  if (live && code && norm(live) === norm(code)) code = null;

  return (
    <div className="card">
      {project.imagePath && <img src={`${API}${project.imagePath}`} alt={project.title} />}

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
          {project.tags.map((t, i) => <span key={i} className="badge">#{t}</span>)}
        </div>
      )}

      {/* Button row (mobile-first) */}
      <div className="link-buttons">
        {live && (
          <a href={live} target="_blank" rel="noreferrer noopener">Project URL</a>
        )}
        {code && (
          <a href={code} target="_blank" rel="noreferrer noopener">Code URL</a>
        )}
        {!live && !code && project.link && (
          <a href={project.link} target="_blank" rel="noreferrer noopener">Open Project</a>
        )}
      </div>

      <a onClick={del} style={{ cursor: 'pointer' }}>Delete</a>
    </div>
  );
}
