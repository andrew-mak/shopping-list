import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Layout.css'

const Layout = props => {
  return (
    <div className="layout">
      <nav>
        <Link to="/purchases">Purchases</Link>
        <Link to="/add">Add</Link>
      </nav>
      {props.child}
    </div>
  )
}

export default Layout;