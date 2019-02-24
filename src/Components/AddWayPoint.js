import React from 'react';

const AddWayPoint = (props) => {
  return <label onKeyUp={(e) => {
    if (e.keyCode === 13) {
      let value = e.target.value.trim();
      if (value.length) {
        props.addWayPoint(value);
      }
      e.target.value = '';
    }
  }} className="actions__add-container">
    <span className="actions__add-text">Add waypoint:</span>
    <input className="actions__input" type="text"/>
  </label>
}

export default AddWayPoint;
