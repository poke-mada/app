import axios from "axios";
import {SERVER_URL} from '@/stores/constants'

export const session = axios.create({
    baseURL: SERVER_URL
});
