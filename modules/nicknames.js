const AbstractModule = require('./AbstractModule');
const { Permissions } = require('discord.js');


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

  getTeam(guild, user_id) {
    var user = this.dClient.guilds.resolve(guild).members.fetch(user_id);

    const { body } = await this.esClient.search({
      index: 'team',
      body: {
        query: {
          ids: user.roles.map(role => role.id)
        }
      }
    });

    if (body.hits.total.value > 0) {
      return body.hits.hits[0];
    }

    return null;
  }

  async updateNick(guild, user, reason) {
    var team = this.getTeam(guild, user);
    var { body } = await this.getNick(guild, user);

    var nick = `${iif(team == null, "", `[${team._source.short}] `)}${body._source.name}${iif(body._source.rest == "", "", ` | ${body._source.rest}`)}`.substr(0, 32);

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
          // only guild messages
          if (!message.guild) {
            return;
          }
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