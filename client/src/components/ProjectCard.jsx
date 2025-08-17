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

  // Use your DB field names:
  // - project.link      -> repo / project URL
  // - project.link2     -> live URL (what you asked to click)
  const codeUrl = project.link || project.codeUrl || null;
  const liveUrl = project.link2 || project.liveUrl || null;

  return (
    <div className="card">
      {project.imagePath && (
        <img src={`${API}${project.imagePath}`} alt={project.title} />
      )}

      <h3>{project.title}</h3>

      {/* remove any plain text URL under the title */}
      {project.description && <p>{project.description}</p>}

      {project.tags?.length > 0 && (
        <div className="badges">
          {project.tags.map((t, i) => (
            <span key={i} className="badge">#{t}</span>
          ))}
        </div>
      )}

      {/* Buttons row (mobile-first, wraps nicely) */}
      <div className="btn-row">
        {codeUrl && (
          <a
            href={codeUrl}
            target="_blank"
            rel="noreferrer"
            title="Project URL"
          >
            Project URL
          </a>
        )}
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noreferrer"
            title="Live URL"
          >
            Live URL
          </a>
        )}
      </div>

      <a onClick={del} style={{ cursor: 'pointer' }}>Delete</a>
    </div>
  );
}
