let mysql = require('mysql')

let credential = require(`${rootPath}/config/credentials`)
let logger = require('./logger')

let sqlconnection = mysql.createConnection(credential.db)
sqlconnection.connect(function (err) {
    if (err) {
        logger.error('MYSQL DB ' + credential.db.database + ' on port ' + credential.db.port)
        throw err
    } else
        logger.info('MYSQL connection error ' + credential.db.database + ' on port ' + credential.db.port)
})

/*------------------------------------------------------------------------------------------------
|  Function AddRegulation
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function AddRegulation(tag, date, name, state) {
    let req = 'INSERT INTO regulation (tag, date, name, state) VALUES (?, ?, ?, ?)'
    let params = [tag, date, name, state]
    execSQL(req, params, function (results) {})
}

/*------------------------------------------------------------------------------------------------
|  Function getthreshold
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function getthreshold(name, cb) {
    let req = 'SELECT threshold FROM configuration WHERE name=? LIMIT 1'
    let params = [name]
    execSQL(req, params, function (results) {
        cb(parseInt(results[0].threshold))
    })
}

/*------------------------------------------------------------------------------------------------
|  Function getgap
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function getgap(name, cb) {
    let req = 'SELECT gap FROM configuration WHERE name=? LIMIT 1'
    let params = [name]
    execSQL(req, params, function (results) {
        cb(parseInt(results[0].gap))
    })
}

/*------------------------------------------------------------------------------------------------
|  Function updateESPConnected
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function updateESPConnected(name, connected) {
    let req = 'UPDATE esp SET connected=? WHERE name=?'
    let params = [connected, name]
    execSQL(req, params, function (results) {})
}

/*------------------------------------------------------------------------------------------------
|  Function updateESPState
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function updateESPState(name, state) {
    let req = 'UPDATE esp SET state=? WHERE name=?'
    let params = [state, name]
    execSQL(req, params, function (results) {})
}

/*------------------------------------------------------------------------------------------------
|  Function insert_message
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function insert_message(name, message) {
    let req = 'INSERT INTO data (??, ??, ??) VALUES (?, ?, NOW())'
    let params = ['name', 'value', 'date', name, message]
    execSQL(req, params, function (results) {})
}

/*------------------------------------------------------------------------------------------------
|  Function execSQL
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function execSQL(req, params, cb) {
    sql = mysql.format(req, params)
    sqlconnection.query(sql, function (err, results) {
        if (err) {
            logger.error('MySQL connection error')
            throw err
        }
        return cb(results)
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