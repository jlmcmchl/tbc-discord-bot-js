const AbstractModule = require('./AbstractModule');

class Base extends AbstractModule {
    constructor() { super(); };
    getEvents() {
        return {
            'message': (message) => console.log(message.content)
        };
    }
    getEndpoints() {
        return { 
            '/': (request, response) => response.send("Hello World!"),
        };
    }
}

module.exports = Base;