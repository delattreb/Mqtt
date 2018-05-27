var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://127.0.0.1');
client.on('connect', function () {
       client.publish('Temperature', 'T19.87:H65.0');

        console.log('Message Sent');

});