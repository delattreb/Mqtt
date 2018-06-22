let mqtt = require('mqtt');
let mysql = require('mysql');
let dateFormat = require('dateformat');

let address = 'mqtt://mycube.dscloud.me';
let topic_hum = 'iot:h1';
let topic_ven = 'ventilation';
let location = 'Cave';
let ESP_NAME = 'ESP Extracteur';
let LOG = true;
let INFO = true;
let threshold = 0;
let gap = 0;
let last_hum = 0;
let bthreshold = false;

let db_config = {
    host: 'mycube.dscloud.me',
    user: 'usermqtt',
    password: 'infected',
    database: 'mqtt',
    port: 3307
};

let clientMqtt = mqtt.connect(address);
let connection;
connection = mysql.createConnection(db_config);

//
// Connection
//
let promiseMqtt = new Promise(function (resolve, reject) {
    clientMqtt.subscribe(topic_hum);
    clientMqtt.on('connect', function () {
        console.log('Connected to:', address);
        resolve();
    });
});

let promiseMySQL = new Promise(function (resolve, reject) {
    connection.connect(function () {
        console.log('Database Connected');
        resolve();
    });
});

Promise.all([promiseMqtt, promiseMySQL]).then(function (values) {
    }
);
// --------------------------------------------------------------------------------------------------------------------

function refreshData() {
    getthreshold();
    getgap();
    if (LOG) {
        console.log('Threshold:', threshold);
        console.log('Gap:', gap);
    }
}

//
// MQTT
//
clientMqtt.on('message', (topic, message) => {
    //TODO : Test to to update each ESP State (Ventilation)
    //TODO : Test topic message to distinguish ventilation & hum
    refreshData();
    if (LOG) {
        console.log('Topic:', topic);
        console.log('Message:', message.toString());
    }
    let hum = parseFloat(message);
    last_hum = hum;
    if (hum >= threshold) {
        clientMqtt.publish(topic_ven, '1');
          AddRegulation('Regulation On', dateFormat(new Date(),"yyyy-mm-dd H:MM:ss"), ESP_NAME, true);
        bthreshold = true;
    } else {
        if (bthreshold) {
            if (hum <= (threshold - gap)) {
                clientMqtt.publish(topic_ven, '0');
                AddRegulation('Regulation Off', dateFormat(new Date(),"yyyy-mm-dd H:MM:ss"), ESP_NAME, false);
                bthreshold = false;
            }
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
        if (LOG) console.log(name, 'Insert regulation', state);
    });
}

function getthreshold() {
    let sql = 'SELECT threshold FROM configuration WHERE name=? LIMIT 1';
    let params = [location];
    sql = mysql.format(sql, params);
    connection.query(sql, function (error, results) {
        if (error) throw error;
        threshold = parseFloat(results[0].threshold);
    });
}

function getgap() {
    let sql = 'SELECT gap FROM configuration WHERE name=? LIMIT 1';
    let params = [location];
    sql = mysql.format(sql, params);
    connection.query(sql, function (error, results) {
        if (error) throw error;
        gap = parseFloat(results[0].gap);
    });
}
//--------------------------------------------------------------------------------------------------------------------
