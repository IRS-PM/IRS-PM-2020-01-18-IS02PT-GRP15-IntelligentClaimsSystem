import axios from 'axios'
import { httpApiSettings } from '../config/config'

export function uploadFile(type, file) {
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    return axios.post(`${httpApiSettings.host}/claim/uploadfile`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}