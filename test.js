global.rootPath = __dirname

let mqtt = require('mqtt')
let env = require(`${rootPath}/config/env`)

let api = require('./lib/api')
let logger = require('./lib/logger')

let clientMqtt = mqtt.connect(env.raspberry_address, env.mqttRegulatorOptions)
clientMqtt.on('connect', function () {
    logger.info('MQTT connected on port ' + env.mqttRegulatorOptions.port)
})

logger.info('Ventilation On')
clientMqtt.publish(env.topic_ven, JSON.stringify({ value: '1' }))
