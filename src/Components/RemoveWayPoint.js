import React from 'react';

const RemoveWayPoint = props => {
  return (
    <button
      onClick={() => props.removeWayPoint()}
      className="waypoint__remove-btn"
    >
      <div className="waypoint__remove-btn-icon"></div>
    </button>
  )
}

export default RemoveWayPoint;
