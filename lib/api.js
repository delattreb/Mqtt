let env = require(`${rootPath}/config/env`)
let logger = require('./logger')
let request = require('request')
let dateFormat = require('dateformat')


/*------------------------------------------------------------------------------------------------
|  Function updateESP
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function updateESP(name, connected) {
    logger.debug('http://' + env.api.url + ':' + env.api.port + '/updateESP' + ' ' + name + ' ' + connected)
    request.post({
        'headers': { 'content-type': 'application/json' },
        'url': 'http://' + env.api.url + ':' + env.api.port + '/updateESP',
        'body': JSON.stringify({
            'name': name,
            'connected': connected
        })
    }, (err, response, body) => {
        if (err) {
            return console.log(err);
        }
        //console.log(JSON.parse(response));
    })
}

/*------------------------------------------------------------------------------------------------
|  Function insertValue
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function insertData(name, value) {
    logger.debug('http://' + env.api.url + ':' + env.api.port + '/insertData' + ' ' + name + ' ' + value)
    let date = dateFormat(new Date(), 'yyyy/mm/dd H:MM:ss')
    request.post({
        'headers': { 'content-type': 'application/json' },
        'url': 'http://' + env.api.url + ':' + env.api.port + '/insertData',
        'body': JSON.stringify({
            'name': name,
            'value': value,
            'date': date
        })
    }, (err, response, body) => {
        if (err) {
            return console.log(err);
        }
        //console.log(JSON.parse(response));
    })
}

/*------------------------------------------------------------------------------------------------
|  Function insertRegulation
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function insertRegulation(name, tag, state) {
    logger.debug('http://' + env.api.url + ':' + env.api.port + '/regulation' + ' ' + name + ' ' + tag + ' ' + state)
    let date = dateFormat(new Date(), 'yyyy/mm/dd H:MM:ss')
    request.post({
        'headers': { 'content-type': 'application/json' },
        'url': 'http://' + env.api.url + ':' + env.api.port + '/regulation',
        'body': JSON.stringify({
            'name': name,
            'date': date,
            'tag': tag,
            'state': state
        })
    }, (err, response, body) => {
        if (err) {
            return console.log(err);
        }
        //console.log(JSON.parse(response));
    })
}

/*------------------------------------------------------------------------------------------------
|  Function getGap
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function getGap(cb) {
    request.get('http://' + env.api.url + ':' + env.api.port + '/configuration/1', function (err, response, body) {
        if (err) {
            return console.log(err);
        }
        cb(JSON.parse(body).gap)
    })
}

/*------------------------------------------------------------------------------------------------
|  Function getTheshold
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function getThreshold(cb) {
    request.get('http://' + env.api.url + ':' + env.api.port + '/configuration/1', function (err, response, body) {
        if (err) {
            return console.log(err);
        }
        cb(JSON.parse(body).threshold)
    })
}

/*
request.get('http://127.0.0.1:1337/customer', function (err, response, body) {
    if (err) {
        console.log('Request' + err)
        throw err
    }
    console.log(JSON.parse(body))
})
*/

module.exports = {
    updateESP,
    insertData,
    insertRegulation,
    getGap,
    getThreshold
}