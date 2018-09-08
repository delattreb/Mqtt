/*
let mqtt = require('mqtt');
let client = mqtt.connect('mqtt://192.169.1.46');

client.on('connect', function () {
    client.publish('ventilation', '0');
    console.log('Message Sent');
//    process.exit();
});
*/


let logger = require('./Logger');
logger.loginfo('INFO', 'test', 'WTF');

