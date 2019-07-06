var Base = require('./base');
var Ds = require('./schedule-draft');
var Quote = require('./quote');
var GriffBot = require('./GriffBot');
var magicBall = require('./magicBall');

class Modules {
  constructor() {
    this.modules = [
      new Base(),
      new Ds(),
      new Quote(),
      new GriffBot(),
      new TeamAwardList(),
      new magicBall(),
      new TBAWebhookHandler(),
    ];
  }
  Modules() {
    return this.modules;
  }
}

module.exports = Modules;
