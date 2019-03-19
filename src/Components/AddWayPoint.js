import React from 'react';

const AddWayPoint = ({ addWayPoint }) => {
  const keyUpHandler = e => {
    if (e.keyCode === 13) {
      let value = e.target.value.trim();
      if (value.length) {
        addWayPoint(value);
      }
      e.target.value = '';
    }
  };
  return <label onKeyUp={e => keyUpHandler(e)} className="waypoints__add">
    <span className="waypoints__add-text">Add waypoint:</span>
    <div className="waypoints__add-input-wrapper">
      <input className="waypoints__add-input" type="text"/>
    </div>
  </label>
}

export default AddWayPoint;
