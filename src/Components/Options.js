import React from 'react';
import OptionsItem from './OptionsItem';

const Options = ({ routingMode, crosshair, updateRouteOptions, updateCrosshair }) => {
  const clickHandler = e => {
    e.target.name === "mode" ?
      updateRouteOptions(e.target.value) :
      updateCrosshair(e.target.value === "on" ? true : false);
  }
  return(
    <div className="options__wrapper">
      <h2>Type of route:</h2>
      <ul className="options__list">
        <OptionsItem
          value="auto" checked={routingMode === "auto"}
          name="mode" clickHandler={clickHandler}
        />
        <OptionsItem
          value="masstransit" checked={routingMode === "masstransit"}
          name="mode" clickHandler={clickHandler}
        />
        <OptionsItem
          value="pedestrian" checked={routingMode === "pedestrian"}
          name="mode" clickHandler={clickHandler}
        />
        <OptionsItem
          value="bicycle" checked={routingMode === "bicycle"}
          name="mode" clickHandler={clickHandler}
        />
      </ul>
      <h2>Crosshair:</h2>
      <ul className="options__list">
        <OptionsItem
          value="on" checked={crosshair}
          name="crosshair" clickHandler={clickHandler}
        />
        <OptionsItem
          value="off" checked={!crosshair}
          name="crosshair" clickHandler={clickHandler}
        />
      </ul>
    </div>
  );
}

export default Options;
