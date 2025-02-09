import React from 'react';
import './Header.css'; // Import the CSS file

function Header() {
  return (
    <header className="header">
      <div className="logo">
      <a href="/">FinIsh</a>
      </div>
      <nav className="nav">
        <a href="/#profile">Profile</a>
        <a href="/#enrollment">Enrollment</a>
        <a href="/#discussion">Discussion</a>
        <a href="/#explore">Explore</a>
        <a href="/#sections">Sections</a>
      </nav>
    </header>
  );
}

export default Header;