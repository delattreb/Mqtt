global.rootPath = __dirname

let mqtt = require('mqtt')
let dateFormat = require('dateformat')
let env = require(`${rootPath}/config/env`)
let credential = require(`${rootPath}/config/credentials`)
let sql = require('./lib/sql')
let logger = require('./lib/logger')

let threshold = 100
let gap = 0
let last_hum = 0
let bthreshold = false
let bventilation_force = false

let clientMqtt = mqtt.connect(credential.address, env.mqttoptions)
clientMqtt.on('connect', function() { 
    logger.debug('MQTT connected on port ' + env.mqttoptions.port)
})
clientMqtt.subscribe(env.topic_hum)
clientMqtt.subscribe(env.topic_ven_force)
refreshData()

/*------------------------------------------------------------------------------------------------
|  Function refreshData
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function refreshData() {
    sql.getthreshold(env.location, function (valthreshold) {
        threshold = valthreshold
        logger.debug('Threshold ' + threshold)
    })
    sql.getgap(env.location, function (valgap) {
        gap = valgap
        logger.debug('Gap ' + gap)
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
        if (topic.indexOf(env.topic_hum) === 0) {
            let hum = parseFloat(message.toString())
            last_hum = hum
            logger.debug('Topic ' + env.topic_hum + ' Humidity ' + hum)
            if (hum >= threshold) {
                clientMqtt.publish(env.topic_ven, JSON.stringify({
                    value: '1'
                }))
                if (!bthreshold)
                    sql.AddRegulation('Regulation On', dateFormat(new Date(), env.mysql_date), env.ESP_NAME, true)
                logger.info('Regulation On')
                bthreshold = true
            } else {
                if (bthreshold) {
                    if (hum <= (threshold - gap)) {
                        clientMqtt.publish(env.topic_ven, JSON.stringify({
                            value: '0'
                        }))
                        sql.AddRegulation('Regulation Off', dateFormat(new Date(), env.mysql_date), env.ESP_NAME, false)
                        logger.info('Regulation Off')
                        bthreshold = false
                    }
                }
            }
        }
    }
    if (topic.indexOf(env.topic_ven_force) === 0) {
        let state = parseInt(JSON.parse(message).value)
        if (state === 0) {
            clientMqtt.publish(env.topic_ven, JSON.stringify({
                value: '0'
            }))
            sql.AddRegulation('Regulation Off', dateFormat(new Date(), "yyyy-mm-dd H:MM:ss"), env.ESP_NAME, false)
            logger.info('Regulation force Off')
            //bventilation_force = false
        } else {
            clientMqtt.publish(env.topic_ven, JSON.stringify({
                value: '1'
            }))
            sql.AddRegulation('Regulation On', dateFormat(new Date(), "yyyy-mm-dd H:MM:ss"), env.ESP_NAME, true)
            logger.info('Regulation force On')
            //bventilation_force = true
        }
    }
})