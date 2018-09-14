
let mqtt = require('mqtt');
let client = mqtt.connect('mqtt://192.169.1.46');

client.on('connect', function () {
    console.log('Message Sent');
    client.publish('ventilation', '0');
});



//let logger = require('./Logger');
//logger.loginfo('INFO', 'test', 'WTF');

