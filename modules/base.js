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
            'name': 'Office Simulator 2019'
          }
        });
      }
    }];
  }
}

module.exports = Base;