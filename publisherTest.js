global.rootPath = __dirname
let mqtt = require('mqtt')
let credential = require(`${rootPath}/config/credentials`)
let env = require(`${rootPath}/config/env`)

let clientMqtt = mqtt.connect(credential.address, env.mqttoptions)

clientMqtt.publish(env.topic_ven, JSON.stringify({ value: '0' }))
console.log('Message send')


