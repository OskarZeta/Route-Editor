import React, { Component } from 'react';
import OptionsItem from './OptionsItem';

class Options extends Component {
  state = {
    mode: this.props.routingMode,
    crosshair: this.props.crosshair
  }
  clickHandler = e => {
    e.target.name === "mode" ?
      this.setState({
        mode: e.target.value
      }) :
      this.setState({
        crosshair: e.target.value === "on" ? true : false
      });
  }
  componentDidUpdate(_, prevState) {
    if (this.state.mode !== prevState.mode) {
      this.props.updateRouteOptions(this.state.mode);
    }
    if (this.state.crosshair !== prevState.crosshair) {
      this.props.updateCrosshair(this.state.crosshair);
    }
  }
  render() {
    const { mode, crosshair } = this.state;
    return(
      <div className="options__wrapper">
        <h2>Type of route:</h2>
        <ul className="options__list">
          <OptionsItem
            value="auto" checked={mode === "auto"}
            name="mode" clickHandler={this.clickHandler}
          />
          <OptionsItem
            value="masstransit" checked={mode === "masstransit"}
            name="mode" clickHandler={this.clickHandler}
          />
          <OptionsItem
            value="pedestrian" checked={mode === "pedestrian"}
            name="mode" clickHandler={this.clickHandler}
          />
          <OptionsItem
            value="bicycle" checked={mode === "bicycle"}
            name="mode" clickHandler={this.clickHandler}
          />
        </ul>
        <h2>Crosshair:</h2>
        <ul className="options__list">
          <OptionsItem
            value="on" checked={crosshair}
            name="crosshair" clickHandler={this.clickHandler}
          />
          <OptionsItem
            value="off" checked={!crosshair}
            name="crosshair" clickHandler={this.clickHandler}
          />
        </ul>
      </div>
    );
  }
}


export default Options;
