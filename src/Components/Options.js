import React, { Component } from 'react';
import OptionsItem from './OptionsItem';

class Options extends Component {
  state = {
    mode: this.props.routingMode || "auto",
    crosshair: this.props.crosshair || true
  }
  clickHandler = e => {
    e.target.name === "mode" ?
    this.setState({
      mode: e.target.value
    }) :
    this.setState({
      crosshair: e.target.value === "on" ? true : false
    });
    // const name = e.target.name;
    // this.setState({
    //   name : e.target.value
    // });
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
    return(
      <>
      <h2>Type of route:</h2>
      <ul className="options__list">
        <OptionsItem
          value="auto" checked={this.state.mode === "auto"}
          name="mode" clickHandler={this.clickHandler}
        />
        <OptionsItem
          value="masstransit" checked={this.state.mode === "masstransit"}
          name="mode" clickHandler={this.clickHandler}
        />
        <OptionsItem
          value="pedestrian" checked={this.state.mode === "pedestrian"}
          name="mode" clickHandler={this.clickHandler}
        />
        <OptionsItem
          value="bicycle" checked={this.state.mode === "bicycle"}
          name="mode" clickHandler={this.clickHandler}
        />
      </ul>
      <h2>Crosshair:</h2>
      <ul className="options__list">
        <OptionsItem
          value="on" checked={this.state.crosshair}
          name="crosshair" clickHandler={this.clickHandler}
        />
        <OptionsItem
          value="off" checked={!this.state.crosshair}
          name="crosshair" clickHandler={this.clickHandler}
        />
      </ul>
      </>
    );
  }
}


export default Options;
