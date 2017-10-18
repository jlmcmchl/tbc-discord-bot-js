var tba = require('./tba-bot');

class Modules {
    constructor() {
        this.modules = [new tba()];
    }
    Modules() {
        return this.modules;
    }
}

module.exports = Modules;
