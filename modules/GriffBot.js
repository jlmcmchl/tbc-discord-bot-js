const AbstractModule = require('./AbstractModule');

class GriffBot extends AbstractModule {
  getEvents() {
    return [
      {
        'key': 'message',
        'callback': message => {
          if (!this.isGriff(message.author)) {
            return;
          }
          this.archiveEvent('message', message);
        }
      },
      {
        'key': 'messageDelete',
        'callback': message => {
          if (!this.isGriff(message.author)) {
            return;
          }
          this.archiveEvent('messageDelete', message);
        }
      },
      {
        'key': 'messageDeleteBulk',
        'callback': messages => {
          messages.map(message => {
            if (!this.isGriff(message.author)) {
              return;
            }
            this.archiveEvent('messagesDeleteBulk', message);
          });
        }
      },
      {
        'key': 'messageUpdate',
        'callback': (oldMessage, newMessage) => {
          if (!this.isGriff(oldMessage.author)) {
            return;
          }
          this.archiveEvent('messageUpdate', newMessage);
        }
      }];
  }

  isGriff(obj) {
    return obj.id == process.env.GRIFF_ID || obj.id == process.env.JOE_ID;
  }

  archiveEvent(event, message) {
    var content = {
      event: event,
      message: {
        guild: {
          id: message.member.guild.id,
          name: message.member.guild.name
        },
        channel: {
          id: message.channel.id,
          name: message.channel.name
        },
        author: {
          id: message.author.id,
          name: message.author.username
        },
        id: message.id,
        type: message.type,
        time: message.editedTimestamp || message.createdTimestamp,
        content: message.content
      }
    };

    this.esClient.index({
      index: 'griffin',
      type: 'message',
      body: content
    }, (err, res) => console.log(err, res));
  }

  //TODO implement search on es index
  getEndpoints() {
    return {
      '/gSearch': (request, response) => response.send("Hello World!"),
    };
  }
}

module.exports = GriffBot;