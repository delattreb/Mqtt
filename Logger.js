

let dateFormat = require('dateformat');
module.exports = {
    loginfo(level, domaine, message) {
        console.log(level, '-', 'Domaine:', domaine, 'Message:', message.toString(), "-", dateFormat(new Date(), "dd/mm/yyyy H:MM:ss"));
    }
}