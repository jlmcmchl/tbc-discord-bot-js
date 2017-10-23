var Base = require('./base');
var Tba = require('./tba-bot');
var Ds = require('./schedule-draft');
var Quote = require('./quote');

class Modules {
  constructor() {
    this.modules = [
      new Base(),
      new Tba(),
      new Ds(),
      new Quote(),
    ];
  }
  Modules() {
    return this.modules;
  }
}

module.exports = Modules;
