const AbstractModule = require('./AbstractModule');
class TBAWebhookHandler extends AbstractModule {
  postEndpoints() {
    return {
      '/webhook': (request, response) => {
        response.send('Request recv\'d.');
        var body = '';
        request.on('data', data => {
          body += data;
        });
        request.on('end', () => {
          console.log(body);
        });
      }
    };
  }
}

module.exports = TBAWebhookHandler;