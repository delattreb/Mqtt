let mysql = require('mysql');
let server = require('mosca');
let dateFormat = require('dateformat');
let log = require('loglevel');
let env = require('./env');
let connection;

log.setDefaultLevel(env.loglevel);

// MySQL
connection = mysql.createConnection(env.db);

connection.connect(function () {
    log.info(dateFormat(new Date(), "dd/mm/yyyy H:MM:ss"), 'Database Connected');
});

function updateESPConnected(name, state) {
    let reqsql = 'UPDATE esp SET connected=? WHERE name=?';
    let params = [state, name];
    procsql(reqsql, params);
}

function updateESPState(name, state) {
    let reqsql = 'UPDATE esp SET state=? WHERE name=?';
    let params = [state, name];
    procsql(reqsql, params);
}

function insert_message(name, message) {
    let reqsql = 'INSERT INTO data (??, ??, ??) VALUES (?, ?, NOW())';
    let params = ['name', 'value', 'date', name, message];
    procsql(reqsql, params);
}
function procsql(reqsql, params) {
    sql = mysql.format(reqsql, params);
    connection.query(sql, function (error, results) {
        if (error)
            throw error;
        log.debug(dateFormat(new Date(), "dd/mm/yyyy H:MM:ss"), results);
    });
}
// Start program
server = new server.Server(env.mosca, function () {
});

server.on('ready', function () {
    log.info(dateFormat(new Date(), "dd/mm/yyyy H:MM:ss"), 'Mosca server is up and running');
});
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
server.on('published', publish);
function publish(packet, client, cb) {
    if (packet.topic.indexOf('iot:') === 0) {
        log.info(dateFormat(new Date(), "dd/mm/yyyy H:MM:ss"), 'client', client.id, 'pub:', packet.topic.split(':')[1], 'value', packet.payload.toString());
        let substr = packet.topic.split(':')[1];
        insert_message(substr, packet.payload);
    }
    if (packet.topic.indexOf('ventilation') === 0) {
        log.debug(dateFormat(new Date(), "dd/mm/yyyy H:MM:ss"), 'client', client.id, 'ventilation', packet.payload.toString());
        let bstate = parseInt(packet.payload);
        updateESPState('ESP Extracteur 1', bstate);
        updateESPState('ESP Extracteur 2', bstate);
    }
}
