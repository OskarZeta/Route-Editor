import React from 'react';
import { shallow } from 'enzyme';
import App from '../Components/App';

const loadApp = withAPI => {
  if (withAPI) {
    return async () => {
      const app = shallow(<App/>);
      await app.instance().loadYandexMapApi();
      expect(app.state('ymaps')).toBeTruthy();
      return {
        app,
        instance: app.instance()
      };
    }
  } else {
    const app = shallow(<App/>);
    return {
      app,
      instance: app.instance()
    };
  }
}

describe('App component test', () => {
  it('Application renders without crashing', () => {
    const app = shallow(<App/>);
    expect(app.exists()).toBeTruthy();
  });
  it ('Yandex map api is loaded', async() => {
    const { app } = await loadApp(true)();
    expect(app.state('ymaps')).toBeTruthy();
  });
  it ('Creates a yandex map', async() => {
    const {app, instance} = await loadApp(true)();
    instance.createMap('map',
      { center: [55.754734, 37.583314], zoom: 10 }
    );
    expect(app.state('map')).toBeTruthy();
  });
  it ('Checks user position and creates a map', async () => {
    const {app, instance} = await loadApp(true)();
    instance.checkUserPosition();
    expect(app.state('map')).toBeTruthy();
  });
  it ('Creates a route', async () => {
    const {app, instance} = await loadApp(true)();
    instance.createRoute();
    expect(app.state('route')).toBeTruthy();
  });
  it ('Adds a waypoint', async () => {
    const {app, instance} = await loadApp(true)();
    instance.addWayPoint('testPoint');
    expect(app.state('waypoints')).toEqual([
      { name: 'testPoint', lat: 0, lon: 0 }
    ]);
  });
  it ('Swaps 2 waypoints', async () => {
    const {app, instance} = await loadApp(true)();
    instance.addWayPoint('Point 1', 10, 10);
    instance.addWayPoint('Point 2', 25, 90);
    instance.addWayPoint('Point 3', 51, 43);
    instance.changeWayPoints(0, 2);
    expect(app.state('waypoints')[0]).toEqual(
      { name: 'Point 3', lat: 51, lon: 43 }
    );
    expect(app.state('waypoints')[2]).toEqual(
      { name: 'Point 1', lat: 10, lon: 10 }
    );
  });
  it ('Removes a waypoint', async () => {
    const {app, instance} = await loadApp(true)();
    instance.addWayPoint('Point 1', 10, 10);
    instance.addWayPoint('Point 2', 25, 90);
    instance.addWayPoint('Point 3', 51, 43);
    instance.removeWayPoint(25, 90);
    expect(app.state('waypoints')).toEqual([
      { name: 'Point 1', lat: 10, lon: 10 },
      { name: 'Point 3', lat: 51, lon: 43 }
    ]);
  });
  it ('Updates route options', () => {
    const {app, instance} = loadApp();
    const value = 'auto';
    instance.updateRouteOptions(value);
    expect(app.state('routingMode')).toBe(value);
  });
  it ('Updates the route', async () => {
    const {app, instance} = await loadApp(true)();
    instance.addWayPoint('Point 1', 10, 10);
    instance.addWayPoint('Point 2', 25, 90);
    expect(app.state('route')).toBeTruthy();
    instance.addWayPoint('Point 3', 44, 44);
    instance.updateRoute('waypoints');
    expect(app.state('route').model.getReferencePoints()).toEqual([
      [ 10, 10 ], [ 25, 90 ], [ 44, 44 ]
    ]);
    instance.updateRouteOptions('bicycle');
    instance.updateRoute('mode');
    expect(app.state('route').model.getParams()).toEqual({
      routingMode: 'bicycle'
    });
  });
  it ('Turns crosshair on/off', () => {
    const {app, instance} = loadApp();
    instance.updateCrosshair(false);
    expect(app.state('crosshair')).toBeFalsy();
    instance.updateCrosshair(true);
    expect(app.state('crosshair')).toBeTruthy();
  });
  it ('Drags waypoint with mouse and changes waypoints array', async () => {
    const {app, instance} = await loadApp(true)();
    instance.addWayPoint('Point 1', 10, 10);
    instance.addWayPoint('Point 2', 25, 90);
    const fakeWaypoint = {
      get: function(type) {
        if (type === 'wayPoint') return {
          model: {
            properties: {
              _data: {
                index: 0,
                coordinates: [13, 17]
              }
            }
          }
        }
      }
    };
    instance.wayPointDragHandler(fakeWaypoint);
    expect(app.state('route').model.getReferencePoints()).toEqual([
      [ 17, 13 ], [ 25, 90 ]
    ]);
  });
});
