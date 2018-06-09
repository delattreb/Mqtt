let mqtt = require('mqtt');
let client = mqtt.connect('mqtt://127.0.0.1');

client.on('connect', function () {
    client.publish('iot', '25.60');
    console.log('Message Sent');
});

