var express = require('express');
var app = express();

var Discord = require('discord.js')
var client = new Discord.Client();

var modules = require('./modules');

var events = new Map();
for (var module in modules.modules()) {
  if (!events.has(module[0])) {
    events.set(module[0], []);
  }
  events.get(module[0]).concat(module[1]);
}

client.on('channelCreate',                  function(channel) {                 console.log('channelCreate', channel);                                  if (events.has('channelCreate')) {                  for (var callback in events.get('channelCreate')) {                 callback(channel);                  }}});
client.on('channelDelete',                  function(channel) {                 console.log('channelDelete', channel);                                  if (events.has('channelDelete')) {                  for (var callback in events.get('channelDelete')) {                 callback(channel);                  }}});
client.on('channelPinsUpdate',              function(channel, time) {           console.log('channelPinsUpdate', channel, time);                        if (events.has('channelPinsUpdate')) {              for (var callback in events.get('channelPinsUpdate')) {             callback(channel, time);            }}});
client.on('channelUpdate',                  function(oldChannel, newChannel) {  console.log('channelUpdate', oldChannel, newChannel);                   if (events.has('channelUpdate')) {                  for (var callback in events.get('channelUpdate')) {                 callback(oldChannel, newChannel);   }}});
client.on('clientUserGuildSettingsUpdate',  function(clientUserGuildSettings) { console.log('clientUserGuildSettingsUpdate', clientUserGuildSettings);  if (events.has('clientUserGuildSettingsUpdate')) {  for (var callback in events.get('clientUserGuildSettingsUpdate')) { callback(clientUserGuildSettings);  }}});
client.on('clientUserSettingsUpdate',       function(clientUserSettings) {      console.log('clientUserSettingsUpdate', clientUserSettings);            if (events.has('clientUserSettingsUpdate')) {       for (var callback in events.get('clientUserSettingsUpdate')) {      callback(clientUserSettings);       }}});
client.on('debug',                          function(info) {                    console.log('debug', info);                                             if (events.has('debug')) {                          for (var callback in events.get('debug')) {                         callback(info);                     }}});
client.on('disconnect',                     function(event) {                   console.log('disconnect', event);                                       if (events.has('disconnect')) {                     for (var callback in events.get('disconnect')) {                    callback(event);                    }}});
client.on('emojiCreate',                    function(emoji) {                   console.log('emojiCreate', emoji);                                      if (events.has('emojiCreate')) {                    for (var callback in events.get('emojiCreate')) {                   callback(emoji);                    }}});
client.on('emojiDelete',                    function(emoji) {                   console.log('emojiDelete', emoji);                                      if (events.has('emojiDelete')) {                    for (var callback in events.get('emojiDelete')) {                   callback(emoji);                    }}});
client.on('emojiUpdate',                    function(oldEmoji, newEmoji) {      console.log('emojiUpdate', oldEmoji, newEmoji);                         if (events.has('emojiUpdate')) {                    for (var callback in events.get('emojiUpdate')) {                   callback(oldEmoji, newEmoji);       }}});
client.on('error',                          function(error) {                   console.log('error', error);                                            if (events.has('error')) {                          for (var callback in events.get('error')) {                         callback(error);                    }}});
client.on('guildBanAdd',                    function(guild, user) {             console.log('guildBanAdd', guild, user);                                if (events.has('guildBanAdd')) {                    for (var callback in events.get('guildBanAdd')) {                   callback(guild, user);              }}});
client.on('guildBanRemove',                 function(guild, user) {             console.log('guildBanRemove', guild, user);                             if (events.has('guildBanRemove')) {                 for (var callback in events.get('guildBanRemove')) {                callback(guild, user);              }}});
client.on('guildCreate',                    function(guild) {                   console.log('guildCreate', guild);                                      if (events.has('guildCreate')) {                    for (var callback in events.get('guildCreate')) {                   callback(guild);                    }}});
client.on('guildDelete',                    function(guild) {                   console.log('guildDelete', guild);                                      if (events.has('guildDelete')) {                    for (var callback in events.get('guildDelete')) {                   callback(guild);                    }}});
client.on('guildMemberAdd',                 function(member) {                  console.log('guildMemberAdd', member);                                  if (events.has('guildMemberAdd')) {                 for (var callback in events.get('guildMemberAdd')) {                callback(member);                   }}});
client.on('guildMemberAvailable',           function(member) {                  console.log('guildMemberAvailable', member);                            if (events.has('guildMemberAvailable')) {           for (var callback in events.get('guildMemberAvailable')) {          callback(member);                   }}});
client.on('guildMemberRemove',              function(member) {                  console.log('guildMemberRemove', member);                               if (events.has('guildMemberRemove')) {              for (var callback in events.get('guildMemberRemove')) {             callback(member);                   }}});
client.on('guildMembersChunk',              function(members, guild) {          console.log('guildMembersChunk', members, guild);                       if (events.has('guildMembersChunk')) {              for (var callback in events.get('guildMembersChunk')) {             callback(members, guild);           }}});
client.on('guildMemberSpeaking',            function(member, speaking) {        console.log('guildMemberSpeaking', member, speaking);                   if (events.has('guildMemberSpeaking')) {            for (var callback in events.get('guildMemberSpeaking')) {           callback(member, speaking);         }}});
client.on('guildMemberUpdate',              function(oldMember, newMember) {    console.log('guildMemberUpdate', oldMember, newMember);                 if (events.has('guildMemberUpdate')) {              for (var callback in events.get('guildMemberUpdate')) {             callback(oldMember, newMember);     }}});
client.on('guildUnavailable',               function(guild) {                   console.log('guildUnavailable', guild);                                 if (events.has('guildUnavailable')) {               for (var callback in events.get('guildUnavailable')) {              callback(guild);                    }}});
client.on('guildUpdate',                    function(oldGuild, newGuild) {      console.log('guildUpdate', oldGuild, newGuild);                         if (events.has('guildUpdate')) {                    for (var callback in events.get('guildUpdate')) {                   callback(oldGuild, newGuild);       }}});
client.on('message',                        function(message) {                 console.log('message', message);                                        if (events.has('message')) {                        for (var callback in events.get('message')) {                       callback(message);                  }}});
client.on('messageDelete',                  function(message) {                 console.log('messageDelete', message);                                  if (events.has('messageDelete')) {                  for (var callback in events.get('messageDelete')) {                 callback(message);                  }}});
client.on('messageDeleteBulk',              function(messages) {                console.log('messageDeleteBulk', messages);                             if (events.has('messageDeleteBulk')) {              for (var callback in events.get('messageDeleteBulk')) {             callback(messages);                 }}});
client.on('messageReactionAdd',             function(messageReaction, user) {   console.log('messageReactionAdd', messageReaction, user);               if (events.has('messageReactionAdd')) {             for (var callback in events.get('messageReactionAdd')) {            callback(messageReaction, user);    }}});
client.on('messageReactionRemove',          function(messageReaction, user) {   console.log('messageReactionRemove', messageReaction, user);            if (events.has('messageReactionRemove')) {          for (var callback in events.get('messageReactionRemove')) {         callback(messageReaction, user);    }}});
client.on('messageReactionRemoveAll',       function(message) {                 console.log('messageReactionRemoveAll', message);                       if (events.has('messageReactionRemoveAll')) {       for (var callback in events.get('messageReactionRemoveAll')) {      callback(message);                  }}});
client.on('messageUpdate',                  function(oldMessage, newMessage) {  console.log('messageUpdate', oldMessage, newMessage);                   if (events.has('messageUpdate')) {                  for (var callback in events.get('messageUpdate')) {                 callback(oldMessage, newMessage);   }}});
client.on('presenceUpdate',                 function(oldMember, newMember) {    console.log('presenceUpdate', oldMember, newMember);                    if (events.has('presenceUpdate')) {                 for (var callback in events.get('presenceUpdate')) {                callback(oldMember, newMember);     }}});
client.on('ready',                          function() {                        console.log('ready');                                                   if (events.has('ready')) {                          for (var callback in events.get('ready')) {                         callback();                         }}});
client.on('reconnecting',                   function() {                        console.log('reconnecting');                                            if (events.has('reconnecting')) {                   for (var callback in events.get('reconnecting')) {                  callback();                         }}});
client.on('resume',                         function(replayed) {                console.log('resume', replayed);                                        if (events.has('resume')) {                         for (var callback in events.get('resume')) {                        callback(replayed);                 }}});
client.on('roleCreate',                     function(role) {                    console.log('roleCreate', role);                                        if (events.has('roleCreate')) {                     for (var callback in events.get('roleCreate')) {                    callback(role);                     }}});
client.on('roleDelete',                     function(role) {                    console.log('roleDelete', role);                                        if (events.has('roleDelete')) {                     for (var callback in events.get('roleDelete')) {                    callback(role);                     }}});
client.on('roleUpdate',                     function(oldRole, newRole) {        console.log('roleUpdate', oldRole, newRole);                            if (events.has('roleUpdate')) {                     for (var callback in events.get('roleUpdate')) {                    callback(oldRole, newRole);         }}});
client.on('typingStart',                    function(channel, user) {           console.log('typingStart', channel, user);                              if (events.has('typingStart')) {                    for (var callback in events.get('typingStart')) {                   callback(channel, user);            }}});
client.on('typingStop',                     function(channel, user) {           console.log('typingStop', channel, user);                               if (events.has('typingStop')) {                     for (var callback in events.get('typingStop')) {                    callback(channel, user);            }}});
client.on('userNoteUpdate',                 function(user, oldNote, newNote) {  console.log('userNoteUpdate', user, oldNote, newNote);                  if (events.has('userNoteUpdate')) {                 for (var callback in events.get('userNoteUpdate')) {                callback(user, oldNote, newNote);   }}});
client.on('userUpdate',                     function(oldUser, newUser) {        console.log('userUpdate', oldUser, newUser);                            if (events.has('userUpdate')) {                     for (var callback in events.get('userUpdate')) {                    callback(oldUser, newUser);         }}});
client.on('voiceStateUpdate',               function(oldMember, newMember) {    console.log('voiceStateUpdate', oldMember, newMember);                  if (events.has('voiceStateUpdate')) {               for (var callback in events.get('voiceStateUpdate')) {              callback(oldMember, newMember);     }}});
client.on('warn',                           function(info) {                    console.log('warn', info);                                              if (events.has('warn')) {                           for (var callback in events.get('warn')) {                          callback(info);                     }}});

client.login('Bot ' + process.env.TOKEN || '');


app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  response.send("Hello World!");
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

