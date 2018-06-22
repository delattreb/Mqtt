let mqtt = require('mqtt');
let client = mqtt.connect('mqtt://192.169.1.46');

client.on('connect', function () {
    client.publish('iot:ventilation', '0');
    console.log('Message Sent');
//    process.exit();
});

