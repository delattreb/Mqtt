let mqtt = require('mqtt');
let mysql = require('mysql');
let dateFormat = require('dateformat');
let log = require('loglevel');
let env = require('./env');
let credential = require('./credentials');

let threshold = 100;
let gap = 0;
let last_hum = 0;
let bthreshold = false;
let bventilation_force = false;
var options = {
    port: 1883,
    clientId: 'Regulator'
};

log.setDefaultLevel(env.loglevel);
let connection;

let clientMqtt = mqtt.connect(credential.address, options);
connection = mysql.createConnection(credential.db);

//
// Connection
//
let promiseMqtt = new Promise(function (resolve, reject) {
    clientMqtt.subscribe(env.topic_hum);
    clientMqtt.subscribe(env.topic_ven_force);
    clientMqtt.on('connect', function () {
        log.info(dateFormat(new Date(), env.date_format), 'Connected to:', credential.address);
        resolve();
    });
});

let promiseMySQL = new Promise(function (resolve, reject) {
    connection.connect(function () {
        log.info(dateFormat(new Date(), env.date_format), 'Database Connected');
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
    log.debug(dateFormat(new Date(), env.date_format), 'Threshold:', threshold);
    log.debug(dateFormat(new Date(), env.date_format), 'Gap:', gap);
}

//
// MQTT
//
clientMqtt.on('message', (topic, message) => {
    refreshData();
    log.debug(dateFormat(new Date(), env.date_format), 'Message from:', topic);
    log.debug(dateFormat(new Date(), env.date_format), 'Msg:', message.toString());
    //if (bventilation_force === false) {
        if (topic.indexOf('iot:') === 0) {
            let hum = parseFloat(message.toString());
            last_hum = hum;
            if (hum >= threshold) {
                clientMqtt.publish(env.topic_ven, '1');
                if (!bthreshold)
                    AddRegulation('Regulation On', dateFormat(new Date(), mysql_date), env.ESP_NAME, true);
                log.info(dateFormat(new Date(), env.date_format), 'Regulation On');
                bthreshold = true;
            } else {
                if (bthreshold) {
                    if (hum <= (threshold - gap)) {
                        clientMqtt.publish(env.topic_ven, '0');
                        AddRegulation('Regulation Off', dateFormat(new Date(), mysql_date), env.ESP_NAME, false);
                        log.info(dateFormat(new Date(), env.date_format), 'Regulation Off');
                        bthreshold = false;
                    }
                }
            }
        }
    //}
    /*
    if (topic.indexOf(env.topic_ven_force) === 0) {
        let state = parseFloat(message.toString());
        if (state === 0) {
            clientMqtt.publish(env.topic_ven, '0');
            AddRegulation('Regulation Off', dateFormat(new Date(), "yyyy-mm-dd H:MM:ss"), env.ESP_NAME, false);
            log.info(dateFormat(new Date(), env.date_format), 'Regulation force Off');
            bventilation_force = false;
        }
        else {
            clientMqtt.publish(env.topic_ven, '1');
            AddRegulation('Regulation On', dateFormat(new Date(), "yyyy-mm-dd H:MM:ss"), env.ESP_NAME, true);
            log.info(dateFormat(new Date(), env.date_format), 'Regulation force On');
            bventilation_force = true;
        }
    }*/
});
//---------------------------------------------------------------------------------------------------------------------


//
// MySQL
//
function AddRegulation(tag, date, name, state) {
    let sqlESPConnect = 'INSERT INTO regulation (tag, date, name, state) VALUES (?, ?, ?, ?)';
    let params = [tag, date, name, state];
    procsql(sqlESPConnect, params);
    log.info(name, 'Insert regulation', state);
}

function getthreshold() {
    let sql = 'SELECT threshold FROM configuration WHERE name=? LIMIT 1';
    let params = [env.location];
    threshold = procsql(sql, params);
}

function getgap() {
    let sql = 'SELECT gap FROM configuration WHERE name=? LIMIT 1';
    let params = [env.location];
    gap = procsql(sql, params);
}

function procsql(reqsql, params) {
    sql = mysql.format(reqsql, params);
    connection.query(sql, function (error, results) {
        if (error) {
            log.error(dateFormat(new Date(), env.date_format), 'MySQL connection error');
        }
        log.debug(dateFormat(new Date(), env.date_format), results);
        return parseFloat(results[0].gap);
    });
}

//--------------------------------------------------------------------------------------------------------------------
