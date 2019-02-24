import React from 'react';

const RemoveWayPoint = props => {
  return (
    <button
      onClick={() => props.removeWayPoint(props.lat, props.lon)}
      className="waypoint__remove-btn"
    >
      <span>X</span>
    </button>
  )
}

export default RemoveWayPoint;
