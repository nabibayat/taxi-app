import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import './NavBar.css';

function NavBar() {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(!open);
  const closeMenu = () => setOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button className="burger" onClick={toggleMenu} aria-label="Toggle navigation">
          <FaBars />
        </button>
        <ul className={`navbar-list ${open ? 'open' : ''}`}>
          <li className="navbar-item" onClick={closeMenu}>
            <Link to="/fahrer">Fahrer</Link>
          </li>
          <li className="navbar-item" onClick={closeMenu}>
            <Link to="/autos">Autos</Link>
          </li>
          <li className="navbar-item" onClick={closeMenu}>
            <Link to="/autoDriverLogs">AutoDriver Report</Link>
          </li>
          <li className="navbar-item" onClick={closeMenu}>
            <Link to="/admin">Admin Panel</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
