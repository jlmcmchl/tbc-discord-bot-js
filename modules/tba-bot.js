var initTBA = require('../lib/tba-api-v3');
team = /\[\[(\d+)\]\]/g;

class initTBABot {
    constructor() {
        this.tba = new initTBA(process.env.XTBAAUTHKEY || '');
    }
    getEvents() { return {'message': message => {
        message.content.replace(team, (a,b,c,d) => {
            var lEvent, lCode, lTime, date;
            date = new Date();
            lTime = new Date(0,1,1);
            this.tba.TeamEvents(b, date.getFullYear(), 'simple', (err, events) => {
                if(err) { console.log(err); return; }
    
                for (var i in events) {
                    var event, sd, ed, t
                    event = events[i];
                    sd = Date.parse(event['start_date']);
                    ed = new Date(event['end_date']);
                    ed = new Date(ed.getFullYear(), ed.getMonth(), ed.getDate() + 1).getTime();
                    t = new Date().getTime();
                    
                    if ((sd < t && t < ed) || (lTime < ed && ed < t)) {
                        lTime = ed;
                        lEvent = event['name'];
                        lCode = event['event_code'];
                    }
                }
    
                this.tba.TeamEventStatus(b, new Date().getFullYear() + lCode, (err, status) => {
                    if(err) { console.log(err); return; }
    
                    var report = status['overall_status_str'];
                    report = report.replace(/<\/?b>/g, '**');
    
                    message.channel.send('At ' + lEvent + ', ' + report);
                });
            });
        });
    }};}
}

module.exports = initTBABot;