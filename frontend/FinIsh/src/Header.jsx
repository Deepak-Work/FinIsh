import React, { useContext } from 'react';
import './Header.css'; // Import the CSS file
import { AuthOptions } from './authentication/AuthOptions';


function Header() {
  const {isAuthenticated, logout} = useContext(AuthOptions);
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
        <a href="/#sections">Sections</a>
        {isAuthenticated && (<a href="/" onClick={logout}>Logout</a>)}
      </nav>
    </header>
  );
}

export default Header;