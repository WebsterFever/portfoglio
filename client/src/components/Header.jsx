
import React from 'react';
import profilePic from '../../assets/profile.jpg';

export default function Header({ query, setQuery }) {
  return (
    <div className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img
          src={profilePic}
          alt="Profile"
          style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent)' }}
        />
        <div className="brand">Webster</div>
      </div>
      <div className="search">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or tag..."
          aria-label="Search"
        />
      </div>
    </div>
  );
}
