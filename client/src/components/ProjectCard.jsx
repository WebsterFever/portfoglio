import React, { useState } from 'react';
import axios from 'axios';

const API =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3001';

export default function ProjectCard({
  project,
  onDeleted,
}) {
  const [expanded, setExpanded] = useState(false);
  const [showAllTags, setShowAllTags] =
    useState(false);

  const del = async () => {
    if (!window.confirm('Delete this project?')) {
      return;
    }

    try {
      const code = window.prompt(
        'Enter admin code to delete'
      );

      if (!code) return;

      await axios.delete(
        `${API}/api/projects/${project.id}`,
        {
          headers: {
            'x-portfolio-code': code,
          },
        }
      );

      onDeleted?.(project.id);
    } catch (e) {
      alert(
        e?.response?.data?.message ||
          'Failed to delete'
      );
    }
  };

  const live =
    project.liveUrl ||
    project.link2 ||
    null;

  const codeUrl =
    project.codeUrl ||
    project.link ||
    null;

  const tags = Array.isArray(project.tags)
    ? project.tags
    : [];

  const visibleTags = showAllTags
    ? tags
    : tags.slice(0, 4);

  const extraCount = tags.length - 4;

  return (
    <article className="project-card">

      {project.imagePath && (
        <div className="project-image-wrapper">
          <img
            src={project.imagePath}
            alt={project.title}
            className="project-image"
          />
        </div>
      )}

      <div className="project-card-content">

        <div className="project-card-top">
          <span className="project-type">
            PROJECT
          </span>

          <h3>{project.title}</h3>
        </div>

        {project.description && (
          <>
            <p
              className={`project-description ${
                expanded ? 'expanded' : ''
              }`}
            >
              {project.description}
            </p>

            {project.description.length > 150 && (
              <button
                type="button"
                className="text-button"
                onClick={() =>
                  setExpanded((prev) => !prev)
                }
              >
                {expanded
                  ? 'Show less'
                  : 'Read more'}
              </button>
            )}
          </>
        )}

        {tags.length > 0 && (
          <div className="project-technologies">

            {visibleTags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="technology-tag"
              >
                {tag}
              </span>
            ))}

            {extraCount > 0 && !showAllTags && (
              <button
                type="button"
                className="technology-more"
                onClick={() =>
                  setShowAllTags(true)
                }
              >
                +{extraCount}
              </button>
            )}

            {showAllTags && extraCount > 0 && (
              <button
                type="button"
                className="technology-more"
                onClick={() =>
                  setShowAllTags(false)
                }
              >
                Less
              </button>
            )}

          </div>
        )}

        <div className="project-actions">

          {live && (
            <a
              href={live}
              target="_blank"
              rel="noreferrer"
              className="project-primary-link"
            >
              Live Demo ↗
            </a>
          )}

          {codeUrl && (
            <a
              href={codeUrl}
              target="_blank"
              rel="noreferrer"
              className="project-secondary-link"
            >
              Project URL ↗
            </a>
          )}

        </div>

        <button
          type="button"
          className="project-delete"
          onClick={del}
        >
          Delete Project
        </button>

      </div>

    </article>
  );
}