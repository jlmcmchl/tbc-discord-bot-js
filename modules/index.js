var Base = require('./base');
var Tba = require('./tba-bot');
var Ds = require('./schedule-draft');
var Quote = require('./quote');
var GriffBot = require('./GriffBot');
var TeamAwardList = require('./TeamAwardList');
// var CDSpyMonitor = require('./CDSpyMonitor');
var magicBall = require('./magicBall');
var TBAWebhookHandler = require('./TBAWebhookHandler');
//var MessageCrawler = require('./messageCrawler');

class Modules {
  constructor() {
    this.modules = [
      new Base(),
      new Tba(),
      new Ds(),
      new Quote(),
      new GriffBot(),
      //new CDSpyMonitor(),
      //new TeamAwardList(),
      new magicBall(),
      new TBAWebhookHandler(),
      //new MessageCrawler(),
    ];
  }
  Modules() {
    return this.modules;
  }
}

module.exports = Modules;
