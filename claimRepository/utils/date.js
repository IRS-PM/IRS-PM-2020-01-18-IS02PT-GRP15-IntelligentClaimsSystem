const moment = require('moment') 

function formatDateForClassification (date) {
    const momentDate = moment(date)
    if (!momentDate.isValid()) return null
    return momentDate.format('DD MM YY')
}

module.exports = {
    formatDateForClassification
}