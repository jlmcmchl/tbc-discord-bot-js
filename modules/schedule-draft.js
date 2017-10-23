const AbstractModule = require('./AbstractModule');
const {Client} = require('pg');
const {Permissions} = require('discord.js');
const later = require('later');
const async = require('async');

var draft = /Name: ([[\w \(\)]+)\s*Teams: ([^\n]+)\s*Rounds: (\d+)\s*Date: ([^\n]+)/im;
var insertDraft = 'INSERT INTO Drafts (Name, Teams, Rounds, Date, Guild, oChannel, Msg, Drafter) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING Draft_Key;';
var selectDrafts = 'SELECT Draft_Key, Name, Teams, Rounds, Date, Guild, oChannel, Msg FROM Drafts WHERE COALESCE(Channel, \'\') = \'\' AND Date BETWEEN $1 AND $2;';
var selectDraftsKey = 'SELECT Name, Teams, Rounds, Date FROM Drafts WHERE Draft_Key = $1';
var setDraftChannel = 'UPDATE Drafts SET Channel = $1, Role = $2 WHERE Draft_Key = $3;';
var updateDraft = 'UPDATE Drafts SET Name = $1, Teams = $2, Rounds = $3, Date = $4 WHERE Draft_Key = $5 RETURNING Draft_Key;';
var userDrafts = 'SELECT Guild, oChannel, Msg, Draft_Key FROM Drafts WHERE Drafter = $1 AND COALESCE(Channel, \'\') = \'\';';

class DraftScheduler extends AbstractModule {
  constructor() {
    super();
    this.pgClient = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: true,
    });
    this.pgClient.connect();

    var sched = later.parse.recur().on(12).hour();
    this.job = later.setInterval(this.updateDrafts, sched);
  }

  updateDrafts() {
    var today;
    var tomorrow;
    today = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    this.pgClient.query(selectDrafts, [today, tomorrow], (err, res) => {
      if (err) {
        console.log(err, res); return;
      }

      res.rows.reduce((acc, row) => {
        var chName = `draft-${row.name.replace(/\s+/g, '-')}`;
        var roleId;

        this.dClient.guilds.get(row.guild)
          .channels.get(row.ochannel)
          .messages.fetch(row.msg)
          .then(msg => {
            var ready = false;

            msg.guild.createRole({
              'data': {
                'name': `${row.name} Drafters`,
                'color': Math.floor(Math.random() * 256 * 256 * 256),
                'hoist': false,
                'position': 1,
                'permissions': 0,
                'mentionable': true
              },
              'reason': `People drafting ${row.name}`
            })
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
                        msg.guild.createChannel(chName, 'text', {
                          'nsfw': false,
                          'parent': msg.channel.parent.id,
                          'reason': `Drafting channel for ${row.name}`
                        })
                          .then(ch => {
                            ch.send(`Hello <@!${role.id}>! This channel has been setup to draft ${row.name} today at ${row.date.toTimeString()}.
Teams competing can be found at the following link: ${row.teams}
Here are the drafters:
${results.join('\n')}`);
                            console.log(row.draft_key);
                            this.pgClient.query(setDraftChannel, [ch.id, role.id, row.draft_key]);
                          });
                      });
                  });
              });
          });
      }, 0);
    });
  }

  saveDraft(msg, draft_key, cb) {
    var r = draft.exec(msg.content);
    if (!r) {
      return false;
    }

    var name;
    var teams;
    var rounds;
    var date;
    var msgId;
    var chId;
    var guildId;
    var drafter;
    name = r[1];
    teams = r[2];
    rounds = parseInt(r[3]);
    date = new Date(new Date().getFullYear() + " " + r[4]);
    guildId = msg.channel.guild.id;
    chId = msg.channel.id;
    msgId = msg.id;
    drafter = msg.author.id;

    if (date.getHours() < 12) {
      date.setHours(date.getHours() + 12);
    }

    var query;
    var values;

    if (draft_key) {
      query = updateDraft;
      values = [name, teams, rounds, date, draft_key];
    } else {
      query = insertDraft;
      values = [name, teams, rounds, date, guildId, chId, msgId, drafter];
    }

    async.parallel(
      [callback => this.pgClient.query(query, values, (err, res) => {
        callback(err, res);
      })],
      (err, res) => {
        if (err) {
          console.log(err);
          return;
        }
        cb(res[0].rows[0].draft_key);
      });
  }

  getEvents() {
    return [
      {
        'key': 'message',
        'callback': message => {
          this.saveDraft(message, null, (key) => {
            this.pgClient.query(selectDraftsKey, [key], (err, res) => {
              message.channel.send(`Hey ${message.author.username}, I have you setup to run **${res.rows[0].name}** on **${res.rows[0].date}**.
It will be **${res.rows[0].rounds} rounds** of these teams: ${res.rows[0].teams}
I'll setup your channel and roles the day of.`);
            });
          });
        }
      },
      {
        'key': 'message',
        'callback': message => {
          var r = /^!updateMyDrafts$/i.exec(message.content);
          if (!r) {
            return;
          }

          this.pgClient.query(userDrafts, [message.author.id], (err, res) => {
            if (err) {
              console.log(err, res);
            }

            var msgs = res.rows.map(row => callback => {
              this.dClient.guilds.get(row.guild).channels.get(row.ochannel).messages.fetch(row.msg).then(msg => callback(null, {'key':row.draft_key, 'message':msg}));
            });

            async.parallel(
              msgs,
              (err, drafts) => drafts.map(draft => {
                this.saveDraft(draft.message, draft.key, (key) => {
                  this.pgClient.query(selectDraftsKey, [key], (err, res) => {
                    message.channel.send(`Hey ${message.author.username}, I've updated you draft of **${res.rows[0].name}** on **${res.rows[0].date}**.
It will be **${res.rows[0].rounds} rounds** of these teams: ${res.rows[0].teams}`);
                  });
                });
              }));
          });
        }
      }];
  }

  getEndpoints() {
    return {
      '/getDrafts': (request, response) => {
        while (!this.dClient.readyAt) {
          ;
        }
        this.updateDrafts(); response.send('Checking if there\'s drafts to make...');
      }
    };
  }
}

module.exports = DraftScheduler;