import React, { Component } from 'react';

const RemoveWayPoint = (props) => {
  return <button onClick={() => props.removeWayPoint(props.lat, props.lon)}>
    <span>X</span>
  </button>
}

export default RemoveWayPoint;
