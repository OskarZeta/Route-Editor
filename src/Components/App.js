import React, { Component } from 'react';
import ymaps from 'ymaps';
import AddWayPoint from './AddWayPoint';
import RemoveWayPoint from './RemoveWayPoint';
import WayPoint from './WayPoint';
import Options from './Options';
import Spinner from './Spinner';
import Header from './Header';

const defaultState = {
  lat: 55.754734,
  lon: 37.583314,
  map: null,
  waypoints: [],
  routingMode: "auto",
  crosshair: true
};

class App extends Component {
  state = {
    ...defaultState
  }
  createMap(settings) {
    this.setState({
      map: new this.state.ymaps.Map('map', settings)
    });
  }
  createRoute() {
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
      const { route, ymaps } = this.state;
      route.editor.start({
        dragWayPoints: true,
        dragViaPoints: false,
        removeViaPoints: false,
        addMidPoints: false
      });
      route.editor.events.add('waypointdragend', (e) => {
        const { index, coordinates } = e.get("wayPoint").model.properties._data;
        let waypoints = this.state.waypoints.slice(0);
        waypoints[index] = {
          name : waypoints[index].name,
          lat : coordinates[1],
          lon : coordinates[0]
        }
        this.setState({
          waypoints
        });
      });
      route.events.add("update", () => {
        route.getWayPoints().each((waypoint, i) => {
          ymaps.geoObject.addon.balloon.get(waypoint);
          waypoint.properties.set({
            balloonContent: this.state.waypoints[i].name
          });
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
  updateCrosshair = value => {
    this.setState({
      crosshair: value
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
    const { map, waypoints, crosshair, routingMode } = this.state;
    return (
      <div>
        <Header map={map}>
          <Options
            routingMode={routingMode}
            crosshair={crosshair}
            updateRouteOptions={this.updateRouteOptions}
            updateCrosshair={this.updateCrosshair}
          />
        </Header>
        <main>
          <div className="container container--content">
            {!map && <Spinner />}
            <div id="map" className="map">
              {map && crosshair && <span className="map__crosshair"></span>}
            </div>
            {map &&
              <div className="waypoints">
                <AddWayPoint addWayPoint={this.addWayPoint}/>
                <div className="waypoints__wrapper">
                  {waypoints.length > 0 && waypoints.map((point, i) =>
                    <div key={i} className="waypoint">
                      <WayPoint index={i} name={point.name} />
                      <RemoveWayPoint removeWayPoint={() => this.removeWayPoint(point.lat, point.lon)}/>
                    </div>
                  )}
                </div>
              </div>
            }
          </div>
        </main>
      </div>
    );
  }
}

export default App;
