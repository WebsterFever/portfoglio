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

  // live site + repo/main link (backward-compatible)
  const live = project.liveUrl || project.link2 || null;
  const code = project.codeUrl || project.link || null;

  // shorter display text for long URLs (keeps full href)
  const nice = (url) =>
    typeof url === 'string'
      ? url.replace(/^https?:\/\//, '').replace(/\/$/, '')
      : url;

  return (
    <div className="card">
      {project.imagePath && (
        <img src={`${API}${project.imagePath}`} alt={project.title} />
      )}

      {/* centered title */}
      <h3 className="title">{project.title}</h3>

      {/* Live URL label + pill link (centered) */}
      {live && (
        <>
          <div className="live-label">Live URL</div>
          <a
            className="cta live-pill"
            href={live}
            target="_blank"
            rel="noreferrer"
            title={live}
          >
            {nice(live)}
          </a>
        </>
      )}

      {/* nicely formatted description */}
      {project.description && <p className="desc">{project.description}</p>}

      {project.tags?.length > 0 && (
        <div className="badges">
          {project.tags.map((t, i) => (
            <span key={i} className="badge">#{t}</span>
          ))}
        </div>
      )}

      {/* CTA row */}
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
