import React, { useState } from 'react';
import settings from '../settings.svg';

const Header = ({ map, children }) => {
  const [options, triggerOptions] = useState(false);
  return (
    <header className="header">
      <div className="container">
        <h1>route editor app</h1>
        <div className="options">
          <button
            className={map ? options ? "options__btn options__btn--active" : "options__btn" : "options__btn options__btn--disabled"}
            disabled={!map}
            onClick={() => triggerOptions(!options)}
          >
            <img className="options__btn-icon" src={settings} alt="settings"/>
          </button>
          {options && children}
        </div>
      </div>
    </header>
  );
}

export default Header;
