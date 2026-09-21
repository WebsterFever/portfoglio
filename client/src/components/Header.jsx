import React, { useEffect, useState } from 'react';
import profilePic from '../../assets/profile.jpg';

export default function Header() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('portfolio-theme') || 'light';
  });

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) =>
      current === 'light' ? 'dark' : 'light'
    );
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="resume-header" id="top">

      {/* TOP PROFILE */}
      <div className="resume-header-inner">
        <div className="profile-area">

          <img
            src={profilePic}
            alt="Webster Fievre"
            className="profile-photo"
          />

          <div className="profile-copy">
            <p className="profile-eyebrow">
              SOFTWARE ENGINEER
            </p>

            <h1>Webster Fievre</h1>

            <h2>
              Full-Stack Development
              <span> • </span>
              AI Engineering
            </h2>

            <div className="profile-contact-info">
              <p className="profile-location">
                Toronto, Ontario, Canada
              </p>

              <a
                href="https://www.websterfievre.com"
                target="_blank"
                rel="noreferrer"
                className="profile-website"
              >
                websterfievre.com
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="resume-nav">
        <div className="resume-nav-inner">

          {/* MOBILE HAMBURGER */}
          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span>☰</span>
            <span>Menu</span>
          </button>

          <div
            className={`nav-content ${menuOpen ? 'nav-open' : ''
              }`}
          >

            {/* LEFT SIDE */}
            <div className="nav-sections">
              <a href="#about" onClick={closeMenu}>
                Summary
              </a>

              <a href="#skills" onClick={closeMenu}>
                Skills
              </a>

              <a href="#experience" onClick={closeMenu}>
                Experience
              </a>

              <a href="#education" onClick={closeMenu}>
                Education
              </a>

              <a href="#training" onClick={closeMenu}>
                Training
              </a>

              <a href="#projects" onClick={closeMenu}>
                Projects
              </a>
            </div>

            {/* RIGHT SIDE */}
            <div className="nav-actions">

              <a
                href="mailto:your-email@example.com"
                className="nav-action-link"
                onClick={closeMenu}
              >
                Email
              </a>

              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                className="nav-action-link"
                onClick={closeMenu}
              >
                GitHub
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                className="nav-action-link"
                onClick={closeMenu}
              >
                LinkedIn
              </a>

              <a
                href="https://www.websterfievre.com"
                target="_blank"
                rel="noreferrer"
                className="nav-action-link"
                onClick={closeMenu}
              >
                Website
              </a>

              <button
                type="button"
                className="nav-theme-button"
                onClick={toggleTheme}
                aria-label="Toggle dark and light mode"
                title={
                  theme === 'light'
                    ? 'Switch to dark mode'
                    : 'Switch to light mode'
                }
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>

              <button
                type="button"
                className="nav-download-button"
                onClick={() => {
                  closeMenu();
                  window.print();
                }}
              >
                ↓ Download Résumé
              </button>

            </div>

          </div>
        </div>
      </nav>

    </header>
  );
}