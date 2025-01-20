import axios from 'axios'
import {SERVER_URL} from '@/stores/constants'

export const session = axios.create({
    baseURL: SERVER_URL,
    headers: {
        'Authorization': `Token ${localStorage.getItem('api_token')}`
    }
});

export const login_session = axios.create({
    baseURL: SERVER_URL,
});
