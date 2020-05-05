import moment from 'moment'

const dateTo = new Date()
const dateFrom = moment().subtract(3, 'years').toDate()

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