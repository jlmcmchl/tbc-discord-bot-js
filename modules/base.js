class Base {
    constructor() {};
    getEvents() {return {};}
    getEndpoints() {
        return { 
            '/': (request, response) => response.send("Hello World!"),
        };
    }
}

module.exports = Base;