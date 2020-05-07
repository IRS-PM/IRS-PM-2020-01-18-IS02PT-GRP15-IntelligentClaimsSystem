import axios from 'axios'
import { claimRepositoryApiSettings } from '../config/config'

export function getSampleMedicalPanel() {
    return axios.get(`${claimRepositoryApiSettings.host}/medicalpanel?limit=50&offset=1000`)
}

export function getSamplePolicyHolderIDs() {
    return axios.get(`${claimRepositoryApiSettings.host}/healthpolicy/sampleids?limit=100`)
}