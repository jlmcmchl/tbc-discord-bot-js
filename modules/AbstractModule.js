class AbstractModule {
  constructor() {
    this.dClient = null;
    this.esClient = null;
  }
  setDClient(client) {
    this.dClient = client;
  }
  setESClient(client) {
    this.esClient = client;
  }
  getEvents() {
    return [];
  }
}

module.exports = AbstractModule;