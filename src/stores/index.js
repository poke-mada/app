import axios from 'axios';
import {SERVER_URL} from '@/stores/constants';
import {createPinia} from 'pinia';
import mitt from 'mitt';

export default createPinia()

let custom_session = null;

export function getAxios() {
    const {useGameStore} = require('@/stores/app');
    if (custom_session !== null) {
        return custom_session
    }

    let store = useGameStore()
    custom_session = axios.create({
        baseURL: SERVER_URL,
        headers: {
            'Authorization': `Token ${store.api_token}`
        }
    })

    return custom_session
}

export const login_session = axios.create({
    baseURL: SERVER_URL,
});

export const emitter = mitt();