import React from 'react';

const letters = "ABCDEFGHIJ";

const WayPoint = ({ index, name }) =>
  <div className="waypoint__wrapper">
    <span className="waypoint__text">"{name}"</span>
    {index < 10 && <span> (point {letters.split('')[index]})</span>}
  </div>

export default WayPoint;
