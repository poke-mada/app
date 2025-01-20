let BASE_URL;
const DEV = false;
if (DEV) {
    BASE_URL = 'http://localhost:8000';
} else {
    BASE_URL = 'https://pokemon.para-mada.com';
}
export const SERVER_URL = BASE_URL;
export const IS_DEV = DEV;