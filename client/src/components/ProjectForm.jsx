import React, {
  useRef,
  useState,
} from 'react';

import axios from 'axios';

const API =
  import.meta.env.VITE_API_URL ||
  'http://localhost:3001';

export default function ProjectForm({
  onCreated,
}) {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [link2, setLink2] = useState('');
  const [description, setDescription] =
    useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] =
    useState(false);

  const fileRef = useRef();

  const submit = async (e) => {
    e.preventDefault();

    if (!title || !link) {
      return alert(
        'Please provide title and project link'
      );
    }

    try {
      setLoading(true);

      const form = new FormData();

      form.append('title', title);
      form.append('link', link);
      form.append('link2', link2);
      form.append('description', description);
      form.append('tags', tags);

      if (file) {
        form.append('image', file);
      }

      const code = window.prompt(
        'Enter admin code'
      );

      if (!code) {
        setLoading(false);
        return;
      }

      form.append('code', code);

      const { data } = await axios.post(
        `${API}/api/projects`,
        form,
        {
          headers: {
            'x-portfolio-code': code,
          },
        }
      );

      onCreated?.(data);

      setTitle('');
      setLink('');
      setLink2('');
      setDescription('');
      setTags('');
      setFile(null);

      if (fileRef.current) {
        fileRef.current.value = '';
      }
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          'Failed to create project'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="resume-project-form"
      onSubmit={submit}
    >

      <div className="form-field">
        <label>Project Title *</label>

        <input
          type="text"
          placeholder="Example: GoalFlow"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          required
        />
      </div>

      <div className="form-field">
        <label>Project / Repository URL *</label>

        <input
          type="url"
          placeholder="https://..."
          value={link}
          onChange={(e) =>
            setLink(e.target.value)
          }
          required
        />
      </div>

      <div className="form-field">
        <label>Live Demo URL</label>

        <input
          type="url"
          placeholder="https://..."
          value={link2}
          onChange={(e) =>
            setLink2(e.target.value)
          }
        />
      </div>

      <div className="form-field">
        <label>Technologies</label>

        <input
          type="text"
          placeholder="React, NestJS, PostgreSQL"
          value={tags}
          onChange={(e) =>
            setTags(e.target.value)
          }
        />
      </div>

      <div className="form-field form-full">
        <label>Description</label>

        <textarea
          placeholder="Briefly describe the project, its purpose and what you built..."
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />
      </div>

      <div className="form-field form-full">
        <label>Project Image</label>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFile(e.target.files?.[0])
          }
        />
      </div>

      <div className="form-actions form-full">
        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? 'Saving Project...'
            : 'Add Project'}
        </button>
      </div>

    </form>
  );
}