let mqtt = require('mqtt');
let env = require('./env');

var options = {
    port: 1884,
    //host: 'mqtt://mycube.dscloud.me',
    clientId: 'Mytest'
    //keepalive: 60,
    //reconnectPeriod: 1000,
    //protocolId: 'MQIsdp',
    //protocolVersion: 3,
    //clean: true,
    //encoding: 'utf8'
};

let clientMqtt = mqtt.connect(env.address, options);

clientMqtt.publish(env.topic_ven, '0');
console.log('send message');