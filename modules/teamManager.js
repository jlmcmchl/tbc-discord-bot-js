const AbstractModule = require('./AbstractModule');
const { Permissions } = require("discord.js");

class TeamManager extends AbstractModule {
  getTeam(user) {
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

  async saveRoster(team) {
    this.esClient.update({
      id: team._id,
      index: team._index,
      type: team._type,
      body: {
        script: {
          source: "ctx._source.members = params.members",
          params: {
            members: team._source.members
          }
        }
      }
    });
  }

  async saveShort(team) {
    this.esClient.update({
      id: team._id,
      index: team._index,
      type: team._type,
      body: {
        script: {
          source: "ctx._source.short = params.short",
          params: {
            short: team._source.short
          }
        }
      }
    });
  }

  async getNick(user) {
    return this.esClient.get({
      id: guild + user,
      index: 'nick'
    });
  }

  iif(condition, i_t, i_f) {
    if (condition) {
      return i_t;
    }

    return i_f;
  }

  updateName(guild, user, team, reason) {
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

          // If they have the team manager role or is an admin
          var author = message.guild.members.get(message.author.id);
          if (!author.roles.get("597081217522728961")) {
            return;
          }

          var r = /^!teamAdd <@!?(\d+)>$/i.exec(message.content);
          if (!r) {
            return;
          }

          var user = r[1];

          var team = this.getTeam(message.author.id);

          if (team == null) {
            message.channel.send("I could not determine what team you are on. DM the modmail bot and the admins will investigate.");

            return;
          }

          team._source.members.push(user);

          this.saveRoster(team);

          var member = message.guild.members.get(user);
          member.roles.add(team._id);

          this.updateName(message.guild.id, user, team, `!teamAdd <@${user}>`);
        }
      },
      {
        'key': 'message',
        'callback': message => {
          // only guild messages
          if (!message.guild) {
            return;
          }

          // If they have the team manager role or is an admin
          var author = message.guild.members.get(message.author.id);
          if (!author.roles.get("597081217522728961")) {
            return;
          }

          var r = /^!teamRemove <@!?(\d+)>$/i.exec(message.content);
          if (!r) {
            return;
          }

          var user = r[1];

          var team = this.getTeam(message.author.id);

          if (team == null) {
            message.channel.send("I could not determine what team you are on. DM the modmail bot and the admins will investigate.");

            return;
          }

          team._source.members = team._source.members.filter(member => member != user);

          this.saveRoster(team);

          var member = message.guild.members.get(user);
          member.roles.add(team._id);

          this.updateName(message.guild.id, user, null, `!teamRemove <@${user}>`);
        }
      },
      {
        'key': 'message',
        'callback': message => {
          // only guild messages
          if (!message.guild) {
            return;
          }

          // If they have the team manager role or is an admin
          var author = message.guild.members.get(message.author.id);
          if (!author.roles.get("597081217522728961")) {
            message.channel.send("You do not appear to have the Team Manager role. If this is incorrect or done in error, please DM the modmail bot.");

            return;
          }

          var r = /^!setColor ([a-fA-F0-9]{6})$/i.exec(message.content);
          if (!r) {
            return;
          }

          var color = parseInt(r[1], 16);

          var team = this.getTeam(message.author.id);

          if (team == null) {
            message.channel.send("I could not determine what team you are on. DM the modmail bot and the admins will investigate.");

            return;
          }

          message.guild.roles.get(team._id).color = color;
        }
      },
      {
        'key': 'message',
        'callback': message => {
          // only guild messages
          if (!message.guild) {
            return;
          }

          // If they have the team manager role or is an admin
          var author = message.guild.members.get(message.author.id);
          if (!author.roles.get("597081217522728961")) {
            message.channel.send("You do not appear to have the Team Manager role. If this is incorrect or done in error, please DM the modmail bot.");

            return;
          }

          var r = /^!setShort (\w{2,5})$/i.exec(message.content);
          if (!r) {
            return;
          }

          var short = r[1];

          var team = this.getTeam(message.author.id);

          if (team == null) {
            message.channel.send("I could not determine what team you are on. DM the modmail bot and the admins will investigate.");

            return;
          }

          team._source.short = short;

          this.saveShort(team);

          team._source.members.foreach(member => this.updateName(message.guild.id, member, team, `!setShort ${short}`));
        }
      },
    ];
  }
}

module.exports = TeamManager;