let server = require('mosca')

module.exports = {
    // Log Level Configuration Trace:0 Debug:1 Info:2 Warning:3 Error:4 Silent:5
    loglevel: 0,

    // Mosca Server configuration
    mosacacredentials: '/home/dietpi/MqttHome/credentials.json',
    mosca: {
        port: 1883,
        persistence: server.persistence.Memory,
        logger: {
            name: 'MoscaServer',
            //level: 'debug'
        },
        //secure: {
        //    port: 8444,
        //    keyPath: '/home/dietpi/certs/MyKey.key',
        //    certPath: '/home/dietpi/certs/MyCertificate.crt'
        //},
    },

    // MQTT configuration
    mqttRegulatorOptions: {
        port: 1883,
        clientId: 'Regulator',
        username: "dietpi",
        password: "infected",
    },

    // MQTT configuration
    mqttTestOptions: {
        port: 1883,
        clientId: 'SmartPhone',
        username: "dietpi",
        password: "infected",
    },

    // API configuration
    api: {
        url: '127.0.0.1',
        port: 1337
    },

    // Regulation configuration
    topic_hum: 'iot:h1',
    topic_ven: 'ventilation',
    topic_ven_force: 'ventilation_force',
    location: 'Cave',
    ESP_NAME: 'ESP Extracteur',

    // Date format
    date_format: "dd/mm/yyyy H:MM:ss",
    mysql_date: "yyyy-mm-dd H:MM:ss"
}