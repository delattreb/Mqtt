let mysql = require('mysql')

let credential = require(`${rootPath}/config/credentials`)
let logger = require('./logger')

let connection = mysql.createConnection(credential.db)
connection.connect(function () {
    logger.info('Database Connected')
})

/*------------------------------------------------------------------------------------------------
|  Function AddRegulation
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function AddRegulation(tag, date, name, state) {
    let reqsql = 'INSERT INTO regulation (tag, date, name, state) VALUES (?, ?, ?, ?)'
    let params = [tag, date, name, state]
    execSQL(req, params, function (results) {})
}

/*------------------------------------------------------------------------------------------------
|  Function getthreshold
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function getthreshold() {
    let reqsql = 'SELECT threshold FROM configuration WHERE name=? LIMIT 1'
    let params = [env.location]
    execSQL(req, params, function (results) {
        return parseInt(results[0].threshold)
    })
}

/*------------------------------------------------------------------------------------------------
|  Function getgap
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function getgap() {
    let reqsql = 'SELECT gap FROM configuration WHERE name=? LIMIT 1'
    let params = [env.location]
    execSQL(req, params, function (results) {
        return parseInt(results[0].gap)
    })
}

/*------------------------------------------------------------------------------------------------
|  Function updateESPConnected
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function updateESPConnected(name, connected) {
    let reqsql = 'UPDATE esp SET connected=? WHERE name=?'
    let params = [connected, name]
    execSQL(req, params, function (results) {})
}

/*------------------------------------------------------------------------------------------------
|  Function updateESPState
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function updateESPState(name, state) {
    let reqsql = 'UPDATE esp SET state=? WHERE name=?'
    let params = [state, name]
    execSQL(req, params, function (results) {})
}

/*------------------------------------------------------------------------------------------------
|  Function insert_message
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function insert_message(name, message) {
    let reqsql = 'INSERT INTO data (??, ??, ??) VALUES (?, ?, NOW())'
    let params = ['name', 'value', 'date', name, message]
    execSQL(req, params, function (results) {})
}

/*------------------------------------------------------------------------------------------------
|  Function execSQL
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function execSQL(req, params, callback) {
    sql = mysql.format(req, params)
    connection.query(sql, function (err, results) {
        if (err) {
            logger.error('MySQL connection error')
            throw err
        }
        return callback(results)
    })
}

module.exports = {
    updateESPConnected,
    updateESPState,
    insert_message,
    AddRegulation,
    getgap,
    getthreshold
}