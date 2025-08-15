
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
      await axios.delete(`${API}/api/projects/` + project.id, {
        headers: { 'x-portfolio-code': code },
      });
      onDeleted(project.id);
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to delete');
    }
  };

  const dateLabel =
    project.developedAt
      ? new Date(project.developedAt).toLocaleDateString()
      : project.createdAt
      ? new Date(project.createdAt).toLocaleDateString()
      : null;

  return (
    <div className="card">
      {project.imagePath && (
        <img src={`${API}${project.imagePath}`} alt={project.title} />
      )}

      <h3>{project.title}</h3>

      {/* Meta: date + production status */}
      {(dateLabel || typeof project.inProduction === 'boolean') && (
        <p style={{ opacity: 0.85, margin: '4px 6px 8px' }}>
          {dateLabel && <span>📅 {dateLabel}</span>}
          {typeof project.inProduction === 'boolean' && (
            <>
              {' '}
              <span
                className="badge"
                style={{
                  marginLeft: 8,
                  borderStyle: 'solid',
                  borderColor: project.inProduction ? '#10b98155' : '#94a3b855',
                  color: project.inProduction ? '#34d399' : '#94a3b8',
                }}
              >
                {project.inProduction ? 'In production' : 'Completed'}
              </span>
            </>
          )}
        </p>
      )}

      {project.description && <p>{project.description}</p>}

      {project.tags && project.tags.length > 0 && (
        <div className="badges">
          {project.tags.map((t, i) => (
            <span key={i} className="badge">
              #{t}
            </span>
          ))}
        </div>
      )}

      <a href={project.link} target="_blank" rel="noreferrer">
        Open Project
      </a>
      <a onClick={del} style={{ cursor: 'pointer' }}>
        Delete
      </a>
    </div>
  );
}
