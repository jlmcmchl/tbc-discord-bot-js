class AbstractModule {
  constructor() {
    this.dClient = null;
    this.pgClient = null;
  }
  setDClient(client) {
    this.dClient = client;
  }
  setPGClient(client) {
    this.pgClient = client;
  }
  getEvents() {
    return [];
  }
  getEndpoints() {
    return {};
  }
}

module.exports = AbstractModule;