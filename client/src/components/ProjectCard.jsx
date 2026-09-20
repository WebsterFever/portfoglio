import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';

const API =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3001';

export default function ProjectCard({
  project,
  onDeleted,
  onUpdated,
}) {
  const [expanded, setExpanded] = useState(false);
  const [showAllTags, setShowAllTags] =
    useState(false);
  const [promptOpen, setPromptOpen] = useState(false);

  // ==========================================
  // EDIT STATE
  // ==========================================

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editTitle, setEditTitle] =
    useState(project.title || '');

  const [editLink, setEditLink] =
    useState(project.link || '');

  const [editLink2, setEditLink2] =
    useState(project.link2 || '');

  const [editDescription, setEditDescription] =
    useState(project.description || '');

  const [editCategory, setEditCategory] = useState(
    project.category || 'production'
  );

  const [editBuildPrompt, setEditBuildPrompt] = useState(
    project.buildPrompt || ''
  );

  const [editTags, setEditTags] =
    useState(
      Array.isArray(project.tags)
        ? project.tags.join(', ')
        : ''
    );

  const [editImage, setEditImage] =
    useState(null);

  // ==========================================
  // KEEP EDIT FORM SYNCHRONIZED
  // ==========================================

  useEffect(() => {
    setEditTitle(project.title || '');
    setEditLink(project.link || '');
    setEditLink2(project.link2 || '');
    setEditDescription(project.description || '');
    setEditCategory(project.category || 'production');
    setEditBuildPrompt(project.buildPrompt || '');

    setEditTags(
      Array.isArray(project.tags)
        ? project.tags.join(', ')
        : ''
    );

    setEditImage(null);
  }, [project]);

  // Keep the modal completely independent from the project card layout.
  // Rendering it through a portal prevents card/grid transforms from
  // making the fixed modal appear to resize or move.
  useEffect(() => {
    if (!promptOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setPromptOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [promptOpen]);

  // ==========================================
  // DELETE PROJECT
  // ==========================================

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
      console.error(e);

      alert(
        e?.response?.data?.message ||
          'Failed to delete project'
      );
    }
  };

  // ==========================================
  // OPEN EDITOR
  // ==========================================

  const openEditor = () => {
    setEditTitle(project.title || '');
    setEditLink(project.link || '');
    setEditLink2(project.link2 || '');
    setEditDescription(project.description || '');
    setEditCategory(project.category || 'production');
    setEditBuildPrompt(project.buildPrompt || '');

    setEditTags(
      Array.isArray(project.tags)
        ? project.tags.join(', ')
        : ''
    );

    setEditImage(null);

    setEditing(true);
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const cancelEdit = () => {
    setEditTitle(project.title || '');
    setEditLink(project.link || '');
    setEditLink2(project.link2 || '');
    setEditDescription(project.description || '');
    setEditCategory(project.category || 'production');
    setEditBuildPrompt(project.buildPrompt || '');

    setEditTags(
      Array.isArray(project.tags)
        ? project.tags.join(', ')
        : ''
    );

    setEditImage(null);

    setEditing(false);
  };

  // ==========================================
  // SAVE EDIT
  // ==========================================

  const saveEdit = async (e) => {
    e.preventDefault();

    if (!editTitle.trim()) {
      alert('Project title is required');
      return;
    }

    if (!editLink.trim()) {
      alert('Project / Repository URL is required');
      return;
    }

    const code = window.prompt(
      'Enter admin code to save changes'
    );

    if (!code) return;

    try {
      setSaving(true);

      const form = new FormData();

      form.append('title', editTitle.trim());
      form.append('link', editLink.trim());

      /*
       * Always send link2.
       * Sending an empty string allows the backend
       * to remove an existing Live Demo URL.
       */
      form.append('link2', editLink2.trim());

      form.append(
        'description',
        editDescription.trim()
      );

      form.append('tags', editTags);
      form.append('category', editCategory);
      form.append('buildPrompt', editBuildPrompt);

      /*
       * IMPORTANT:
       * Only send an image when a new one was chosen.
       *
       * Your backend already keeps item.imagePath
       * when req.file does not exist.
       */
      if (editImage) {
        form.append('image', editImage);
      }

      const { data } = await axios.put(
        `${API}/api/projects/${project.id}`,
        form,
        {
          headers: {
            'x-portfolio-code': code,
          },
        }
      );

      onUpdated?.(data);

      setEditing(false);
      setEditImage(null);

      alert('Project updated successfully');
    } catch (e) {
      console.error(e);

      alert(
        e?.response?.data?.message ||
          'Failed to update project'
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // PROJECT DATA
  // ==========================================

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

  // ==========================================
  // EDIT MODE
  // ==========================================

  if (editing) {
    return (
      <article className="project-card project-card-editing">

        <div className="project-card-content">

          <div className="project-edit-heading">
            <span className="project-type">
              EDIT PROJECT
            </span>

            <h3>{project.title}</h3>
          </div>

          <form
            className="project-edit-form"
            onSubmit={saveEdit}
          >

            {/* TITLE */}

            <div className="project-edit-field">
              <label htmlFor={`title-${project.id}`}>
                Project Title *
              </label>

              <input
                id={`title-${project.id}`}
                type="text"
                value={editTitle}
                onChange={(e) =>
                  setEditTitle(e.target.value)
                }
                placeholder="Project title"
                required
              />
            </div>

            {/* REPOSITORY */}

            <div className="project-edit-field">
              <label htmlFor={`link-${project.id}`}>
                Project / Repository URL *
              </label>

              <input
                id={`link-${project.id}`}
                type="url"
                value={editLink}
                onChange={(e) =>
                  setEditLink(e.target.value)
                }
                placeholder="https://github.com/..."
                required
              />
            </div>

            {/* LIVE URL */}

            <div className="project-edit-field">
              <label htmlFor={`live-${project.id}`}>
                Live Demo URL
              </label>

              <input
                id={`live-${project.id}`}
                type="url"
                value={editLink2}
                onChange={(e) =>
                  setEditLink2(e.target.value)
                }
                placeholder="https://..."
              />
            </div>

            {/* TECHNOLOGIES */}

            <div className="project-edit-field">
              <label htmlFor={`tags-${project.id}`}>
                Technologies
              </label>

              <input
                id={`tags-${project.id}`}
                type="text"
                value={editTags}
                onChange={(e) =>
                  setEditTags(e.target.value)
                }
                placeholder="React, TypeScript, Firebase, AWS S3"
              />

              <small>
                Separate technologies with commas.
              </small>
            </div>

            {/* CATEGORY */}

            <div className="project-edit-field">
              <label htmlFor={`category-${project.id}`}>
                Project Category *
              </label>

              <select
                id={`category-${project.id}`}
                value={editCategory}
                onChange={(e) =>
                  setEditCategory(e.target.value)
                }
                required
              >
                <option value="production">
                  Freelance / Production
                </option>
                <option value="educational">
                  Educational
                </option>
              </select>
            </div>

            {/* AI BUILD PROMPT */}

            <div className="project-edit-field project-edit-full">
              <label htmlFor={`build-prompt-${project.id}`}>
                AI Build Prompt
              </label>

              <textarea
                id={`build-prompt-${project.id}`}
                className="build-prompt-input"
                value={editBuildPrompt}
                onChange={(e) =>
                  setEditBuildPrompt(e.target.value)
                }
                placeholder="Paste the prompt or project specification used to guide the AI-assisted build..."
                rows="9"
              />

              <small>
                Leave empty if this project does not have a build prompt.
              </small>
            </div>

            {/* DESCRIPTION */}

            <div className="project-edit-field project-edit-full">
              <label
                htmlFor={`description-${project.id}`}
              >
                Description
              </label>

              <textarea
                id={`description-${project.id}`}
                value={editDescription}
                onChange={(e) =>
                  setEditDescription(e.target.value)
                }
                placeholder="Describe your project..."
                rows="6"
              />
            </div>

            {/* CURRENT IMAGE */}

            {project.imagePath && (
              <div className="project-edit-field project-edit-full">

                <label>
                  Current Project Image
                </label>

                <div className="project-edit-current-image">
                  <img
                    src={project.imagePath}
                    alt={project.title}
                  />
                </div>

              </div>
            )}

            {/* NEW IMAGE */}

            <div className="project-edit-field project-edit-full">

              <label
                htmlFor={`image-${project.id}`}
              >
                Replace Project Image
              </label>

              <input
                id={`image-${project.id}`}
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditImage(
                    e.target.files?.[0] || null
                  )
                }
              />

              <small>
                Leave this empty to keep the current image.
              </small>

              {editImage && (
                <p className="project-new-image-name">
                  New image: {editImage.name}
                </p>
              )}

            </div>

            {/* BUTTONS */}

            <div className="project-edit-actions">

              <button
                type="button"
                className="project-edit-cancel"
                onClick={cancelEdit}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="project-edit-save"
                disabled={saving}
              >
                {saving
                  ? 'Saving...'
                  : 'Save Changes'}
              </button>

            </div>

          </form>

        </div>

      </article>
    );
  }

  // ==========================================
  // NORMAL PROJECT CARD
  // ==========================================

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

        {/* DESCRIPTION */}

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

        {/* TECHNOLOGIES */}

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

            {extraCount > 0 &&
              !showAllTags && (
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

            {showAllTags &&
              extraCount > 0 && (
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

        {/* PROJECT LINKS */}

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

        {/* AI BUILD PROMPT */}

        {project.buildPrompt?.trim() && (
          <button
            type="button"
            className="project-prompt-button"
            onClick={() => setPromptOpen(true)}
          >
            <span className="project-prompt-icon">✦</span>
            View AI Build Prompt
          </button>
        )}

        {/* ADMIN ACTIONS */}

        <div className="project-admin-actions">

          <button
            type="button"
            className="project-edit"
            onClick={openEditor}
          >
            Edit Project
          </button>

          <button
            type="button"
            className="project-delete"
            onClick={del}
          >
            Delete Project
          </button>

        </div>

      </div>

      {promptOpen &&
        project.buildPrompt?.trim() &&
        createPortal(
          <div
            className="build-prompt-modal-backdrop"
            role="presentation"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setPromptOpen(false);
              }
            }}
          >
            <section
              className="build-prompt-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby={`build-prompt-title-${project.id}`}
            >
              <div className="build-prompt-modal-header">
                <div>
                  <span className="build-prompt-kicker">
                    AI-ASSISTED DEVELOPMENT
                  </span>
                  <h2 id={`build-prompt-title-${project.id}`}>
                    {project.title}
                  </h2>
                  <p>
                    The project specification and instructions used to guide the AI-assisted build.
                  </p>
                </div>

                <button
                  type="button"
                  className="build-prompt-close"
                  onClick={() => setPromptOpen(false)}
                  aria-label="Close build prompt"
                >
                  ×
                </button>
              </div>

              <div className="build-prompt-modal-body">
                <div className="build-prompt-label">
                  BUILD PROMPT
                </div>
                <pre>{project.buildPrompt}</pre>
              </div>

              <div className="build-prompt-modal-footer">
                <button
                  type="button"
                  onClick={() => setPromptOpen(false)}
                >
                  Close
                </button>
              </div>
            </section>
          </div>,
          document.body
        )}

    </article>
  );
}