
// import React, { useRef, useState } from 'react';
// import axios from 'axios';

// const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// export default function ProjectForm({ onCreated }) {
//   const [title, setTitle] = useState('');
//   const [link, setLink] = useState('');
//   const [description, setDescription] = useState('');
//   const [tags, setTags] = useState('');
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const fileRef = useRef();

//   const submit = async (e) => {
//     e.preventDefault();
//     if (!title || !link) return alert('Please provide title and link');
//     try {
//       setLoading(true);
//       const form = new FormData();
//       form.append('title', title);
//       form.append('link', link);
//       form.append('description', description);
//       form.append('tags', tags);
//       if (file) form.append('image', file);

//       const code = window.prompt('Enter admin code');
//       if (!code) { setLoading(false); return; }
//       form.append('code', code);

//       const { data } = await axios.post(`${API}/api/projects`, form, {
//         headers: { 'Content-Type': 'multipart/form-data', 'x-portfolio-code': code }
//       });
//       onCreated(data);
//       setTitle(''); setLink(''); setDescription(''); setTags('');
//       setFile(null); if (fileRef.current) fileRef.current.value = null;
//     } catch (err) {
//       console.error(err);
//       alert(err?.response?.data?.message || 'Failed to create project');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form className="form" onSubmit={submit}>
//       <input type="text" placeholder="Project title *" value={title} onChange={e => setTitle(e.target.value)} />
//       <input type="url" placeholder="Project link (https://...)*" value={link} onChange={e => setLink(e.target.value)} />
//       <textarea placeholder="Short description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
//       <input className="file" ref={fileRef} type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0])} />
//       <input type="text" placeholder="Tags (comma-separated)" value={tags} onChange={e => setTags(e.target.value)} />
//       <div className="actions">
//         <button className="button" disabled={loading}>{loading ? 'Saving...' : 'Add Project'}</button>
//       </div>
//     </form>
//   );
// }
import React, { useRef, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function ProjectForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [developedAt, setDevelopedAt] = useState('');      // NEW
  const [inProduction, setInProduction] = useState(true);  // NEW
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const submit = async (e) => {
    e.preventDefault();
    if (!title || !link) return alert('Please provide title and link');

    try {
      setLoading(true);
      const form = new FormData();
      form.append('title', title);
      form.append('link', link);
      form.append('description', description);
      form.append('tags', tags);
      if (developedAt) form.append('developedAt', developedAt); // NEW
      form.append('inProduction', String(inProduction));         // NEW
      if (file) form.append('image', file);

      const code = window.prompt('Enter admin code');
      if (!code) { setLoading(false); return; }
      form.append('code', code);

      const { data } = await axios.post(`${API}/api/projects`, form, {
        headers: { 'Content-Type': 'multipart/form-data', 'x-portfolio-code': code }
      });

      onCreated(data);
      setTitle(''); setLink(''); setDescription(''); setTags('');
      setDevelopedAt(''); setInProduction(true);
      setFile(null); if (fileRef.current) fileRef.current.value = null;
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <input type="text" placeholder="Project title *" value={title} onChange={e => setTitle(e.target.value)} />
      <input type="url" placeholder="Project link (https://...)*" value={link} onChange={e => setLink(e.target.value)} />

      {/* NEW: developed date + production flag */}
      <input
        type="date"
        value={developedAt}
        onChange={e => setDevelopedAt(e.target.value)}
        placeholder="Developed on"
      />
      <label style={{display:'flex',alignItems:'center',gap:8}}>
        <input
          type="checkbox"
          checked={inProduction}
          onChange={e => setInProduction(e.target.checked)}
        />
        Still in production
      </label>

      <textarea placeholder="Short description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
      <input className="file" ref={fileRef} type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0])} />
      <input type="text" placeholder="Tags (comma-separated)" value={tags} onChange={e => setTags(e.target.value)} />

      <div className="actions">
        <button className="button" disabled={loading}>
          {loading ? 'Saving...' : 'Add Project'}
        </button>
      </div>
    </form>
  );
}
