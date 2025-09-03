import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; // Make sure to create and link this CSS file

function NavBar() {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
       
        <li className="navbar-item"><Link to="/fahrer">Fahrer</Link></li>
        <li className="navbar-item"><Link to="/autos">Autos</Link></li>
        <li className="navbar-item"><Link to="/autoDriverLogs">AutoDriver Report</Link></li>
        <li className="navbar-item"><Link to="/admin">Admin Panel</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;
