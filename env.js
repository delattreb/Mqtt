// Configuration file
let log = require('loglevel');
let server = require('mosca');

module.exports = {
    // Log Level Configuration
    loglevel: log.levels.INFO,

    // Mosca Server configuration
    mosca: {
        port: 1883,
        persistence: server.persistence.Memory
    },
    
    // MQTT regulation
    mqttoptions: {
        port: 1883,
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