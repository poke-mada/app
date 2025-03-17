import axios from 'axios';
import {SERVER_URL} from '@/stores/constants';
import {createPinia} from 'pinia';
import mitt from 'mitt';

export default createPinia()

export const session = axios.create({
    baseURL: SERVER_URL,
    headers: {
        'Authorization': `Token ${localStorage.getItem('api_token')}`
    }
});

export const login_session = axios.create({
    baseURL: SERVER_URL,
});

export const emitter = mitt();