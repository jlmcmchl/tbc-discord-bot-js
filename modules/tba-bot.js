const AbstractModule = require('./AbstractModule');
const initTBA = require('../lib/tba-api-v3');
team = /\[\[(\d+)\]\]/g;

class initTBABot extends AbstractModule {
  constructor() {
    super();
    this.tba = new initTBA(process.env.XTBAAUTHKEY || '');
  }
  getEvents() {
    return [{
      'key': 'message',
      'callback': message => {
        var date
        date = new Date()
        message.content.replace(team, (a, b, c, d) => {
          this.tba.TeamEvents(b, date.getFullYear(), 'simple', (err, events) => {
            if (err) {
              console.log(err); return;
            }

            var event = events.reduce((lEvent, cEvent) => {
              var ld;
              var sd
              var ed
              var t
              ld = Date.parse(lEvent['end_date']);
              sd = Date.parse(cEvent['start_date']);
              ed = new Date(cEvent['end_date']);
              ed = new Date(ed.getFullYear(), ed.getMonth(), ed.getDate() + 1).getTime();
              t = date.getTime();

              if ((sd < t && t < ed) || (ld < ed && ed < t)) {
                return cEvent;
              }
              return lEvent;
            });

            this.tba.TeamEventStatus(b, new Date().getFullYear() + event['event_code'], (err, status) => {
              if (err) {
                console.log(err);
                console.log(status);
                return;
              }
              if (status == null) {
                message.channel.send(`It looks like ${event['name']} hasn't started yet. Check back once matches have begun for a status update!`);
                return;
              }

              var report = status['overall_status_str'];
              report = report.replace(/<\/?b>/g, '**');

              message.channel.send(`At ${event['name']}, ${report}`);
            });
          });
        });
      }
    }];
  }
}

module.exports = initTBABot;