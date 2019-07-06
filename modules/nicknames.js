const AbstractModule = require('./AbstractModule');
const { Permissions } = require('discord.js');

const nickExists = 'SELECT * FROM nick WHERE guild_id = $1 AND user_id = $2;';
const createNick = 'INSERT INTO nick (guild_id, user_id, team, name) VALUES ($1, $2, $3, $4);';
const getNick = 'SELECT team, name, rest FROM nick WHERE guild_id = $1 AND user_id = $2';
const updateNick = 'UPDATE nick SET team = $3, name = $4 WHERE guild_id = $1 AND user_id = $2;';
const updateRest = 'UPDATE nick SET rest = $3 WHERE guild_id = $1 AND user_id = $2;';

class Nicknames extends AbstractModule {
  updateNick(guild, user, reason) {
    this.pgClient.query(getNick, [guild, user]).then(res => {
      var row = res.rows[0];
      console.log(row);
      var nick = '[' + row.team + '] ' + row.name;
      if (row.rest) {
        nick += ' | ' + row.rest;
      }

      nick = nick.substr(0, 32);

      return this.dClient.guilds
        .resolve(guild)
        .members.fetch(user)
        .then(user => user.setNickname(nick, reason));
    }).catch(console.log);
  }

  getEvents() {
    return [
      {
        'key': 'message',
        'callback': message => {
          console.log(message.content);
          var author = message.guild.members.get(message.author.id);
          if (author.permissions.bitfield & Permissions.FLAGS.ADMINISTRATOR == 0) {
            return;
          }
          var r = /^!nick <@!?(\d+)> (\w+) (.+)$/i.exec(message.content);
          if (!r) {
            return;
          }
          var guild = message.guild.id;
          var user = r[1];
          var team = r[2];
          var name = r[3];

          this.pgClient.query(nickExists, [guild, user])
            .then(res => {
              var query = createNick;
              if (res.rows.length > 0) {
                query = updateNick;
              }

              return this.pgClient.query(query, [guild, user, team, name]);
            })
            .then(_ => this.updateNick(guild, user, "!nick <@" + user + "> " + team + " " + name))
            .catch(console.log);
        }
      },
      {
        'key': 'message',
        'callback': message => {
          var r = /^!nick ([^<].+)$/i.exec(message.content);
          if (!r) {
            return;
          }
          var guild = message.guild.id;
          var user = message.author.id;
          var rest = r[1];

          this.pgClient.query(nickExists, [user])
            .then(res => {
              if (res.rows.length == 1) {
                return this.pgClient.query(updateRest, [user, rest]);
              }
            }).then(_ => this.updateNick(guild, user, "!nick " + rest))
            .catch(console.log);
        }
      },
    ];
  }
}

module.exports = Nicknames;