import React from 'react';

const OptionsItem = ({ value, name, checked, clickHandler }) =>
  <li className="options__item">
    <input
      type="radio"
      checked={checked}
      name={name} value={value}
      onChange={(e) => clickHandler(e)}
      className="options__input"
    />
    <span className="options__name">{
      value === "masstransit" ? "Mass transit" :
      value === "pedestrian" ? "Pedestrian" :
      value === "bicycle" ? "Bicycle" :
      value === "auto" ? "Automobile" :
      value === "on" ? "on" : "off"
    }</span>
  </li>

export default OptionsItem;
