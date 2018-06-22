let mysql = require('mysql');
let mosca = require('mosca');

const LOG = false;
const INFO = true;

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
        if (INFO) console.log(name, 'updated to:', state);
    });
}

function updateESPState(name, state) {
    let sqlESPConnect = 'UPDATE esp SET state=? WHERE name=?';
    let params = [state, name];
    sql = mysql.format(sqlESPConnect, params);
    connection.query(sql, function (error, results) {
        if (error) throw error;
        if (LOG) console.log(name, 'updated to:', state);
    });
}

function insert_message(name, message) {
    let sql = 'INSERT INTO data (??, ??, ??) VALUES (?, ?, NOW())';
    let params = ['name', 'value', 'date', name, message];
    sql = mysql.format(sql, params);
    connection.query(sql, function (error, results) {
        if (error) throw error;
        if (LOG) console.log('Record inserted');
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
    if (INFO) console.log('Subscribed', topic);
});
server.on('unsubscribed', function (topic) {
    if (INFO) console.log('Unsubscribed', topic);
});
server.on('clientConnected', function (client) {
    if (INFO) console.log('Client connected', client.id);
    updateESPConnected(client.id, true);
});
server.on('clientDisconnected', function (client) {
    if (INFO) console.log('Client disconnected', client.id);
    updateESPConnected(client.id, false);
});

function publish(packet, client, cb) {
    if (packet.topic.indexOf('iot:') === 0) {
        if (INFO) console.log('publish', client.id, packet.topic.split(':')[1]);
        if (packet.topic.split(':')[1] !== 'ventilation') {
            let substr = packet.topic.split(':')[1];
            insert_message(substr, packet.payload);
        } else {
            let bstate;
            if (packet.topic.split(':')[1] === 0)
                bstate = false;
            else
                bstate = true;
            updateESPState('ESP Extracteur 1', bstate);
            updateESPState('ESP Extracteur 2', bstate);
            if (INFO) console.log('Ventilation', packet.topic.split(':')[1]);
        }
    }
}
