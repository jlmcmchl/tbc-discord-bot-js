var express = require('express');
var app = express();

var Discord = require('discord.js');
var dClient = new Discord.Client();

var Pg = require('pg');
pgClient = new Pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
pgClient.connect();

var Elasticsearch = require('elasticsearch');
var esClient = new Elasticsearch.Client({
  host: process.env.BONSAI_URL,
  'apiVersion': '5.4',
});

var Modules = require('./modules');
var classes = new Modules();
var modules = classes.Modules();

var events = new Map();
for (var i in modules) {
  modules[i].setDClient(dClient);
  modules[i].setPGClient(pgClient);
  modules[i].setESClient(esClient);

  moduleEvents = modules[i].getEvents();
  for (var j in moduleEvents) {
    event = moduleEvents[j];
    if (!events.has(event.key)) {
      events = events.set(event.key, []);
    }
    events.set(event.key, events.get(event.key).concat(event.callback));
  }
}

var debug = process.env.DEBUG == true;

dClient.on('channelCreate', function (channel) { if (debug) { console.log('channelCreate', channel); } if (events.has('channelCreate')) { var cbs = events.get('channelCreate'); cbs.map(cb => cb(channel)); } });
dClient.on('channelDelete', function (channel) { if (debug) { console.log('channelDelete', channel); } if (events.has('channelDelete')) { var cbs = events.get('channelDelete'); cbs.map(cb => cb(channel)); } });
dClient.on('channelPinsUpdate', function (channel, time) { if (debug) { console.log('channelPinsUpdate', channel, time); } if (events.has('channelPinsUpdate')) { var cbs = events.get('channelPinsUpdate'); cbs.map(cb => cb(channel, time)); } });
dClient.on('channelUpdate', function (oldChannel, newChannel) { if (debug) { console.log('channelUpdate', oldChannel, newChannel); } if (events.has('channelUpdate')) { var cbs = events.get('channelUpdate'); cbs.map(cb => cb(oldChannel, newChannel)); } });
dClient.on('clientUserGuildSettingsUpdate', function (clientUserGuildSettings) { if (debug) { console.log('clientUserGuildSettingsUpdate', clientUserGuildSettings); } if (events.has('clientUserGuildSettingsUpdate')) { var cbs = events.get('clientUserGuildSettingsUpdate'); cbs.map(cb => cb(clientUserGuildSettings)); } });
dClient.on('clientUserSettingsUpdate', function (clientUserSettings) { if (debug) { console.log('clientUserSettingsUpdate', clientUserSettings); } if (events.has('clientUserSettingsUpdate')) { var cbs = events.get('clientUserSettingsUpdate'); cbs.map(cb => cb(clientUserSettings)); } });
dClient.on('debug', function (info) { if (debug) { console.log('debug', info); } if (events.has('debug')) { var cbs = events.get('debug'); cbs.map(cb => cb(info)); } });
dClient.on('disconnect', function (event) { if (debug) { console.log('disconnect', event); } if (events.has('disconnect')) { var cbs = events.get('disconnect'); cbs.map(cb => cb(event)); } });
dClient.on('emojiCreate', function (emoji) { if (debug) { console.log('emojiCreate', emoji); } if (events.has('emojiCreate')) { var cbs = events.get('emojiCreate'); cbs.map(cb => cb(emoji)); } });
dClient.on('emojiDelete', function (emoji) { if (debug) { console.log('emojiDelete', emoji); } if (events.has('emojiDelete')) { var cbs = events.get('emojiDelete'); cbs.map(cb => cb(emoji)); } });
dClient.on('emojiUpdate', function (oldEmoji, newEmoji) { if (debug) { console.log('emojiUpdate', oldEmoji, newEmoji); } if (events.has('emojiUpdate')) { var cbs = events.get('emojiUpdate'); cbs.map(cb => cb(oldEmoji, newEmoji)); } });
dClient.on('error', function (error) { if (debug) { console.log('error', error); } if (events.has('error')) { var cbs = events.get('error'); cbs.map(cb => cb(error)); } });
dClient.on('guildBanAdd', function (guild, user) { if (debug) { console.log('guildBanAdd', guild, user); } if (events.has('guildBanAdd')) { var cbs = events.get('guildBanAdd'); cbs.map(cb => cb(guild, user)); } });
dClient.on('guildBanRemove', function (guild, user) { if (debug) { console.log('guildBanRemove', guild, user); } if (events.has('guildBanRemove')) { var cbs = events.get('guildBanRemove'); cbs.map(cb => cb(guild, user)); } });
dClient.on('guildCreate', function (guild) { if (debug) { console.log('guildCreate', guild); } if (events.has('guildCreate')) { var cbs = events.get('guildCreate'); cbs.map(cb => cb(guild)); } });
dClient.on('guildDelete', function (guild) { if (debug) { console.log('guildDelete', guild); } if (events.has('guildDelete')) { var cbs = events.get('guildDelete'); cbs.map(cb => cb(guild)); } });
dClient.on('guildMemberAdd', function (member) { if (debug) { console.log('guildMemberAdd', member); } if (events.has('guildMemberAdd')) { var cbs = events.get('guildMemberAdd'); cbs.map(cb => cb(member)); } });
dClient.on('guildMemberAvailable', function (member) { if (debug) { console.log('guildMemberAvailable', member); } if (events.has('guildMemberAvailable')) { var cbs = events.get('guildMemberAvailable'); cbs.map(cb => cb(member)); } });
dClient.on('guildMemberRemove', function (member) { if (debug) { console.log('guildMemberRemove', member); } if (events.has('guildMemberRemove')) { var cbs = events.get('guildMemberRemove'); cbs.map(cb => cb(member)); } });
dClient.on('guildMembersChunk', function (members, guild) { if (debug) { console.log('guildMembersChunk', members, guild); } if (events.has('guildMembersChunk')) { var cbs = events.get('guildMembersChunk'); cbs.map(cb => cb(members, guild)); } });
dClient.on('guildMemberSpeaking', function (member, speaking) { if (debug) { console.log('guildMemberSpeaking', member, speaking); } if (events.has('guildMemberSpeaking')) { var cbs = events.get('guildMemberSpeaking'); cbs.map(cb => cb(member, speaking)); } });
dClient.on('guildMemberUpdate', function (oldMember, newMember) { if (debug) { console.log('guildMemberUpdate', oldMember, newMember); } if (events.has('guildMemberUpdate')) { var cbs = events.get('guildMemberUpdate'); cbs.map(cb => cb(oldMember, newMember)); } });
dClient.on('guildUnavailable', function (guild) { if (debug) { console.log('guildUnavailable', guild); } if (events.has('guildUnavailable')) { var cbs = events.get('guildUnavailable'); cbs.map(cb => cb(guild)); } });
dClient.on('guildUpdate', function (oldGuild, newGuild) { if (debug) { console.log('guildUpdate', oldGuild, newGuild); } if (events.has('guildUpdate')) { var cbs = events.get('guildUpdate'); cbs.map(cb => cb(oldGuild, newGuild)); } });
dClient.on('message', function (message) { if (debug) { console.log('message', message); } if (events.has('message')) { var cbs = events.get('message'); cbs.map(cb => cb(message)); } });
dClient.on('messageDelete', function (message) { if (debug) { console.log('messageDelete', message); } if (events.has('messageDelete')) { var cbs = events.get('messageDelete'); cbs.map(cb => cb(message)); } });
dClient.on('messageDeleteBulk', function (messages) { if (debug) { console.log('messageDeleteBulk', messages); } if (events.has('messageDeleteBulk')) { var cbs = events.get('messageDeleteBulk'); cbs.map(cb => cb(messages)); } });
dClient.on('messageReactionAdd', function (messageReaction, user) { if (debug) { console.log('messageReactionAdd', messageReaction, user); } if (events.has('messageReactionAdd')) { var cbs = events.get('messageReactionAdd'); cbs.map(cb => cb(messageReaction, user)); } });
dClient.on('messageReactionRemove', function (messageReaction, user) { if (debug) { console.log('messageReactionRemove', messageReaction, user); } if (events.has('messageReactionRemove')) { var cbs = events.get('messageReactionRemove'); cbs.map(cb => cb(messageReaction, user)); } });
dClient.on('messageReactionRemoveAll', function (message) { if (debug) { console.log('messageReactionRemoveAll', message); } if (events.has('messageReactionRemoveAll')) { var cbs = events.get('messageReactionRemoveAll'); cbs.map(cb => cb(message)); } });
dClient.on('messageUpdate', function (oldMessage, newMessage) { if (debug) { console.log('messageUpdate', oldMessage, newMessage); } if (events.has('messageUpdate')) { var cbs = events.get('messageUpdate'); cbs.map(cb => cb(oldMessage, newMessage)); } });
dClient.on('presenceUpdate', function (oldMember, newMember) { if (debug) { console.log('presenceUpdate', oldMember, newMember); } if (events.has('presenceUpdate')) { var cbs = events.get('presenceUpdate'); cbs.map(cb => cb(oldMember, newMember)); } });
dClient.on('ready', function () { if (debug) { console.log('ready'); } if (events.has('ready')) { var cbs = events.get('ready'); cbs.map(cb => cb()); } });
dClient.on('reconnecting', function () { if (debug) { console.log('reconnecting'); } if (events.has('reconnecting')) { var cbs = events.get('reconnecting'); cbs.map(cb => cb()); } });
dClient.on('resume', function (replayed) { if (debug) { console.log('resume', replayed); } if (events.has('resume')) { var cbs = events.get('resume'); cbs.map(cb => cb(replayed)); } });
dClient.on('roleCreate', function (role) { if (debug) { console.log('roleCreate', role); } if (events.has('roleCreate')) { var cbs = events.get('roleCreate'); cbs.map(cb => cb(role)); } });
dClient.on('roleDelete', function (role) { if (debug) { console.log('roleDelete', role); } if (events.has('roleDelete')) { var cbs = events.get('roleDelete'); cbs.map(cb => cb(role)); } });
dClient.on('roleUpdate', function (oldRole, newRole) { if (debug) { console.log('roleUpdate', oldRole, newRole); } if (events.has('roleUpdate')) { var cbs = events.get('roleUpdate'); cbs.map(cb => cb(oldRole, newRole)); } });
dClient.on('typingStart', function (channel, user) { if (debug) { console.log('typingStart', channel, user); } if (events.has('typingStart')) { var cbs = events.get('typingStart'); cbs.map(cb => cb(channel, user)); } });
dClient.on('typingStop', function (channel, user) { if (debug) { console.log('typingStop', channel, user); } if (events.has('typingStop')) { var cbs = events.get('typingStop'); cbs.map(cb => cb(channel, user)); } });
dClient.on('userNoteUpdate', function (user, oldNote, newNote) { if (debug) { console.log('userNoteUpdate', user, oldNote, newNote); } if (events.has('userNoteUpdate')) { var cbs = events.get('userNoteUpdate'); cbs.map(cb => cb(user, oldNote, newNote)); } });
dClient.on('userUpdate', function (oldUser, newUser) { if (debug) { console.log('userUpdate', oldUser, newUser); } if (events.has('userUpdate')) { var cbs = events.get('userUpdate'); cbs.map(cb => cb(oldUser, newUser)); } });
dClient.on('voiceStateUpdate', function (oldMember, newMember) { if (debug) { console.log('voiceStateUpdate', oldMember, newMember); } if (events.has('voiceStateUpdate')) { var cbs = events.get('voiceStateUpdate'); cbs.map(cb => cb(oldMember, newMember)); } });
dClient.on('warn', function (info) { if (debug) { console.log('warn', info); } if (events.has('warn')) { var cbs = events.get('warn'); cbs.map(cb => cb(info)); } });

//dClient.login('Bot ' + process.env.TOKEN || '');


app.set('port', (process.env.PORT || 5000));

for (var i in modules) {
  var module = modules[i].getEndpoints();
  for (var key in module) {
    app.get(key, module[key]);
  }

  module = modules[i].postEndpoints();
  for (var key in module) {
    app.post(key, module[key]);
  }
}

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

