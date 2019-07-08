var Base = require('./base');
var Archive = require('./archive');
var magicBall = require('./magicBall');
var nick = require("./nicknames");

class Modules {
  constructor() {
    this.modules = [
      new Base(),
      new Archive(),
      new magicBall(),
      new nick(),
    ];
  }
  Modules() {
    return this.modules;
  }
}

module.exports = Modules;
