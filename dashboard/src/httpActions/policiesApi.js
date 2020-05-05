import axios from 'axios'
import { apiHost } from '../config/api'

export function getPolicies(limit=100, offset=0) {    
  return axios.get(`${apiHost}/healthpolicy?limit=${limit}&offset=${offset}`)
}

export function getPolicy(policyNo) {    
  return axios.get(`${apiHost}/healthpolicy/${policyNo}`)
}