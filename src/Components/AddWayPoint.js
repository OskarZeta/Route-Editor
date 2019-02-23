import React, { Component } from 'react';

const AddWayPoint = (props) => {
  return <label onKeyUp={(e) => {
    if (e.keyCode === 13) {
      let value = e.target.value.trim();
      if (value.length) {
        props.addWayPoint(value);
      }
    }
  }}>
    <span>add waypoint</span>
    <input type="text"/>
  </label>
}

export default AddWayPoint;
