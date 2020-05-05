import axios from 'axios'
import moment from 'moment'
import { apiHost } from '../config/api'

export function getClaims(dateFrom=new Date(), dateTo=new Date(), limit=100, offset=0) {    
  return axios.get(`${apiHost}/medicalclaim?limit=${limit}&offset=${offset}&datefrom=${moment(dateFrom).format('YYYY-MM-DD')}&dateto=${moment(dateTo).format('YYYY-MM-DD')}`)
}

export function getClaim(claimNo) {    
  return axios.get(`${apiHost}/medicalclaim/${claimNo}`)
}

export function getAutoClaimDistribution(dateFrom=new Date(), dateTo=new Date()) {    
  return axios.get(`${apiHost}/medicalclaim/autoclaimdistribution?datefrom=${moment(dateFrom).format('YYYY-MM-DD')}&dateto=${moment(dateTo).format('YYYY-MM-DD')}`)
}

export function getClaimStatusDistribution(dateFrom=new Date(), dateTo=new Date()) {    
  return axios.get(`${apiHost}/medicalclaim/statusdistribution?datefrom=${moment(dateFrom).format('YYYY-MM-DD')}&dateto=${moment(dateTo).format('YYYY-MM-DD')}`)
}

export function bulkInsertClaims(numToInsert) {    
  return axios.post(`${apiHost}/medicalclaim/bulk-insert`, {
    numToInsert
  })
}