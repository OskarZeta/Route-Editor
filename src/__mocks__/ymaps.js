export default {
  load: jest.fn(() => Promise.resolve({
    Map: function(name, settings) {
      return {
        name,
        center: settings.center,
        zoom: settings.zoom,
        balloon: {
          close: function() {}
        },
        getCenter: function() {
          return [0, 0];
        },
        geoObjects: {
          add: function(geoObject) {}
        }
      }
    },
    multiRouter: {
      MultiRoute: function(params, options) {
        return {
          editor: {
            start: function({}) {},
            events: {
              add: function(type, callback) {}
            }
          },
          events: {
            add: function(type, callback) {}
          },
          model: {
            setReferencePoints: function(points) {
              this.points = points;
            },
            setParams: function(params) {
              this.params = params;
            },
            getReferencePoints: function() {
              return this.points;
            },
            getParams: function() {
              return this.params;
            }
          }
        }
      }
    },
  }))
};
