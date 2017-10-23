var express = require('express');
var app = express();

var async = require('async');

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

client.on('channelCreate',                  function(channel) {                 if (debug) { console.log('channelCreate', channel); }                                 if (events.has('channelCreate')) {                  var cbs = events.get('channelCreate');                  async.map(cbs, cb => cb(channel));                  }});
client.on('channelDelete',                  function(channel) {                 if (debug) { console.log('channelDelete', channel); }                                 if (events.has('channelDelete')) {                  var cbs = events.get('channelDelete');                  async.map(cbs, cb => cb(channel));                  }});
client.on('channelPinsUpdate',              function(channel, time) {           if (debug) { console.log('channelPinsUpdate', channel, time); }                       if (events.has('channelPinsUpdate')) {              var cbs = events.get('channelPinsUpdate');              async.map(cbs, cb => cb(channel, time));            }});
client.on('channelUpdate',                  function(oldChannel, newChannel) {  if (debug) { console.log('channelUpdate', oldChannel, newChannel); }                  if (events.has('channelUpdate')) {                  var cbs = events.get('channelUpdate');                  async.map(cbs, cb => cb(oldChannel, newChannel));   }});
client.on('clientUserGuildSettingsUpdate',  function(clientUserGuildSettings) { if (debug) { console.log('clientUserGuildSettingsUpdate', clientUserGuildSettings); } if (events.has('clientUserGuildSettingsUpdate')) {  var cbs = events.get('clientUserGuildSettingsUpdate');  async.map(cbs, cb => cb(clientUserGuildSettings));  }});
client.on('clientUserSettingsUpdate',       function(clientUserSettings) {      if (debug) { console.log('clientUserSettingsUpdate', clientUserSettings); }           if (events.has('clientUserSettingsUpdate')) {       var cbs = events.get('clientUserSettingsUpdate');       async.map(cbs, cb => cb(clientUserSettings));       }});
client.on('debug',                          function(info) {                    if (debug) { console.log('debug', info); }                                            if (events.has('debug')) {                          var cbs = events.get('debug');                          async.map(cbs, cb => cb(info));                     }});
client.on('disconnect',                     function(event) {                   if (debug) { console.log('disconnect', event); }                                      if (events.has('disconnect')) {                     var cbs = events.get('disconnect');                     async.map(cbs, cb => cb(event));                    }});
client.on('emojiCreate',                    function(emoji) {                   if (debug) { console.log('emojiCreate', emoji); }                                     if (events.has('emojiCreate')) {                    var cbs = events.get('emojiCreate');                    async.map(cbs, cb => cb(emoji));                    }});
client.on('emojiDelete',                    function(emoji) {                   if (debug) { console.log('emojiDelete', emoji); }                                     if (events.has('emojiDelete')) {                    var cbs = events.get('emojiDelete');                    async.map(cbs, cb => cb(emoji));                    }});
client.on('emojiUpdate',                    function(oldEmoji, newEmoji) {      if (debug) { console.log('emojiUpdate', oldEmoji, newEmoji); }                        if (events.has('emojiUpdate')) {                    var cbs = events.get('emojiUpdate');                    async.map(cbs, cb => cb(oldEmoji, newEmoji));       }});
client.on('error',                          function(error) {                   if (debug) { console.log('error', error); }                                           if (events.has('error')) {                          var cbs = events.get('error');                          async.map(cbs, cb => cb(error));                    }});
client.on('guildBanAdd',                    function(guild, user) {             if (debug) { console.log('guildBanAdd', guild, user); }                               if (events.has('guildBanAdd')) {                    var cbs = events.get('guildBanAdd');                    async.map(cbs, cb => cb(guild, user));              }});
client.on('guildBanRemove',                 function(guild, user) {             if (debug) { console.log('guildBanRemove', guild, user); }                            if (events.has('guildBanRemove')) {                 var cbs = events.get('guildBanRemove');                 async.map(cbs, cb => cb(guild, user));              }});
client.on('guildCreate',                    function(guild) {                   if (debug) { console.log('guildCreate', guild); }                                     if (events.has('guildCreate')) {                    var cbs = events.get('guildCreate');                    async.map(cbs, cb => cb(guild));                    }});
client.on('guildDelete',                    function(guild) {                   if (debug) { console.log('guildDelete', guild); }                                     if (events.has('guildDelete')) {                    var cbs = events.get('guildDelete');                    async.map(cbs, cb => cb(guild));                    }});
client.on('guildMemberAdd',                 function(member) {                  if (debug) { console.log('guildMemberAdd', member); }                                 if (events.has('guildMemberAdd')) {                 var cbs = events.get('guildMemberAdd');                 async.map(cbs, cb => cb(member));                   }});
client.on('guildMemberAvailable',           function(member) {                  if (debug) { console.log('guildMemberAvailable', member); }                           if (events.has('guildMemberAvailable')) {           var cbs = events.get('guildMemberAvailable');           async.map(cbs, cb => cb(member));                   }});
client.on('guildMemberRemove',              function(member) {                  if (debug) { console.log('guildMemberRemove', member); }                              if (events.has('guildMemberRemove')) {              var cbs = events.get('guildMemberRemove');              async.map(cbs, cb => cb(member));                   }});
client.on('guildMembersChunk',              function(members, guild) {          if (debug) { console.log('guildMembersChunk', members, guild); }                      if (events.has('guildMembersChunk')) {              var cbs = events.get('guildMembersChunk');              async.map(cbs, cb => cb(members, guild));           }});
client.on('guildMemberSpeaking',            function(member, speaking) {        if (debug) { console.log('guildMemberSpeaking', member, speaking); }                  if (events.has('guildMemberSpeaking')) {            var cbs = events.get('guildMemberSpeaking');            async.map(cbs, cb => cb(member, speaking));         }});
client.on('guildMemberUpdate',              function(oldMember, newMember) {    if (debug) { console.log('guildMemberUpdate', oldMember, newMember); }                if (events.has('guildMemberUpdate')) {              var cbs = events.get('guildMemberUpdate');              async.map(cbs, cb => cb(oldMember, newMember));     }});
client.on('guildUnavailable',               function(guild) {                   if (debug) { console.log('guildUnavailable', guild); }                                if (events.has('guildUnavailable')) {               var cbs = events.get('guildUnavailable');               async.map(cbs, cb => cb(guild));                    }});
client.on('guildUpdate',                    function(oldGuild, newGuild) {      if (debug) { console.log('guildUpdate', oldGuild, newGuild); }                        if (events.has('guildUpdate')) {                    var cbs = events.get('guildUpdate');                    async.map(cbs, cb => cb(oldGuild, newGuild));       }});
client.on('message',                        function(message) {                 if (debug) { console.log('message', message); }                                       if (events.has('message')) {                        var cbs = events.get('message');                        async.map(cbs, cb => cb(message));                  }});
client.on('messageDelete',                  function(message) {                 if (debug) { console.log('messageDelete', message); }                                 if (events.has('messageDelete')) {                  var cbs = events.get('messageDelete');                  async.map(cbs, cb => cb(message));                  }});
client.on('messageDeleteBulk',              function(messages) {                if (debug) { console.log('messageDeleteBulk', messages); }                            if (events.has('messageDeleteBulk')) {              var cbs = events.get('messageDeleteBulk');              async.map(cbs, cb => cb(messages));                 }});
client.on('messageReactionAdd',             function(messageReaction, user) {   if (debug) { console.log('messageReactionAdd', messageReaction, user); }              if (events.has('messageReactionAdd')) {             var cbs = events.get('messageReactionAdd');             async.map(cbs, cb => cb(messageReaction, user));    }});
client.on('messageReactionRemove',          function(messageReaction, user) {   if (debug) { console.log('messageReactionRemove', messageReaction, user); }           if (events.has('messageReactionRemove')) {          var cbs = events.get('messageReactionRemove');          async.map(cbs, cb => cb(messageReaction, user));    }});
client.on('messageReactionRemoveAll',       function(message) {                 if (debug) { console.log('messageReactionRemoveAll', message); }                      if (events.has('messageReactionRemoveAll')) {       var cbs = events.get('messageReactionRemoveAll');       async.map(cbs, cb => cb(message));                  }});
client.on('messageUpdate',                  function(oldMessage, newMessage) {  if (debug) { console.log('messageUpdate', oldMessage, newMessage); }                  if (events.has('messageUpdate')) {                  var cbs = events.get('messageUpdate');                  async.map(cbs, cb => cb(oldMessage, newMessage));   }});
client.on('presenceUpdate',                 function(oldMember, newMember) {    if (debug) { console.log('presenceUpdate', oldMember, newMember); }                   if (events.has('presenceUpdate')) {                 var cbs = events.get('presenceUpdate');                 async.map(cbs, cb => cb(oldMember, newMember));     }});
client.on('ready',                          function() {                        if (debug) { console.log('ready'); }                                                  if (events.has('ready')) {                          var cbs = events.get('ready');                          async.map(cbs, cb => cb());                         }});
client.on('reconnecting',                   function() {                        if (debug) { console.log('reconnecting'); }                                           if (events.has('reconnecting')) {                   var cbs = events.get('reconnecting');                   async.map(cbs, cb => cb());                         }});
client.on('resume',                         function(replayed) {                if (debug) { console.log('resume', replayed); }                                       if (events.has('resume')) {                         var cbs = events.get('resume');                         async.map(cbs, cb => cb(replayed));                 }});
client.on('roleCreate',                     function(role) {                    if (debug) { console.log('roleCreate', role); }                                       if (events.has('roleCreate')) {                     var cbs = events.get('roleCreate');                     async.map(cbs, cb => cb(role));                     }});
client.on('roleDelete',                     function(role) {                    if (debug) { console.log('roleDelete', role); }                                       if (events.has('roleDelete')) {                     var cbs = events.get('roleDelete');                     async.map(cbs, cb => cb(role));                     }});
client.on('roleUpdate',                     function(oldRole, newRole) {        if (debug) { console.log('roleUpdate', oldRole, newRole); }                           if (events.has('roleUpdate')) {                     var cbs = events.get('roleUpdate');                     async.map(cbs, cb => cb(oldRole, newRole));         }});
client.on('typingStart',                    function(channel, user) {           if (debug) { console.log('typingStart', channel, user); }                             if (events.has('typingStart')) {                    var cbs = events.get('typingStart');                    async.map(cbs, cb => cb(channel, user));            }});
client.on('typingStop',                     function(channel, user) {           if (debug) { console.log('typingStop', channel, user); }                              if (events.has('typingStop')) {                     var cbs = events.get('typingStop');                     async.map(cbs, cb => cb(channel, user));            }});
client.on('userNoteUpdate',                 function(user, oldNote, newNote) {  if (debug) { console.log('userNoteUpdate', user, oldNote, newNote); }                 if (events.has('userNoteUpdate')) {                 var cbs = events.get('userNoteUpdate');                 async.map(cbs, cb => cb(user, oldNote, newNote));   }});
client.on('userUpdate',                     function(oldUser, newUser) {        if (debug) { console.log('userUpdate', oldUser, newUser); }                           if (events.has('userUpdate')) {                     var cbs = events.get('userUpdate');                     async.map(cbs, cb => cb(oldUser, newUser));         }});
client.on('voiceStateUpdate',               function(oldMember, newMember) {    if (debug) { console.log('voiceStateUpdate', oldMember, newMember); }                 if (events.has('voiceStateUpdate')) {               var cbs = events.get('voiceStateUpdate');               async.map(cbs, cb => cb(oldMember, newMember));     }});
client.on('warn',                           function(info) {                    if (debug) { console.log('warn', info); }                                             if (events.has('warn')) {                           var cbs = events.get('warn');                           async.map(cbs, cb => cb(info));                     }});

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

