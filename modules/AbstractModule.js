class AbstractModule {
    constructor() { this.dClient = null; }
    setClient(client) { this.dClient = client; }
    getEvents() { return {}; }
    getEndpoints() { return {}; }
}

module.exports = AbstractModule;