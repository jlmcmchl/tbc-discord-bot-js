const AbstractModule = require('./AbstractModule');
const { Permissions } = require('discord.js');

const nickExists = 'SELECT * FROM nick WHERE guild_id = $1 AND user_id = $2;';
const createNick = 'INSERT INTO nick (guild_id, user_id, team, name) VALUES ($1, $2, $3, $4);';
const getNick = 'SELECT team, name, rest FROM nick WHERE guild_id = $1 AND user_id = $2';
const updateNick = 'UPDATE nick SET team = $3, name = $4 WHERE guild_id = $1 AND user_id = $2;';
const updateRest = 'UPDATE nick SET rest = $3 WHERE guild_id = $1 AND user_id = $2;';

class Nicknames extends AbstractModule {
  async getNick(guild, user) {
    return this.esClient.get({
      id: guild + user,
      index: 'nick'
    });
  }
  putNick(guild, user, nick) {
    return this.esClient.index({
      id: guild + user,
      index: 'nick',
      body: nick
    });
  }
  async updateNick(guild, user, reason) {
    var nick_result = await this.getNick(guild, user);

    var nick_source = nick_result.body._source;

    var nick = '[' + nick_source.team + '] ' + nick_source.name;
    if (nick_source.rest) {
      nick += ' | ' + nick_source.rest;
    }

    nick = nick.substr(0, 32);

    return this.dClient.guilds
      .resolve(guild)
      .members.fetch(user)
      .then(user => user.setNickname(nick, reason));
  }

  getEvents() {
    return [
      {
        'key': 'message',
        'callback': message => {
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

          this.putNick(guild, user, { team: team, name: name, rest: null })
            .then(_ => this.updateNick(guild, user, "!nick <@" + user + "> " + team + " " + name))
            .catch(console.error);
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

          this.getNick(guild, user)
            .then(result => {
              var nick_source = result.body._source;
              nick_source.rest = rest;

              return this.putNick(guild, user, nick_source);
            })
            .then(_ => this.updateNick(guild, user, "!nick " + rest))
            .catch(console.error);
        }
      },
    ];
  }
}

module.exports = Nicknames;