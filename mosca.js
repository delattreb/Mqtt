mysql = require('mysql');
mosca = require('mosca');

const LOG = true;

let settings = {
    port: 1883,
    persistence: mosca.persistence.Memory
};

let connection = mysql.createConnection({
    host: 'mycube.dscloud.me',
    user: 'usermqtt',
    password: 'infected',
    database: 'mqtt',
    port: 3307
});

// MySQL
connection.connect(function (err) {
    if (err) throw err;
    console.log('Database Connected!');
});

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
});
server.on('clientDisconnected', function (client) {
    if (LOG) console.log('Client disconnected', client.id);
});

function publish(packet, client, cb) {
    let newPacket = {
        topic: packet.topic,
        payload: packet.payload,
    };
    if (packet.topic.indexOf('iot:') === 0) {
        let substr = packet.topic.split(':')[1];
        insert_message(substr, packet.payload);
        if (LOG) console.log('publish', client.id, substr);
    }
}
