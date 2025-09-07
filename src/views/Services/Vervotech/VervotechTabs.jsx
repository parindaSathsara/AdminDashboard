import React from 'react'
import { NavLink } from 'react-router-dom'

const VervotechTabs = () => {
  return (
    <ul className="nav nav-tabs mb-3">
      <li className="nav-item">
        <NavLink
          end
          to="/services/vervotech"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          Overview
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          to="/services/vervotech/hotel-initial-mapping"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          Hotel Initial Mapping Sync
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          to="/services/vervotech/hotel-incremental-mapping"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          Hotel Incremental Mapping Sync
        </NavLink>
      </li>
    </ul>
  )
}

export default VervotechTabs
