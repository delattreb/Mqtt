let mqtt = require('mqtt');
let mysql = require('mysql');
let dateFormat = require('dateformat');
let log = require('loglevel');
let env = require('./env');

let threshold = 100;
let gap = 0;
let last_hum = 0;
let bthreshold = false;
let bventilation_force = false;
var options = {
    port: 1883,
    //host: 'mqtt://mycube.dscloud.me',
    clientId: 'Regulator'
    //keepalive: 60,
    //reconnectPeriod: 1000,
    //protocolId: 'MQIsdp',
    //protocolVersion: 3,
    //clean: true,
    //encoding: 'utf8'
};
log.setDefaultLevel(env.loglevel);
let connection;

let clientMqtt = mqtt.connect(env.address, options);
connection = mysql.createConnection(env.db);

//
// Connection
//
let promiseMqtt = new Promise(function (resolve, reject) {
    clientMqtt.subscribe(env.topic_hum);
    clientMqtt.subscribe(env.topic_ven_force);
    clientMqtt.on('connect', function () {
        log.info(dateFormat(new Date(), "dd/mm/yyyy H:MM:ss"), 'Connected to:', env.address);
        resolve();
    });
});

let promiseMySQL = new Promise(function (resolve, reject) {
    connection.connect(function () {
        log.info(dateFormat(new Date(), "dd/mm/yyyy H:MM:ss"), 'Database Connected');
        resolve();
    });
});

Promise.all([promiseMqtt, promiseMySQL]).then(function (values) {
    refreshData();
}
);

// --------------------------------------------------------------------------------------------------------------------
function refreshData() {
    getthreshold();
    getgap();
    log.debug(dateFormat(new Date(), "dd/mm/yyyy H:MM:ss"), 'Threshold:', threshold);
    log.debug(dateFormat(new Date(), "dd/mm/yyyy H:MM:ss"), 'Gap:', gap);
}

//
// MQTT
//
clientMqtt.on('message', (topic, message) => {
    refreshData();
    log.debug(dateFormat(new Date(), "dd/mm/yyyy H:MM:ss"), 'Message from:', topic);
    log.debug(dateFormat(new Date(), "dd/mm/yyyy H:MM:ss"), 'Msg:', message.toString());
    if (bventilation_force === false) {
        if (topic.indexOf('iot:') === 0) {
            let hum = parseFloat(message.toString());
            last_hum = hum;
            if (hum >= threshold) {
                clientMqtt.publish(env.topic_ven, '1');
                if (!bthreshold)
                    AddRegulation('Regulation On', dateFormat(new Date(), "yyyy-mm-dd H:MM:ss"), env.ESP_NAME, true);
                bthreshold = true;
            } else {
                if (bthreshold) {
                    if (hum <= (threshold - gap)) {
                        clientMqtt.publish(env.topic_ven, '0');
                        AddRegulation('Regulation Off', dateFormat(new Date(), "yyyy-mm-dd H:MM:ss"), env.ESP_NAME, false);
                        bthreshold = false;
                    }
                }
            }
        }
    }
    if (topic.indexOf(env.topic_ven_force) === 0) {
        let state = parseFloat(message.toString());
        if (state === 0) {
            clientMqtt.publish(env.topic_ven, '0');
            AddRegulation('Regulation Off', dateFormat(new Date(), "yyyy-mm-dd H:MM:ss"), env.ESP_NAME, false);
            bventilation_force = false;
        }
        else {
            clientMqtt.publish(env.topic_ven, '1');
            AddRegulation('Regulation On', dateFormat(new Date(), "yyyy-mm-dd H:MM:ss"), env.ESP_NAME, true);
            bventilation_force = true;
        }
    }
});
//---------------------------------------------------------------------------------------------------------------------


//
// MySQL
//
function AddRegulation(tag, date, name, state) {
    let sqlESPConnect = 'INSERT INTO regulation (tag, date, name, state) VALUES (?, ?, ?, ?)';
    let params = [tag, date, name, state];
    sql = mysql.format(sqlESPConnect, params);
    connection.query(sql, function (error, results) {
        if (error) throw error;
        log.debug(name, 'Insert regulation', state);
    });
}

function getthreshold() {
    let sql = 'SELECT threshold FROM configuration WHERE name=? LIMIT 1';
    let params = [env.location];
    sql = mysql.format(sql, params);
    connection.query(sql, function (error, results) {
        if (error) throw error;
        threshold = parseFloat(results[0].threshold);
    });
}

function getgap() {
    let sql = 'SELECT gap FROM configuration WHERE name=? LIMIT 1';
    let params = [env.location];
    sql = mysql.format(sql, params);
    connection.query(sql, function (error, results) {
        if (error) throw error;
        gap = parseFloat(results[0].gap);
    });
}

//--------------------------------------------------------------------------------------------------------------------
