import React from "react";
import WayPoint from './WayPoint';
import RemoveWayPoint from './RemoveWayPoint';

const WayPointsContainer = ({ waypoints, removeWayPoint, changeWayPoints }) => {
  const onDragOver = e => {
    e.preventDefault();
  }
  return(
    <div className="waypoints__wrapper" onDragOver={(e) => onDragOver(e)}>
      {waypoints.length > 0 && waypoints.map((point, i) =>
        <div key={i} className="waypoint">
          <WayPoint index={i} name={point.name} changeWayPoints={changeWayPoints}/>
          <RemoveWayPoint removeWayPoint={() => removeWayPoint(point.lat, point.lon)}/>
        </div>
      )}
    </div>
  );
}

export default WayPointsContainer;
