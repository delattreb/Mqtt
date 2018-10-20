let mqtt = require('mqtt');
let env = require('./env');

var options = {
    port: 1883,
    clientId: 'Test'
};

let clientMqtt = mqtt.connect(env.address, options);

clientMqtt.publish(env.topic_ven_force, '0');
console.log('send message');