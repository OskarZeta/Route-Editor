import React, { Component } from 'react';
import ymaps from 'ymaps';
import AddWayPoint from './AddWayPoint';
import WayPointsContainer from './WayPointsContainer';
import Options from './Options';
import Spinner from './Spinner';
import Header from './Header';

const defaultState = {
  lat: 55.754734,
  lon: 37.583314,
  map: null,
  ymaps: undefined,
  waypoints: [],
  routingMode: "auto",
  crosshair: true
};

const apiAddress = 'https://api-maps.yandex.ru/2.1/?apikey=ea6dba4a-0251-4ffa-a9a4-bcb0e00e4732&lang=ru_RU';

class App extends Component {
  state = { ...defaultState }
  loadYandexMapApi(apiAddress) {
    ymaps.load(apiAddress)
      .then(ymaps => this.setState({ ymaps }, () => this.checkUserPosition()))
      .catch(e => {
        throw new Error('Yandex API loading failure: ' + e);
      });
  }
  createMap(name, settings) {
    if (this.state.ymaps) {
      this.setState({
        map: new this.state.ymaps.Map(name, settings)
      });
    }
  }
  checkUserPosition() {
    const { lat, lon } = this.state;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.createMap('map', {
          center: [pos.coords.latitude, pos.coords.longitude],
          zoom: 10
        });
      }, e => {
        console.log(e.message);
        this.createMap('map', { center: [lat, lon], zoom: 10 });
      });
    } else {
      console.log("Geolocation is unavailable");
      this.createMap('map', { center: [lat, lon], zoom: 10 });
    }
  }
  createRoute() {
    this.setState({
      route: new this.state.ymaps.multiRouter.MultiRoute({
        referencePoints: this.state.waypoints.map(point => [point.lat, point.lon]),
        params: {
          results: 2,
          routingMode: this.state.routingMode
        }
      }, { boundsAutoApply: true })
    }, () => {
      this.state.route.editor.start({
        dragWayPoints: true,
        dragViaPoints: false,
        removeViaPoints: false,
        addMidPoints: false
      });
      this.state.route.editor.events.add('waypointdragend', e => this.wayPointDragHandler(e));
      this.state.route.events.add("click", () => this.balloonHandler());
      this.state.map.geoObjects.add(this.state.route);
    });
  }
  wayPointDragHandler(e) {
    const { index, coordinates } = e.get('wayPoint').model.properties._data;
    let waypoints = this.state.waypoints.slice(0);
    waypoints[index] = {
      name : waypoints[index].name,
      lat : coordinates[1],
      lon : coordinates[0]
    }
    this.setState({ waypoints }, () => this.updateRoute('waypoints'));
  }
  balloonHandler() {
    const { route, ymaps, waypoints } = this.state;
    route.getWayPoints().each((waypoint, i) => {
      let lat = waypoint.properties.getAll().coordinates[1];
      let lon = waypoint.properties.getAll().coordinates[0];
      ymaps.geoObject.addon.balloon.get(waypoint);
      waypoint.properties.set({
        balloonContent: waypoints[i].name
      });
      let geoCoder = ymaps.geocode([lat, lon]);
      geoCoder.then(res => {
        ymaps.geoObject.addon.balloon.get(waypoint);
        waypoint.properties.set({
          balloonContent: waypoints[i].name + '<br>' + res.geoObjects.get(0).getAddressLine()
        });
      });
    });
  }
  updateRoute = flag => {
    this.state.map.balloon.close();
    flag === 'waypoints' ?
    this.state.route.model.setReferencePoints(
      this.state.waypoints.map(point => [point.lat, point.lon])
    ) :
    this.state.route.model.setParams({
      routingMode: this.state.routingMode
    });
  }
  updateRouteOptions = value => {
    this.setState({ routingMode: value }, () => {
      if (this.state.route) this.updateRoute('mode');
    });
  }
  addWayPoint = (name, lat, lon) => {
    this.setState({
      waypoints: this.state.waypoints.concat({
        name,
        lat: lat || this.state.map.getCenter()[0],
        lon: lon || this.state.map.getCenter()[1]
      })
    }, () => {
      this.state.waypoints.length > 1 ?
      this.updateRoute('waypoints') : this.createRoute();
    });
  }
  changeWayPoints = (val1, val2) => {
    if (+val1 !== +val2) {
      let waypoints = this.state.waypoints.slice(0);
      [ waypoints[val1], waypoints[val2] ] = [ waypoints[val2], waypoints[val1] ];
      this.setState({ waypoints }, () => this.updateRoute('waypoints'));
    }
  }
  removeWayPoint = (lat, lon) => {
    this.setState({
      waypoints: this.state.waypoints.filter(point =>
        point.lat !== lat && point.lon !== lon
      )
    }, () => this.updateRoute('waypoints'));
  }
  updateCrosshair = value => {
    this.setState({ crosshair: value });
  }
  componentDidMount() {
    this.loadYandexMapApi(apiAddress);
  }
  render() {
    const { map, waypoints, crosshair, routingMode } = this.state;
    return (
      <div>
        <Header map={map}>
          <Options routingMode={routingMode} crosshair={crosshair}
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
            {map && <div className="waypoints">
              <AddWayPoint addWayPoint={this.addWayPoint}/>
              <WayPointsContainer waypoints={waypoints}
                removeWayPoint={this.removeWayPoint}
                changeWayPoints={this.changeWayPoints}
              />
            </div>}
          </div>
        </main>
      </div>
    );
  }
}

export default App;
