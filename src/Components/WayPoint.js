import React from 'react';

const WayPoint = ({ index, name, changeWayPoints }) => {
  const onDragStart = e => {
    e.dataTransfer.setData("index", index);
  }
  const onDrop = e => {
    let i = e.dataTransfer.getData('index');
    changeWayPoints(index, i);
  }
  return(
    <div
      className="waypoint__wrapper"
      draggable="true"
      onDragStart={(e) => onDragStart(e)}
      onDrop={(e) => onDrop(e)}
    >
      <span className="waypoint__text">"{name}"</span>
    </div>
  );
}


export default WayPoint;
