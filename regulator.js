global.rootPath = __dirname

let mqtt = require('mqtt')
let env = require(`${rootPath}/config/env`)
let credential = require(`${rootPath}/config/credentials`)
let api = require('./lib/api')
let logger = require('./lib/logger')

let threshold = 100
let gap = 0
let last_hum = 0
let bthreshold = false
let bventilation_force = false

let clientMqtt = mqtt.connect(credential.address, env.mqttRegulatorOptions)
clientMqtt.on('connect', function () {
    logger.debug('MQTT connected on port ' + env.mqttRegulatorOptions.port)
})
clientMqtt.subscribe(env.topic_iot)
clientMqtt.subscribe(env.topic_ven_force)
refreshData()

/*------------------------------------------------------------------------------------------------
|  Function refreshData
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function refreshData() {
    api.getThreshold(function (valthreshold) {
        threshold = valthreshold
    })
    api.getGap(function (valgap) {
        gap = valgap
    })
}

/*------------------------------------------------------------------------------------------------
|  Function MQTT
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
clientMqtt.on('message', (topic, message) => {
    refreshData()
    if (bventilation_force === false) {
        if (topic === env.topic_iot && JSON.parse(message).name === 'h4') {
            let hum = parseFloat(JSON.parse(message).value)
            last_hum = hum
            logger.debug('Topic ' + topic + ' Name ' + JSON.parse(message).name + ' Humidity ' + hum)
            if (hum >= threshold) {
                if (!bthreshold) {
                    clientMqtt.publish(env.topic_ven, JSON.stringify({ value: '1' }))
                    api.insertRegulation(env.ESP_NAME, 'Regulation On', true)
                    logger.info('Regulation On')
                }
                bthreshold = true
            } else {
                if (bthreshold) {
                    if (hum <= (threshold - gap)) {
                        clientMqtt.publish(env.topic_ven, JSON.stringify({ value: '0' }))
                        api.insertRegulation(env.ESP_NAME, 'Regulation Off', false)
                        logger.info('Regulation Off')
                        bthreshold = false
                    }
                }
            }
        }
    }
    if (topic === env.topic_ven_force) {
        let state = parseInt(JSON.parse(message).value)
        if (state === 0) {
            clientMqtt.publish(env.topic_ven, JSON.stringify({ value: '0' }))
            api.insertRegulation(env.ESP_NAME, 'Regulation Off', false)
            logger.info('Regulation force Off')
            bventilation_force = false
        } else {
            clientMqtt.publish(env.topic_ven, JSON.stringify({ value: '1' }))
            api.insertRegulation(env.ESP_NAME, 'Regulation On', true)
            logger.info('Regulation force On')
            bventilation_force = true
        }
    }
})