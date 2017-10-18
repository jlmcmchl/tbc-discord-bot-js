var initTBA = require('../lib/tba-api-v3');
var tba = new initTBA(process.env.XTBAAUTHKEY || '');

class initTBABot {
    constructor() {}
    getEvents() { return {'message': message => {
        if (message) {
            console.log(message);
        }
    }};}
}