import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Layout.css';
import listLogo from "../../assets/logo-100.png"

const Layout = props => {
  return (
    <div className="App">
      <header className="layout">
        <div className="container">
          <div className="logo">
            <img src={listLogo} alt="logo" />
            <span>Shopping list</span>
          </div>
          <nav>
            <Link to="/purchases">Purchases</Link>
            <Link to="/done">Done</Link>
            <Link to="/add">Add</Link>
          </nav>
        </div>
      </header>
      {props.children}
    </div>
  )
}

export default Layout;