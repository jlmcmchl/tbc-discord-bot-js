const AbstractModule = require('./AbstractModule');
const request = require('request');
const xmlNodes = require('xml-nodes');
const xmlObjects = require('xml-objects');

class CDSpyMonitor extends AbstractModule {
  constructor() {
    super();

    this.latest = 0;
  }
  
  CDSpyUpdate() {
    console.log('Making request to CD Spy', this.latest);

    request('https://www.chiefdelphi.com/forums/cdspy.php?do=xml&last=' + this.latest)
      .pipe(xmlNodes('event'))
      .pipe(xmlObjects())
      .on('data', data => {
        this.latest = data.event.id[0] > this.latest ? data.event.id[0] : this.latest;

        if (data.event.forumname[0] == 'Fantasy FIRST' && data.event.what[0] == 'New Thread') {
          var msg = data.event.title[0] + 
            ": Runner: " + data.event.poster[0] + 
            ", Date: " + (new Date().getMonth() + 1) + "/" + new Date().getDate() +
            ", Link: https://www.chiefdelphi.com/forums/showthread.php?t=" + data.event.threadid[0];
            
            this.dClient.channels.resolve(process.env.FF_THREAD_CHANNEL).send(msg);
        } 
      });
  }

  getEvents() {
    return [
      {
        'key': 'ready',
        'callback': () => {
          this.CDSpyUpdate(this.dClient);
          this.interval = setInterval(() => this.CDSpyUpdate(), 60000);
        }
      },
    ];
  }
}


module.exports = CDSpyMonitor;