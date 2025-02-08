import React from 'react';
import './Header.css'; // Import the CSS file

function Header() {
  return (
    <header className="header">
      <div className="logo">
       FinIsh
      </div>
      <nav className="nav">
        <a href="/">Profile</a>
        <a href="/about">My Learning</a>
        <a href="/contact">My Threads</a>
      </nav>
    </header>
  );
}

export default Header;