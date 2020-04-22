import React, { useContext } from 'react';
import ThemeContext from '../contexts/theme';
import { NavLink } from 'react-router-dom';

//the style applied to the link when it's active (a feature of NavLink vs. Nav)
const activeStyle = {
  color: 'rgb(187, 46, 31)',
};

export default function Nav({ toggleTheme }) {
  // Hooks to consume the light/dark theme
  const theme = useContext(ThemeContext);

  return (
    <nav className='row space-between'>
      <ul className='row nav'>
        <li>
          <NavLink exact to='/' activeStyle={activeStyle} className='nav-link'>
            Popular
          </NavLink>
        </li>
        <li>
          <NavLink to='/battle' activeStyle={activeStyle} className='nav-link'>
            Battle
          </NavLink>
        </li>
      </ul>
      <button
        style={{ fontSize: 30 }}
        className='btn-clear'
        onClick={toggleTheme}
      >
        {theme === 'light' ? '🔦' : '💡'}
      </button>
    </nav>
  );
}
