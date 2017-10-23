const AbstractModule = require('./AbstractModule');

class Base extends AbstractModule {
  constructor() {
    super();
  };
  getEvents() {
    return [];
  }
  getEndpoints() {
    return {
      '/': (request, response) => response.send("Hello World!"),
    };
  }
}

module.exports = Base;