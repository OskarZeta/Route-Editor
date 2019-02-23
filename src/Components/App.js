import React, { Component } from 'react';
//import { Map, Marker, MarkerLayout } from 'yandex-map-react';
//import * as SuperMap from 'yandex-map-react';
import ymaps from 'ymaps';
import AddWayPoint from './AddWayPoint';
import RemoveWayPoint from './RemoveWayPoint';
import WayPoint from './WayPoint';

const defaultCoords = {
  lat: 55.754734,
  lon: 37.583314
};

class App extends Component {
  state = {
    ...defaultCoords,
    map: null,
    waypoints: []
  }
  createRoute = () => {
    this.setState({
      route: new this.state.ymaps.multiRouter.MultiRoute({
        referencePoints: this.state.waypoints.map(point => [point.lat, point.lon]),
        params: {
          results: 2
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
        let pointsDragged = this.state.route.model.properties._data.waypoints;
        this.setState({
          waypoints: this.state.waypoints.map((point, i) => {
            if (point.lat !== pointsDragged[i].coordinates[1] || point.lon !== pointsDragged[i].coordinates[0]) {
              return {
                name : point.name,
                lat : pointsDragged[i].coordinates[1],
                lon : pointsDragged[i].coordinates[0]
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
            createMap({
              center: [res.geoObjects.position[0], res.geoObjects.position[1]],
              zoom: 10
            });
          }, e => {
            console.log(e);
            createMap({
              center: [lat, lon],
              zoom: 10
            });
          })
        },
        e => {
          console.log(e.message);
          createMap({
            center: [lat, lon],
            zoom: 10
          })
        }
      );
      const createMap = settings => {
        this.setState({
          map: new ymaps.Map('map', settings)
        });
      }
    }
    if (this.state.waypoints !== prevState.waypoints) {
      if (!this.state.route) {
        this.createRoute();
      } else {
        this.updateRoute();
      }
    }
    if (this.state.route !== prevState.route) {
      this.state.map.geoObjects.add(this.state.route);
    }
  }
  render() {
    const { map, waypoints } = this.state;
    return (
      <div id="map">
        {!map && <span>LOADING PLS WAIT......</span>}
        {map &&
          <>
          <AddWayPoint addWayPoint={this.addWayPoint}/>
          {waypoints.length > 0 &&
            waypoints.map(point =>
              <div key={point.lat}>
                <WayPoint name={point.name} lat={point.lat} lon={point.lon}/>
                <RemoveWayPoint lat={point.lat} lon={point.lon} removeWayPoint={this.removeWayPoint}/>
              </div>
            )}
          </>
        }
      </div>
    );
  }
}

export default App;
