let mysql = require('mysql');
let server = require('mosca');
let dateFormat = require('dateformat');
let log = require('loglevel');

let loglevel = log.levels.INFO;
let connection;
let settings = {
    port: 1883,
    persistence: server.persistence.Memory
};

let db_config = {
    host: 'mycube.dscloud.me',
    user: 'usermqtt',
    password: 'infected',
    database: 'mqtt',
    port: 3307
};
log.setDefaultLevel(loglevel);

// MySQL
connection = mysql.createConnection(db_config);

connection.connect(function () {
    log.info(dateFormat(new Date(), "dd/mm/yyyy H:MM:ss"), 'Database Connected');
});

function updateESPConnected(name, state) {
    let sqlESPConnect = 'UPDATE esp SET connected=? WHERE name=?';
    let params = [state, name];
    sql = mysql.format(sqlESPConnect, params);
    connection.query(sql, function (error, results) {
        if (error) throw error;
        log.debug(dateFormat(new Date(), "dd/mm/yyyy H:MM:ss"), name, 'updated to:', state);
    });
}

function updateESPState(name, state) {
    let sqlESPConnect = 'UPDATE esp SET state=? WHERE name=?';
    let params = [state, name];
    sql = mysql.format(sqlESPConnect, params);
    connection.query(sql, function (error, results) {
        if (error) throw error;
        log.debug(name, 'updated to:', state);
    });
}

function insert_message(name, message) {
    let sql = 'INSERT INTO data (??, ??, ??) VALUES (?, ?, NOW())';
    let params = ['name', 'value', 'date', name, message];
    sql = mysql.format(sql, params);
    connection.query(sql, function (error, results) {
        if (error) throw error;
        log.debug(dateFormat(new Date(), "dd/mm/yyyy H:MM:ss"), 'Record inserted');
    });
}

// Start program
server = new server.Server(settings, function () {
});

server.on('ready', function () {
    log.info(dateFormat(new Date(), "dd/mm/yyyy H:MM:ss"), 'Mosca server is up and running');
});
server.on('published', publish);
server.on('subscribed', function (topic) {
    log.info(dateFormat(new Date(), "dd/mm/yyyy H:MM:ss"), 'Subscribed', topic);
});
server.on('unsubscribed', function (topic) {
    log.info(dateFormat(new Date(), "dd/mm/yyyy H:MM:ss"), 'Unsubscribed', topic);
});
server.on('clientConnected', function (client) {
    log.info(dateFormat(new Date(), "dd/mm/yyyy H:MM:ss"), 'Client connected', client.id);
    updateESPConnected(client.id, true);
});
server.on('clientDisconnected', function (client) {
    log.info(dateFormat(new Date(), "dd/mm/yyyy H:MM:ss"), 'Client disconnected', client.id);
    updateESPConnected(client.id, false);
});

function publish(packet, client, cb) {
    if (packet.topic.indexOf('iot:') === 0) {
        log.info(dateFormat(new Date(), "dd/mm/yyyy H:MM:ss"), 'publish', packet.topic.split(':')[1]);
        let substr = packet.topic.split(':')[1];
        insert_message(substr, packet.payload);
    }
    if (packet.topic.indexOf('ventilation') === 0) {
        log.deug(dateFormat(new Date(), "dd/mm/yyyy H:MM:ss"), 'Ventilation', packet.payload.toString());
        let bstate = parseInt(packet.payload);
        updateESPState('ESP Extracteur 1', bstate);
        updateESPState('ESP Extracteur 2', bstate);
    }
}
