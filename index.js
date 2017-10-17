var express = require('express');
var app = express();

var initTBA = require('./tba-api-v3');
var tba = new initTBA(process.env.XTBAAUTHKEY || '');




app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  response.send("Hello World!");
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
