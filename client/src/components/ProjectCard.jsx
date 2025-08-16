
// import React from 'react';
// import axios from 'axios';

// const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// export default function ProjectCard({ project, onDeleted }) {
//   const del = async () => {
//     if (!confirm('Delete this project?')) return;
//     try {
//       const code = window.prompt('Enter admin code to delete');
//       if (!code) return;
//       await axios.delete(`${API}/api/projects/` + project.id, { headers: { 'x-portfolio-code': code } });
//       onDeleted(project.id);
//     } catch (e) {
//       alert(e?.response?.data?.message || 'Failed to delete');
//     }
//   };

//   return (
//     <div className="card">
//       {project.imagePath && <img src={`${API}${project.imagePath}`} alt={project.title} />}
//       <h3>{project.title}</h3>
//       {project.description && <p>{project.description}</p>}
//       {project.tags && project.tags.length > 0 && (
//         <div className="badges">
//           {project.tags.map((t, i) => <span key={i} className="badge">#{t}</span>)}
//         </div>
//       )}
//       <a href={project.link} target="_blank" rel="noreferrer">Open Project</a>
//       <a onClick={del} style={{ cursor: 'pointer' }}>Delete</a>
//     </div>
//   );
// }
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

  // New fields + backward-compat fallback
  const live = project.liveUrl || null;
  const code = project.codeUrl || project.link || null;

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

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '6px' }}>
        {live && (
          <a href={live} target="_blank" rel="noreferrer">Live URL</a>
        )}
        {code && (
          <a href={code} target="_blank" rel="noreferrer">Code URL</a>
        )}
        {!live && !code && project.link && (
          <a href={project.link} target="_blank" rel="noreferrer">Open Project</a>
        )}
      </div>

      <a onClick={del} style={{ cursor: 'pointer' }}>Delete</a>
    </div>
  );
}
