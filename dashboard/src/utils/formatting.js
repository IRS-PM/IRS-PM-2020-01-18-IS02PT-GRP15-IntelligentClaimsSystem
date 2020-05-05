import moment from 'moment'

export const formatDate = (date) => {
  return moment(date).format('LLL')
}

export const formatMoney = (amount) => {
  return '$' + (amount).toLocaleString()
}