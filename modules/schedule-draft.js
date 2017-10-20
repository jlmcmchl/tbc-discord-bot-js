const AbstractModule = require('./AbstractModule');
const { Client } = require('pg');
const { Permissions } = require('discord.js');
const later = require('later');
const async = require('async');

var draft = /Name: (\w+)\s*Teams: ([-a-zA-Z0-9@:%._\/\+~#=]{2,256}\.[a-z]{2,6}\b[-a-zA-Z0-9@:%_\+.~#?&//=]*)\s*Rounds: (\d+)\s*Date: (\d\d\/\d\d@\d\d:\d\d)/im;
var insertDraft = 'INSERT INTO Drafts (Name, Teams, Rounds, Date, Guild, oChannel, Msg) VALUES ($1, $2, $3, $4, $5, $6, $7);';
var selectDrafts = 'SELECT Draft_Key, Name, Teams, Rounds, Date, Guild, oChannel, Msg FROM Drafts WHERE COALESCE(Channel, \'\') = \'\' AND Date BETWEEN $1 AND $2;';
var updateDraft = 'UPDATE Drafts SET Channel = $1, Role = $2 WHERE Draft_Key = $3;';

class DraftScheduler extends AbstractModule  {
    constructor() {
        super();
        this.pgClient = new Client( {
            connectionString: process.env.DATABASE_URL,
            ssl: true,
        });
        this.pgClient.connect();
        
        var sched = later.parse.recur().on(12).hour();
        this.job = later.setInterval(this.updateDrafts, sched);
    }

    updateDrafts() {
        var today, tomorrow;
        today = new Date();
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        this.pgClient.query(selectDrafts, [today, tomorrow], (err, res) => {
            if(err) { console.log(err, res); return; }
            
            res.rows.reduce((acc, row) => {
                var chName = `draft-${row.name.replace(/\s+/g,'-')}`;
                var roleId;
                
                this.dClient.guilds.get(row.guild)
                    .channels.get(row.ochannel)
                    .messages.fetch(row.msg)
                    .then(msg => {
                        var ready = false;

                        msg.guild.createRole({
                            'data': {
                                'name': `${row.name} Drafters`,
                                'color': Math.floor(Math.random()*256*256*256),
                                'hoist': false,
                                'position':1,
                                'permissions': 0,
                                'mentionable': true
                            },  
                            'reason': `People drafting ${row.name}`})
                            .then(role => {

                                async.parallel(
                                    msg.reactions.map((acc, key, rxns) => {
                                        return (callback) => {
                                            rxns.get(key).fetchUsers().then(users => callback(null, users.array()));
                                        }; 
                                    }), 
                                    (err, results) => {
                                        var drafters = results.reduce((acc, users) => {
                                            users.reduce((l, user) => { 
                                                l.push(user); 
                                                return l;
                                            }, acc);

                                            return acc;
                                        }, []);

                                        async.parallel(
                                            drafters.map(drafter => callback => {
                                                msg.guild.member(drafter).addRole(role, `You're drafting ${row.name}`);
                                                callback(null, drafter.username);
                                            }), 
                                            (err, results) => {
                                                msg.guild.createChannel(chName, 'text', { 'nsfw': false, 'parent': msg.channel.parent.id, 'reason': `Drafting channel for ${row.name}` })
                                                    .then(ch => {
                                                        ch.send(`Hello <@!${role.id}>! This channel has been setup to draft ${row.name} today at ${row.date.toTimeString()}.\nTeams competing can be found at the following link: ${row.teams}\nHere are the drafters:\n${results.join('\n')}`);
                                                        console.log(row.draft_key);
                                                        this.pgClient.query(updateDraft, [ch.id, role.id, row.draft_key]);
                                                    });
                                            });
                                    });
                            });
                    });
            }, 0);
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
            userId = message.author.id;

            var values = [name, teams, rounds, date, guildId, chId, msgId];
            this.pgClient.query(insertDraft, values, (err, res) => {
                if (err) console.log(err, res);
            });
        }};
    }

    getEndpoints() { return {
        '/getDrafts': (request, response) => { while(!this.dClient.readyAt); this.updateDrafts(); response.send('Checking if there\'s drafts to make...'); }
    }; }
}

module.exports = DraftScheduler;