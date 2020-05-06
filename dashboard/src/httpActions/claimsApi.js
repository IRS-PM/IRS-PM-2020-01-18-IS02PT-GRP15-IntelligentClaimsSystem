import axios from 'axios'
import moment from 'moment'
import { apiHost } from '../config/api'

export function getClaims(dateFrom=new Date(), dateTo=new Date(), limit=100, offset=0) {    
  return axios.get(`${apiHost}/medicalclaim`, {
    params: {
      datefrom: moment(dateFrom).hours(0).minutes(0).seconds(0).toDate(),
      dateto: moment(dateTo).hours(23).minutes(59).seconds(59).toDate(),
      limit: limit,
      offset: offset
    }
  })
}

export function getClaim(claimNo) {    
  return axios.get(`${apiHost}/medicalclaim/${claimNo}`)
}

export function getAutoClaimDistribution(dateFrom=new Date(), dateTo=new Date()) {    
  return axios.get(`${apiHost}/medicalclaim/autoclaimdistribution`, {
    params: {
      datefrom: moment(dateFrom).hours(0).minutes(0).seconds(0).toDate(),
      dateto: moment(dateTo).hours(23).minutes(59).seconds(59).toDate()
    }
  })
}

export function getClaimStatusDistribution(dateFrom=new Date(), dateTo=new Date()) {    
  return axios.get(`${apiHost}/medicalclaim/statusdistribution`, {
    params: {
      datefrom: moment(dateFrom).hours(0).minutes(0).seconds(0).toDate(),
      dateto: moment(dateTo).hours(23).minutes(59).seconds(59).toDate()
    }
  })
}

export function bulkInsertClaims(numToInsert) {    
  return axios.post(`${apiHost}/medicalclaim/bulk-insert`, {
    numToInsert
  })
}