var Base = require('./base');
var Archive = require('./archive');
var MagicBall = require('./magicBall');
var Nick = require("./nicknames");
var TeamManager = require("./teamManager");

class Modules {
  constructor() {
    this.modules = [
      new Base(),
      new Archive(),
      new MagicBall(),
      new Nick(),
      new TeamManager(),
    ];
  }
  Modules() {
    return this.modules;
  }
}

module.exports = Modules;
