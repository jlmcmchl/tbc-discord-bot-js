class TBAWebhookHandler {
  getEndpoints() {
    return {
      '/webhook': (request, response) => {
        console.log(request);
      }
    };
  }
}

module.exports = TBAWebhookHandler;