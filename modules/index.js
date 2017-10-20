var Base = require('./base');
var Tba = require('./tba-bot');
var Ds = require('./schedule-draft.js');

class Modules {
    constructor() {
        this.modules = [
            new Base(),
            new Tba(),
            new Ds(),
        ];
    }
    Modules() {
        return this.modules;
    }
}

module.exports = Modules;
