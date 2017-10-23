var express = require('express');
var app = express();

var Discord = require('discord.js')
var client = new Discord.Client();

var Modules = require('./modules');
var classes = new Modules();
var modules = classes.Modules();

var events = new Map();
for (var i in modules) {
  modules[i].setClient(client);
  
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

client.on('channelCreate',                  function(channel) {                 if (debug) { console.log('channelCreate', channel); }                                 if (events.has('channelCreate')) {                  var callbacks = events.get('channelCreate');                  for (var i in callbacks) { callbacks[i](channel);                  }}});
client.on('channelDelete',                  function(channel) {                 if (debug) { console.log('channelDelete', channel); }                                 if (events.has('channelDelete')) {                  var callbacks = events.get('channelDelete');                  for (var i in callbacks) { callbacks[i](channel);                  }}});
client.on('channelPinsUpdate',              function(channel, time) {           if (debug) { console.log('channelPinsUpdate', channel, time); }                       if (events.has('channelPinsUpdate')) {              var callbacks = events.get('channelPinsUpdate');              for (var i in callbacks) { callbacks[i](channel, time);            }}});
client.on('channelUpdate',                  function(oldChannel, newChannel) {  if (debug) { console.log('channelUpdate', oldChannel, newChannel); }                  if (events.has('channelUpdate')) {                  var callbacks = events.get('channelUpdate');                  for (var i in callbacks) { callbacks[i](oldChannel, newChannel);   }}});
client.on('clientUserGuildSettingsUpdate',  function(clientUserGuildSettings) { if (debug) { console.log('clientUserGuildSettingsUpdate', clientUserGuildSettings); } if (events.has('clientUserGuildSettingsUpdate')) {  var callbacks = events.get('clientUserGuildSettingsUpdate');  for (var i in callbacks) { callbacks[i](clientUserGuildSettings);  }}});
client.on('clientUserSettingsUpdate',       function(clientUserSettings) {      if (debug) { console.log('clientUserSettingsUpdate', clientUserSettings); }           if (events.has('clientUserSettingsUpdate')) {       var callbacks = events.get('clientUserSettingsUpdate');       for (var i in callbacks) { callbacks[i](clientUserSettings);       }}});
client.on('debug',                          function(info) {                    if (debug) { console.log('debug', info); }                                            if (events.has('debug')) {                          var callbacks = events.get('debug');                          for (var i in callbacks) { callbacks[i](info);                     }}});
client.on('disconnect',                     function(event) {                   if (debug) { console.log('disconnect', event); }                                      if (events.has('disconnect')) {                     var callbacks = events.get('disconnect');                     for (var i in callbacks) { callbacks[i](event);                    }}});
client.on('emojiCreate',                    function(emoji) {                   if (debug) { console.log('emojiCreate', emoji); }                                     if (events.has('emojiCreate')) {                    var callbacks = events.get('emojiCreate');                    for (var i in callbacks) { callbacks[i](emoji);                    }}});
client.on('emojiDelete',                    function(emoji) {                   if (debug) { console.log('emojiDelete', emoji); }                                     if (events.has('emojiDelete')) {                    var callbacks = events.get('emojiDelete');                    for (var i in callbacks) { callbacks[i](emoji);                    }}});
client.on('emojiUpdate',                    function(oldEmoji, newEmoji) {      if (debug) { console.log('emojiUpdate', oldEmoji, newEmoji); }                        if (events.has('emojiUpdate')) {                    var callbacks = events.get('emojiUpdate');                    for (var i in callbacks) { callbacks[i](oldEmoji, newEmoji);       }}});
client.on('error',                          function(error) {                   if (debug) { console.log('error', error); }                                           if (events.has('error')) {                          var callbacks = events.get('error');                          for (var i in callbacks) { callbacks[i](error);                    }}});
client.on('guildBanAdd',                    function(guild, user) {             if (debug) { console.log('guildBanAdd', guild, user); }                               if (events.has('guildBanAdd')) {                    var callbacks = events.get('guildBanAdd');                    for (var i in callbacks) { callbacks[i](guild, user);              }}});
client.on('guildBanRemove',                 function(guild, user) {             if (debug) { console.log('guildBanRemove', guild, user); }                            if (events.has('guildBanRemove')) {                 var callbacks = events.get('guildBanRemove');                 for (var i in callbacks) { callbacks[i](guild, user);              }}});
client.on('guildCreate',                    function(guild) {                   if (debug) { console.log('guildCreate', guild); }                                     if (events.has('guildCreate')) {                    var callbacks = events.get('guildCreate');                    for (var i in callbacks) { callbacks[i](guild);                    }}});
client.on('guildDelete',                    function(guild) {                   if (debug) { console.log('guildDelete', guild); }                                     if (events.has('guildDelete')) {                    var callbacks = events.get('guildDelete');                    for (var i in callbacks) { callbacks[i](guild);                    }}});
client.on('guildMemberAdd',                 function(member) {                  if (debug) { console.log('guildMemberAdd', member); }                                 if (events.has('guildMemberAdd')) {                 var callbacks = events.get('guildMemberAdd');                 for (var i in callbacks) { callbacks[i](member);                   }}});
client.on('guildMemberAvailable',           function(member) {                  if (debug) { console.log('guildMemberAvailable', member); }                           if (events.has('guildMemberAvailable')) {           var callbacks = events.get('guildMemberAvailable');           for (var i in callbacks) { callbacks[i](member);                   }}});
client.on('guildMemberRemove',              function(member) {                  if (debug) { console.log('guildMemberRemove', member); }                              if (events.has('guildMemberRemove')) {              var callbacks = events.get('guildMemberRemove');              for (var i in callbacks) { callbacks[i](member);                   }}});
client.on('guildMembersChunk',              function(members, guild) {          if (debug) { console.log('guildMembersChunk', members, guild); }                      if (events.has('guildMembersChunk')) {              var callbacks = events.get('guildMembersChunk');              for (var i in callbacks) { callbacks[i](members, guild);           }}});
client.on('guildMemberSpeaking',            function(member, speaking) {        if (debug) { console.log('guildMemberSpeaking', member, speaking); }                  if (events.has('guildMemberSpeaking')) {            var callbacks = events.get('guildMemberSpeaking');            for (var i in callbacks) { callbacks[i](member, speaking);         }}});
client.on('guildMemberUpdate',              function(oldMember, newMember) {    if (debug) { console.log('guildMemberUpdate', oldMember, newMember); }                if (events.has('guildMemberUpdate')) {              var callbacks = events.get('guildMemberUpdate');              for (var i in callbacks) { callbacks[i](oldMember, newMember);     }}});
client.on('guildUnavailable',               function(guild) {                   if (debug) { console.log('guildUnavailable', guild); }                                if (events.has('guildUnavailable')) {               var callbacks = events.get('guildUnavailable');               for (var i in callbacks) { callbacks[i](guild);                    }}});
client.on('guildUpdate',                    function(oldGuild, newGuild) {      if (debug) { console.log('guildUpdate', oldGuild, newGuild); }                        if (events.has('guildUpdate')) {                    var callbacks = events.get('guildUpdate');                    for (var i in callbacks) { callbacks[i](oldGuild, newGuild);       }}});
client.on('message',                        function(message) {                 if (debug) { console.log('message', message); }                                       if (events.has('message')) {                        var callbacks = events.get('message');                        for (var i in callbacks) { callbacks[i](message);                  }}});
client.on('messageDelete',                  function(message) {                 if (debug) { console.log('messageDelete', message); }                                 if (events.has('messageDelete')) {                  var callbacks = events.get('messageDelete');                  for (var i in callbacks) { callbacks[i](message);                  }}});
client.on('messageDeleteBulk',              function(messages) {                if (debug) { console.log('messageDeleteBulk', messages); }                            if (events.has('messageDeleteBulk')) {              var callbacks = events.get('messageDeleteBulk');              for (var i in callbacks) { callbacks[i](messages);                 }}});
client.on('messageReactionAdd',             function(messageReaction, user) {   if (debug) { console.log('messageReactionAdd', messageReaction, user); }              if (events.has('messageReactionAdd')) {             var callbacks = events.get('messageReactionAdd');             for (var i in callbacks) { callbacks[i](messageReaction, user);    }}});
client.on('messageReactionRemove',          function(messageReaction, user) {   if (debug) { console.log('messageReactionRemove', messageReaction, user); }           if (events.has('messageReactionRemove')) {          var callbacks = events.get('messageReactionRemove');          for (var i in callbacks) { callbacks[i](messageReaction, user);    }}});
client.on('messageReactionRemoveAll',       function(message) {                 if (debug) { console.log('messageReactionRemoveAll', message); }                      if (events.has('messageReactionRemoveAll')) {       var callbacks = events.get('messageReactionRemoveAll');       for (var i in callbacks) { callbacks[i](message);                  }}});
client.on('messageUpdate',                  function(oldMessage, newMessage) {  if (debug) { console.log('messageUpdate', oldMessage, newMessage); }                  if (events.has('messageUpdate')) {                  var callbacks = events.get('messageUpdate');                  for (var i in callbacks) { callbacks[i](oldMessage, newMessage);   }}});
client.on('presenceUpdate',                 function(oldMember, newMember) {    if (debug) { console.log('presenceUpdate', oldMember, newMember); }                   if (events.has('presenceUpdate')) {                 var callbacks = events.get('presenceUpdate');                 for (var i in callbacks) { callbacks[i](oldMember, newMember);     }}});
client.on('ready',                          function() {                        if (debug) { console.log('ready'); }                                                  if (events.has('ready')) {                          var callbacks = events.get('ready');                          for (var i in callbacks) { callbacks[i]();                         }}});
client.on('reconnecting',                   function() {                        if (debug) { console.log('reconnecting'); }                                           if (events.has('reconnecting')) {                   var callbacks = events.get('reconnecting');                   for (var i in callbacks) { callbacks[i]();                          }}});
client.on('resume',                         function(replayed) {                if (debug) { console.log('resume', replayed); }                                       if (events.has('resume')) {                         var callbacks = events.get('resume');                         for (var i in callbacks) { callbacks[i](replayed);                 }}});
client.on('roleCreate',                     function(role) {                    if (debug) { console.log('roleCreate', role); }                                       if (events.has('roleCreate')) {                     var callbacks = events.get('roleCreate');                     for (var i in callbacks) { callbacks[i](role);                     }}});
client.on('roleDelete',                     function(role) {                    if (debug) { console.log('roleDelete', role); }                                       if (events.has('roleDelete')) {                     var callbacks = events.get('roleDelete');                     for (var i in callbacks) { callbacks[i](role);                     }}});
client.on('roleUpdate',                     function(oldRole, newRole) {        if (debug) { console.log('roleUpdate', oldRole, newRole); }                           if (events.has('roleUpdate')) {                     var callbacks = events.get('roleUpdate');                     for (var i in callbacks) { callbacks[i](oldRole, newRole);         }}});
client.on('typingStart',                    function(channel, user) {           if (debug) { console.log('typingStart', channel, user); }                             if (events.has('typingStart')) {                    var callbacks = events.get('typingStart');                    for (var i in callbacks) { callbacks[i](channel, user);            }}});
client.on('typingStop',                     function(channel, user) {           if (debug) { console.log('typingStop', channel, user); }                              if (events.has('typingStop')) {                     var callbacks = events.get('typingStop');                     for (var i in callbacks) { callbacks[i](channel, user);            }}});
client.on('userNoteUpdate',                 function(user, oldNote, newNote) {  if (debug) { console.log('userNoteUpdate', user, oldNote, newNote); }                 if (events.has('userNoteUpdate')) {                 var callbacks = events.get('userNoteUpdate');                 for (var i in callbacks) { callbacks[i](user, oldNote, newNote);   }}});
client.on('userUpdate',                     function(oldUser, newUser) {        if (debug) { console.log('userUpdate', oldUser, newUser); }                           if (events.has('userUpdate')) {                     var callbacks = events.get('userUpdate');                     for (var i in callbacks) { callbacks[i](oldUser, newUser);         }}});
client.on('voiceStateUpdate',               function(oldMember, newMember) {    if (debug) { console.log('voiceStateUpdate', oldMember, newMember); }                 if (events.has('voiceStateUpdate')) {               var callbacks = events.get('voiceStateUpdate');               for (var i in callbacks) { callbacks[i](oldMember, newMember);     }}});
client.on('warn',                           function(info) {                    if (debug) { console.log('warn', info); }                                             if (events.has('warn')) {                           var callbacks = events.get('warn');                           for (var i in callbacks) { callbacks[i](info);                     }}});

client.login('Bot ' + process.env.TOKEN || '');


app.set('port', (process.env.PORT || 5000));

for (var i in modules) {
  var module = modules[i].getEndpoints();
  for (var key in module) {
    app.get(key, module[key]);
  }
}

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

