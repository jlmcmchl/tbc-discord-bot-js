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
    }, {
      'key': 'message',
      'callback': message => {
        if (!message.guild) {
          console.log("DM Received");
          console.log(message);
        }
      }
    }];
  }
}

module.exports = Base;