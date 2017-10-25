const AbstractModule = require('./AbstractModule');
const {Client} = require('pg');
const {Permissions} = require('discord.js');
const later = require('later');
const async = require('async');

const insertQuote = 'INSERT INTO Quotes (User_ID, Content) Values ($1, $2);';
const getQuote = 'SELECT User_ID, Content FROM Quotes WHERE Quote_ID = $1;';
const countQuotes = 'SELECT Quote_ID FROM Quotes WHERE COALESCE($1, User_ID) = User_ID;';

class Quote extends AbstractModule {
  getEvents() {
    return [
      {
        'key': 'message',
        'callback': message => {
          var r = /!grab/i.exec(message.content)
          if (!r) {
            return;
          }

          message.channel.messages.fetch({
            'limit': 1,
            'before': message.id
          }).then(quotes => {
            quotes.map(quote => {
              var values = [quote.author.id, quote.content];
              //TODO clean quote so people don't get pinged by the quote
              this.pgClient.query(insertQuote, values, (err, res) => message.channel.send(`Quote Saved, <@${message.author.id}>`));
            });
          });
        }
      },
      {
        'key': 'message',
        'callback': message => {
          var r = /^!quote (\d+)$/i.exec(message.content);
          if (!r) {
            return;
          }
          var values = [parseInt(r[1])];

          this.pgClient.query(getQuote, values, (err, res) => {
            res.rows.map(row => message.channel.send(`<@${row.user_id}>: ${row.content}`));
          });
        }
      },
      {
        'key': 'message',
        'callback': message => {
          var r = /^!quote <@(\d+)> (.+)$/im.exec(message.content);
          if (!r) {
            return;
          }

          var values = [r[1], r[2]];
          this.pgClient.query(insertQuote, values, (err, res) => message.channel.send(`Quote Saved, <@${message.author.id}>`));
        }
      },
      {
        'key': 'message',
        'callback': message => {
          var r = /^!quote #$/im.exec(message.content);
          if (!r) {
            return;
          }

          var values = [r[1], r[2]];
          this.pgClient.query(countQuotes, [null], (err, res) => message.channel.send(`Number of Quotes: ${res.rows[0].count}`));
        }
      },
      {
        'key': 'message',
        'callback': message => {
          var r = /^!quote(?: <@(\d+))?>$/i.exec(message.content);
          if (!r) {
            return;
          }
          var values = [parseInt(r[1])];

          this.pgClient.query(countQuotes, [null], (err, res) => {
            var c = Math.floor(Math.random() * res.rowCount)
            var quote_id = res.rows[c].quote_id;
            this.pgClient.query(getQuote, [quote_id], (err, res) => {
              res.rows.map(row => message.channel.send(`<@${row.user_id}>: ${row.content}`));
            });
          });
        }
      },
    ];
  }
}

module.exports = Quote;