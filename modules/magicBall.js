const AbstractModule = require('./AbstractModule');

var responses = [
  'It is certain',
  'It is decidedly so',
  'Without a doubt',
  'Yes definitely',
  'You may rely on it',
  'As I see it, yes',
  'Most likely',
  'Outlook good',
  'Yes',
  'Signs point to yes',
  'Reply hazy try again',
  'Ask again later',
  'Better not tell you now',
  'Cannot predict now',
  'Concentrate and ask again',
  'Don\'t count on it',
  'My reply is no',
  'My sources say no',
  'Outlook not so good',
  'Very doubtful'
];

class MagicBall extends AbstractModule {
  getEvents() {
    return [
      {
        'key': 'message',
        'callback': message => {
          if (!/!8Ball/i.test(message.content)) return;

          var choice = Math.floor(Math.random() * responses.length);
          var resp = 'Magic 8 Ball Says: ' + responses[choice];
          message.channel.send(resp);
        }
      },];
  }
}

module.exports = MagicBall;