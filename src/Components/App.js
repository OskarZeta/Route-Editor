import React, { Component } from 'react';
import ymaps from 'ymaps';
import AddWayPoint from './AddWayPoint';
import RemoveWayPoint from './RemoveWayPoint';
import WayPoint from './WayPoint';
import Options from './Options';

const defaultCoords = {
  lat: 55.754734,
  lon: 37.583314
};

class App extends Component {
  state = {
    ...defaultCoords,
    map: null,
    waypoints: [],
    options: false,
    routingMode: "auto",
    crosshair: true
  }
  createMap = settings => {
    this.setState({
      map: new this.state.ymaps.Map('map', settings)
    });
  }
  createRoute = () => {
    this.setState({
      route: new this.state.ymaps.multiRouter.MultiRoute({
        referencePoints: this.state.waypoints.map(point => [point.lat, point.lon]),
        params: {
          results: 2,
          routingMode: this.state.routingMode
        }
      }, {
        boundsAutoApply: true
      })
    }, () => {
      this.state.route.editor.start({
        dragWayPoints: true,
        dragViaPoints: false,
        removeViaPoints: false,
        addMidPoints: false
      });
      this.state.route.editor.events.add('waypointdragend', () => {
        let points = this.state.route.model.properties._data.waypoints;
        this.setState({
          waypoints: this.state.waypoints.map((point, i) => {
            if (point.lat !== points[i].coordinates[1] || point.lon !== points[i].coordinates[0]) {
              return {
                name : point.name,
                lat : points[i].coordinates[1],
                lon : points[i].coordinates[0]
              }
            }
            return point;
          })
        });
      });
    });
  }
  updateRoute = () => {
    this.state.route.model.setReferencePoints(
      this.state.waypoints.map(point => [point.lat, point.lon])
    );
  }
  updateRouteOptions = value => {
    this.setState({
      routingMode: value
    });
  }
  addWayPoint = name => {
    this.setState({
      waypoints: this.state.waypoints.concat({
        name,
        lat: this.state.map.getCenter()[0],
        lon: this.state.map.getCenter()[1]
      })
    });
  }
  removeWayPoint = (lat, lon) => {
    this.setState({
      waypoints: this.state.waypoints.filter(point =>
        point.lat !== lat && point.lon !== lon
      )
    });
  }
  updateCrosshair = val => {
    this.setState({
      crosshair: val
    });
  }
  componentDidMount() {
    ymaps.load('https://api-maps.yandex.ru/2.1/?apikey=ea6dba4a-0251-4ffa-a9a4-bcb0e00e4732&lang=ru_RU')
      .then(ymaps => this.setState({
        ymaps
      }));
  }
  componentDidUpdate(_, prevState) {
    if (this.state.ymaps !== prevState.ymaps) {
      const { ymaps, lat, lon } = this.state;
      navigator.geolocation.getCurrentPosition(
        () => {
          ymaps.geolocation.get().then(res => {
            this.createMap({
              center: [res.geoObjects.position[0], res.geoObjects.position[1]],
              zoom: 10
            });
          }, e => {
            console.log(e);
            this.createMap({
              center: [lat, lon],
              zoom: 10
            });
          })
        },
        e => {
          console.log(e.message);
          this.createMap({
            center: [lat, lon],
            zoom: 10
          })
        }
      );
    }
    if (this.state.waypoints !== prevState.waypoints) {
      this.state.route ? this.updateRoute() : this.createRoute();
    }
    if (this.state.route !== prevState.route) {
      this.state.map.geoObjects.add(this.state.route);
    }
    if (this.state.routingMode !== prevState.routingMode && this.state.route) {
      this.state.route.model.setParams({
        routingMode: this.state.routingMode
      });
    }
  }
  render() {
    const { map, waypoints, options, crosshair } = this.state;
    return (
      <div>
        <header className="header">
          <h1>route editor app</h1>
          <div className="options">
            <button className="options__show-btn" onClick={() => this.setState({options: !this.state.options})}>
              OPS
            </button>
            {options &&
              <Options
                routingMode={this.state.routingMode}
                updateRouteOptions={this.updateRouteOptions}
                updateCrosshair={this.updateCrosshair}
              />
            }
          </div>
        </header>
        <div className="App">
          {!map && <span>LOADING PLS WAIT......</span>}
          <div id="map" className="map">
            {map && crosshair && <span className="map__crosshair"></span>}
          </div>
          {map &&
            <div className="actions">
            <AddWayPoint addWayPoint={this.addWayPoint}/>
            {waypoints.length > 0 &&
              waypoints.map((point, i) =>
                <div key={i} className="waypoint">
                  <WayPoint index={i} name={point.name} lat={point.lat} lon={point.lon}/>
                  <RemoveWayPoint lat={point.lat} lon={point.lon} removeWayPoint={this.removeWayPoint}/>
                </div>
              )}
            </div>
          }
        </div>
      </div>
    );
  }
}

export default App;
