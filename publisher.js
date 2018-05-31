var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://127.0.0.1');
client.on('connect', function () {
    client.publish('iot:t1', '25.60');
    console.log('Message Sent');
});