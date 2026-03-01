import React, { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function ProjectCard({ project, onDeleted }) {
  const [expanded, setExpanded] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  const del = async () => {
    if (!window.confirm('Delete this project?')) return;

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

  const live = project.liveUrl || project.link2 || null;
  const codeUrl = project.codeUrl || project.link || null;

  const tags = project.tags || [];
  const visibleTags = showAllTags ? tags : tags.slice(0, 3);
  const extraCount = tags.length - 3;

  return (
    <div className="card">

      {project.imagePath && (
        <img src={project.imagePath} alt={project.title} />
      )}

      <h3 className="title">{project.title}</h3>

      {/* Description */}
      {project.description && (
        <>
          <p className={`desc ${expanded ? 'expanded' : ''}`}>
            {project.description}
          </p>
          {project.description.length > 120 && (
            <button
              className="see-more"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'See less' : 'See more'}
            </button>
          )}
        </>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <>
          <div className="badges">
            {visibleTags.map((t, i) => (
              <span key={i} className="badge">#{t}</span>
            ))}
          </div>

          {extraCount > 0 && !showAllTags && (
            <button
              className="see-more"
              onClick={() => setShowAllTags(true)}
            >
              +{extraCount} more
            </button>
          )}

          {showAllTags && extraCount > 0 && (
            <button
              className="see-more"
              onClick={() => setShowAllTags(false)}
            >
              Show less
            </button>
          )}
        </>
      )}

      {/* Buttons */}
      <div className="cta-row">
        {live && (
          <a className="cta" href={live} target="_blank" rel="noreferrer">
            Live Project
          </a>
        )}
        {codeUrl && (
          <a className="cta" href={codeUrl} target="_blank" rel="noreferrer">
            Project URL
          </a>
        )}
      </div>

      <button className="delete-btn" onClick={del}>
        Delete
      </button>
    </div>
  );
}