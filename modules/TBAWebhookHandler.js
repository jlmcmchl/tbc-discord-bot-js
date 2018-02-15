const AbstractModule = require('./AbstractModule');
class TBAWebhookHandler extends AbstractModule {
  postEndpoints() {
    return {
      '/webhook': (request, response) => {
        response.send('Request recv\'d.');
        let body = [];
        request.on('data', (chunk) => {
          body.push(chunk);
        }).on('end', () => {
          body = Buffer.concat(body).toString();
          // at this point, `body` has the entire request body stored in it as a string
          console.log(body);
        });
      }
    };
  }
}

module.exports = TBAWebhookHandler;