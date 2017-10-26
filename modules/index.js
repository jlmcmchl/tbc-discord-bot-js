var Base = require('./base');
var Tba = require('./tba-bot');
var Ds = require('./schedule-draft');
var Quote = require('./quote');
var GriffBot = require('./GriffBot');

class Modules {
  constructor() {
    this.modules = [
      new Base(),
      new Tba(),
      new Ds(),
      new Quote(),
      new GriffBot(),
    ];
  }
  Modules() {
    return this.modules;
  }
}

module.exports = Modules;
