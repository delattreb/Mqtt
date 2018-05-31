var mosca = require('mosca');
var mysql = require('mysql');

const LOG = true;
const INFO = false;

var settings = {
    port: 1883,
    persistence: mosca.persistence.Memory
};

var connection = mysql.createConnection({
    host: 'mycube.dscloud.me',
    user: 'usermqtt',
    password: 'infected',
    database: 'mqtt',
    port: 3307
});

connection.connect(function (err) {
    if (err) throw err;
    console.log('Database Connected!');
});

var server = new mosca.Server(settings, function () {
    console.log('Mosca server is up and running')
});

server.published = function (packet, client, cb) {
    if (packet.topic.indexOf('echo') === 0) {
        return cb();
    }
    if (LOG) console.log('LOG:', packet);

    var newPacket = {
        topic: packet.topic,
        payload: packet.payload,
    };
    if (packet.topic.indexOf('iot:') === 0) {
        var substr = packet.topic.split(':')[1];
        insert_message(substr, packet.payload);
        if (INFO) console.log('TOPIC:', newPacket);
    }
};

function insert_message(name, message) {
    var sql = 'INSERT INTO ?? (??, ??, ??) VALUES (?, ?, NOW())';
    var params = ['data', 'name', 'value', 'date', name, message];
    sql = mysql.format(sql, params);
    connection.query(sql, function (error, results) {
        if (error) throw error;
        console.log('1 record inserted');
    });
}