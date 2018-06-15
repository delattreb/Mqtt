let mqtt = require('mqtt');
let mysql = require('mysql');
let dateFormat = require('dateformat');

let address = 'mqtt://mycube.dscloud.me';
let topic_hum = 'iot:h1';
let topic_ven = 'iot:ventilation';
let location = 'Cave';
let LOG = false;
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
        refresh();
    }
);

function refresh() {
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
    refresh();
    if (LOG) {
        console.log('Topic:', topic);
        console.log('Message:', message.toString());
    }
    let hum = parseFloat(message);
    last_hum = hum;
    if (hum >= threshold) {
        if (INFO) {
            console.log(dateFormat(Date.now(), "dd-mm-yyyy h:MM:ss"));
            console.log('Ventilation On');
        }
        clientMqtt.publish(topic_ven, '1');
        bthreshold = true;
    } else {
        if (bthreshold) {
            if (INFO) {
                console.log(dateFormat(Date.now(), "dd-mm-yyyy h:MM:ss"));
                console.log('Ventilation Off');
            }
            if (hum <= (threshold - gap)) {
                clientMqtt.publish(topic_ven, '0');
                bthreshold = false;
            }
        }
    }
});

//
// MySQL
//
function getthreshold() {
    let sql = 'SELECT threshold FROM regulation WHERE name=?';
    let params = [location];
    sql = mysql.format(sql, params);
    connection.query(sql, function (error, results) {
        if (error) throw error;
        threshold = parseFloat(results[0].threshold);
    });
}

function getgap() {
    let sql = 'SELECT gap FROM regulation WHERE name=?';
    let params = [location];
    sql = mysql.format(sql, params);
    connection.query(sql, function (error, results) {
        if (error) throw error;
        gap = parseFloat(results[0].gap);
    });
}