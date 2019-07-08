var Base = require('./base');
var Ds = require('./schedule-draft');
var GriffBot = require('./GriffBot');
var magicBall = require('./magicBall');
var nick = require("./nicknames");

class Modules {
  constructor() {
    this.modules = [
      new Base(),
      new Ds(),
      new GriffBot(),
      new magicBall(),
      new nick(),
    ];
  }
  Modules() {
    return this.modules;
  }
}

module.exports = Modules;
