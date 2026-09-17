import React from 'react';
import profilePic from '../../assets/profile.jpg';

export default function Header() {
  return (
    <header
      className="resume-header"
      id="top"
    >
      <div className="resume-header-inner">

        <div className="profile-area">

          <img
            src={profilePic}
            alt="Webster Fievre"
            className="profile-photo"
          />

          <div className="profile-copy">

            <p className="profile-eyebrow">
              SOFTWARE DEVELOPER
            </p>

            <h1>Webster Fievre</h1>

            <h2>
              Full-Stack Developer
              <span> | </span>
              AI Engineering
            </h2>

            <p className="profile-location">
              Toronto, Ontario, Canada
            </p>

          </div>
        </div>

        <div className="contact-area">

          <a
            href="mailto:your-email@example.com"
            className="contact-link"
          >
            Email
          </a>

          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="contact-link"
          >
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
            className="contact-link"
          >
            LinkedIn
          </a>

        </div>

      </div>

      <nav className="resume-nav">
        <div className="resume-nav-inner">

          <a href="#about">
            Summary
          </a>

          <a href="#skills">
            Skills
          </a>

          <a href="#experience">
            Experience
          </a>

          <a href="#education">
            Education
          </a>

          <a href="#training">
            Training
          </a>

          <a href="#projects">
            Projects
          </a>

        </div>
      </nav>
    </header>
  );
}