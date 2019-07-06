const AbstractModule = require('./AbstractModule');

class Base extends AbstractModule {
  getEvents() {
    return [{
      'key': 'ready',
      'callback': () => {
        this.dClient.user.setPresence({
          'status': 'online',
          'afk': false,
          'activity': {
            'name': 'Maintenance Window'
          }
        });
      }
    }];
  }
  getEndpoints() {
    return {
      '/': (request, response) => response.send("Hello World!"),
    };
  }
}

module.exports = Base;