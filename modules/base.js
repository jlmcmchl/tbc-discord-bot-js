const AbstractModule = require('./AbstractModule');

class Base extends AbstractModule {
  getEndpoints() {
    return {
      '/': (request, response) => response.send("Hello World!"),
    };
  }
}

module.exports = Base;