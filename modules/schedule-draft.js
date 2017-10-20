const { Client } = require('pg');
var Discordjs = require('discord.js');
var later = require('later');

var draft = /Name: (\w+)\s*Teams: ([-a-zA-Z0-9@:%._\/\+~#=]{2,256}\.[a-z]{2,6}\b[-a-zA-Z0-9@:%_\+.~#?&//=]*)\s*Rounds: (\d+)\s*Date: (\d\d\/\d\d@\d\d:\d\d)/im;
var insertDraft = 'INSERT INTO Drafts (Name, Teams, Rounds, Date, Guild, oChannel, Msg) VALUES ($1, $2, $3, $4, $5, $6, $7)';
var selectDrafts = 'SELECT Draft_Key, Name, Teams, Rounds, Date, Guild, oChannel, Msg FROM Drafts WHERE COALESCE(Channel, \'\') = \'\' AND Date BETWEEN $1 AND $2';

class DraftScheduler {
    constructor() {
        this.pgClient = new Client( {
            connectionString: process.env.DATABASE_URL,
            ssl: true,
        });
        this.pgClient.connect();

        this.dcClient = new Discordjs.Client();
        this.dcClient.login('Bot ' + process.env.TOKEN || '');

        var sched = later.parse.recur().every(1).dayOfWeek();
        this.job = later.setInterval(this.updateDrafts, sched);
    }

    updateDrafts() {
        var today, tomorrow;
        today = new Date();
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        this.pgClient.query(selectDrafts, [today, tomorrow], (err, res) => {
            if(err) { console.log(err, res); return; }
            
            for (var i in res.rows) {
                var row = res.rows[i];

                var chName = row.name.replace(/\s/g,'-');
                console.log(this.dcClient.guilds.get(row.guild).channels);

                
            }
            
            
        });
    }

    getEvents() { return {'message': message => {
           var r = draft.exec(message.content);
            if(!r) return;

            var name, teams, rounds, date, msgId, chId, guildId;
            name = r[1];
            teams = r[2];
            rounds = parseInt(r[3]);
            date = new Date(new Date().getFullYear() + " " + r[4]);
            guildId = message.channel.guild.id;
            chId = message.channel.id;
            msgId = message.id;

            var values = [name, teams, rounds, date, guildId, chId, msgId];
            this.pgClient.query(insertDraft, values, (err, res) => {
                if (err) console.log(err, res);
            });
        }};
    }

    getEndpoints() { return {
        '/updateDrafts': (request, response) => { this.updateDrafts(); response.send('Checking if there\'s drafts to make...'); }
    }; }
}

module.exports = DraftScheduler;