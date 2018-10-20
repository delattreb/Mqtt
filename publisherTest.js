let mqtt = require('mqtt')
let env = require('./env')
let credential = require('./credentials')

var options = {
    port: 1883,
    clientId: 'Test'
}

let clientMqtt = mqtt.connect(credential.address, options)
clientMqtt.publish(env.topic_ven,  JSON.stringify({ value: '1' }))
console.log('send message')