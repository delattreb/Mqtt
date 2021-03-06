global.rootPath = __dirname

let mqtt = require('mqtt')
let credential = require(`${rootPath}/config/credentials`)
let env = require(`${rootPath}/config/env`)

let clientMqtt = mqtt.connect(credential.address, env.mqttTestoptions)

clientMqtt.publish('iot:h1', JSON.stringify({
    name: 'h1',
    value: 56,
}))
console.log('Message send')