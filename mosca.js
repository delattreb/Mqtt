let mysql = require('mysql');
let mosca = require('mosca');

const LOG = true;

let connection;

let settings = {
    port: 1883,
    persistence: mosca.persistence.Memory
};

let db_config = {
    host: 'mycube.dscloud.me',
    user: 'usermqtt',
    password: 'infected',
    database: 'mqtt',
    port: 3307
};

// MySQL
connection = mysql.createConnection(db_config);

connection.connect(function () {
    console.log('Database Connected');
});

function updateESPConnected(name, state) {
    let sqlESPConnect = 'UPDATE esp SET connected=? WHERE name=?';
    let params = [state, name];
    sql = mysql.format(sqlESPConnect, params);
    connection.query(sql, function (error, results) {
        if (error) throw error;
        if (LOG) console.log('ESP', name, 'updated to:', state);
    });
}

function updateESPState(name, state) {
    let sqlESPConnect = 'UPDATE esp SET state=? WHERE name=?';
    let params = [state, name];
    sql = mysql.format(sqlESPConnect, params);
    connection.query(sql, function (error, results) {
        if (error) throw error;
        if (LOG) console.log('ESP', name, 'updated to:', state);
    });
}
function insert_message(name, message) {
    let sql = 'INSERT INTO ?? (??, ??, ??) VALUES (?, ?, NOW())';
    let params = ['data', 'name', 'value', 'date', name, message];
    sql = mysql.format(sql, params);
    connection.query(sql, function (error, results) {
        if (error) throw error;
        if (LOG) console.log('Record inserted', results);
    });
}

// Start program
let server = new mosca.Server(settings, function () {
});

server.on('ready', function () {
    console.log('Mosca server is up and running');
});
server.on('published', publish);
server.on('subscribed', function (topic) {
    if (LOG) console.log('Subscribed', topic);
});
server.on('unsubscribed', function (topic) {
    if (LOG) console.log('Unsubscribed', topic);
});
server.on('clientConnected', function (client) {
    if (LOG) console.log('Client connected', client.id);
    updateESPConnected(client.id, true);
});
server.on('clientDisconnected', function (client) {
    if (LOG) console.log('Client disconnected', client.id);
    updateESPConnected(client.id, false);
});

function publish(packet, client, cb) {
    /*let newPacket = {
        topic: packet.topic,
        payload: packet.payload,
    };*/
    if (packet.topic.indexOf('iot:') === 0) {
        let substr = packet.topic.split(':')[1];
        insert_message(substr, packet.payload);
        if (LOG) console.log('publish', client.id, substr);
    }
}
