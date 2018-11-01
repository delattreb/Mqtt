// Configuration file
let log = require('loglevel');
let server = require('mosca');

module.exports = {
    // Log Level Configuration
    mqttport : 1883,
    loglevel: log.levels.INFO,

    // Mosca Server configuration
    mosca: {
        port: mqttport,
        persistence: server.persistence.Memory
    },
    
    // MQTT regulation
    mqttoptions: {
        port: mqttport,
        clientId: 'Regulator'
    },

    topic_hum: 'iot:h1',
    topic_ven: 'ventilation',
    topic_ven_force: 'ventilation_force',
    location: 'Cave',
    ESP_NAME: 'ESP Extracteur',
    date_format: "dd/mm/yyyy H:MM:ss",
    mysql_date: "yyyy-mm-dd H:MM:ss"
}