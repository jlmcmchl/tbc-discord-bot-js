class AbstractModule {
  constructor() {
    this.dClient = null;
    this.pgClient = null;
    this.esClient = null;
  }
  setDClient(client) {
    this.dClient = client;
  }
  setPGClient(client) {
    this.pgClient = client;
  }
  setESClient(client) {
    this.esClient = client;
  }
  getEvents() {
    return [];
  }
  getEndpoints() {
    return {};
  }
}

module.exports = AbstractModule;