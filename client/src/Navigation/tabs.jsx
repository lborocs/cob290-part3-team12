import { NavLink, Outlet } from 'react-router-dom';
import React from 'react';
import './tabs.css'; 

function TabLayout() {
  return (
    <div>
      <nav className='tabBar'>
      <NavLink 
          to="/" 
          className={({ isActive }) => "tab" + (isActive ? " active" : "")}
        >
          Log Out
        </NavLink>
        <NavLink 
          to="/textchat" 
          className={({ isActive }) => "tab" + (isActive ? " active" : "")}
        >
          Text Chat
        </NavLink>

        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => "tab" + (isActive ? " active" : "")}
        >
          Data Analytics
        </NavLink>
        
      </nav>

      <Outlet />
    </div>
  );
}

export default TabLayout;
