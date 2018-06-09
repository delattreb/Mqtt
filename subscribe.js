let mqtt = require('mqtt');
let client = mqtt.connect('mqtt://127.0.0.1');

client.on('connect', function () {
    console.log('Connected');
});

client.subscribe('iot');

client.on('message', (topic, message) => {
console.log(topic);
console.log(message);
});