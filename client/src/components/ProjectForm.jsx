// client/src/components/ProjectForm.jsx
import React, { useRef, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function ProjectForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [developedAt, setDevelopedAt] = useState('');      // date (yyyy-mm-dd)
  const [inProduction, setInProduction] = useState(true);  // toggle
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!title || !link) return alert('Please provide title and link');

    try {
      setLoading(true);

      const code = window.prompt('Enter admin code');
      if (!code) { setLoading(false); return; }

      const form = new FormData();
      form.append('title', title.trim());
      form.append('link', link.trim());
      if (description) form.append('description', description.trim());
      if (tags) form.append('tags', tags);
      if (developedAt) form.append('developedAt', developedAt);
      form.append('inProduction', String(inProduction));
      if (file) form.append('image', file);
      form.append('code', code);

      const { data } = await axios.post(`${API}/api/projects`, form, {
        headers: { 'Content-Type': 'multipart/form-data', 'x-portfolio-code': code }
      });

      onCreated?.(data);
      // reset
      setTitle('');
      setLink('');
      setDescription('');
      setTags('');
      setDevelopedAt('');
      setInProduction(true);
      setFile(null);
      if (fileRef.current) fileRef.current.value = null;
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={submit} noValidate>
      <input
        type="text"
        placeholder="Project title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        aria-label="Project title"
      />

      <input
        type="url"
        placeholder="Project link (https://...) *"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        required
        inputMode="url"
        aria-label="Project link"
      />

      {/* Date + toggle row */}
      <div className="row-inline">
        <input
          type="date"
          className="date"
          value={developedAt}
          onChange={(e) => setDevelopedAt(e.target.value)}
          aria-label="Developed on"
        />

        <label className="switch" aria-label="Still in production">
          <input
            type="checkbox"
            checked={inProduction}
            onChange={(e) => setInProduction(e.target.checked)}
          />
          <span>Still in production</span>
        </label>
      </div>

      <textarea
        placeholder="Short description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        aria-label="Description"
      />

      <input
        className="file"
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        aria-label="Project image"
      />

      <input
        type="text"
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        aria-label="Tags"
      />

      <div className="actions">
        <button className="button" type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Add Project'}
        </button>
      </div>
    </form>
  );
}
