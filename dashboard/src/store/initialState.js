import moment from 'moment'

const dateTo = new Date()
const dateFrom = moment().subtract(2, 'weeks').toDate()

export default {
    nav: {
        isOpen: false
    },
    toastMessages: [],
    dateRange: {
        from: dateFrom,
        to: dateTo
    }
};