const AbstractModule = require('./AbstractModule');
class TBAWebhookHandler extends AbstractModule {
  getEndpoints() {
    return {
      '/webhook': (request, response) => {
        console.log(request);
        response.send('Request recv\'d.');
      }
    };
  }
}

module.exports = TBAWebhookHandler;