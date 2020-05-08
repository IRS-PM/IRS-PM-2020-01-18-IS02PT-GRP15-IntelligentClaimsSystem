import axios from 'axios'
import { apiHost, distributerApiHost } from '../config/api'
import moment from 'moment'

export function getStaffList(limit=100, offset=0) {    
  return axios.get(`${apiHost}/staff?limit=${limit}&offset=${offset}`)
}

export function getStaffAvailability(date=new Date()) {    
  return axios.get(`${apiHost}/staff/availability?date=${moment(date).format('YYYY-MM-DD')}&limit=10`)
}

export function getStaffDetails(id) {    
  return axios.get(`${apiHost}/staff/${id}`)
}

export function createLeave(staffId, startDateTime, endDateTime) {    
  return axios.post(`${apiHost}/staff/${staffId}/leave`, {
    StartDateTime: startDateTime,
    EndDateTime: endDateTime
  })
}

export function updateLeave(staffId, leaveId, startDateTime, endDateTime) {    
  return axios.put(`${apiHost}/staff/${staffId}/leave/${leaveId}`, {
    StartDateTime: startDateTime,
    EndDateTime: endDateTime
  })
}

export function deleteLeave(staffId, leaveId) {    
  return axios.delete(`${apiHost}/staff/${staffId}/leave/${leaveId}`)
}

export function distributeClaims() {    
  return axios.get(`${distributerApiHost}/distribute`)
}