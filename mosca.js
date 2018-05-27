var mosca = require('mosca');
var mysql = require('mysql');

var settings = {
    port: 1883,
    persistence: mosca.persistence.Memory
};

var connection = mysql.createConnection({
    host: "192.168.56.103",
    port: "3307",
    user: "root",
    password: "root",
    database: "mqtt"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
});

var server = new mosca.Server(settings, function () {
    console.log('Mosca server is up and running')
});

server.published = function (packet, client, cb) {
    if (packet.topic.indexOf('echo') === 0) {
        return cb();
    }

    var newPacket = {
        topic: packet.topic,
        payload: packet.payload,
    };
    if (packet.topic.indexOf('Temperature') === 0) {
        // Copy payload data

        insert_message(packet.payload);
        console.log('newPacket', newPacket);
    }
};

function insert_message(message) {
    var sql = "INSERT INTO ?? (??, ??, ??) VALUES (?, ?, NOW())";
    var params = ['datast', 'temperature', 'humidite', 'date', message, message];
    sql = mysql.format(sql, params);
    connection.query(sql, function (error, results) {
        if (error) throw error;
        console.log("1 record inserted");
    });
};