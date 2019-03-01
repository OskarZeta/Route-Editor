import React from 'react';

const OptionsItem = ({ value, name, checked, clickHandler }) =>
  <li className="options__item">
    <label className="options__label">
      <div className="options__input-wrapper">
        <input
          type="radio"
          checked={checked}
          name={name} value={value}
          onChange={(e) => clickHandler(e)}
          className="options__input"
        />
        <span className="options__input-mark"></span>
      </div>
      <span className="options__name">{
        value === "masstransit" ? "Mass transit" :
        value === "pedestrian" ? "Pedestrian" :
        value === "bicycle" ? "Bicycle" :
        value === "auto" ? "Automobile" :
        value === "on" ? "on" : "off"
      }</span>
    </label>
  </li>

export default OptionsItem;
