import React, { Component } from 'react';

const WayPoint = (props) => {
  return <div>
    {props.name}
    {' ' +props.lat+ ' '}
    {props.lon}
  </div>
}

export default WayPoint;
