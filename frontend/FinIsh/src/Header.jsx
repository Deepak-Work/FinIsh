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
        <a href="/#enrollment">Enrollment</a>
        <a href="/#discussion">Discussion</a>
        <a href="/#explore">Explore</a>
        <a href="/#aboutus">About Us</a>
      </nav>
    </header>
  );
}

export default Header;