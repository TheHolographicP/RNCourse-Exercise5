import axios from "axios";

const API_KEY = 'AIzaSyBHI0-xeO8mCEhg9kBRU5ogPlELMTHhz_4'
const AUTH_URL = `https://identitytoolkit.googleapis.com/v1`;

export async function createUser(email: string, password: string) {
    const request = await axios.post(`${AUTH_URL}/accounts:signUp?key=${API_KEY}`, {
        email: email,
        password: password,
        returnSecureToken: true,
    });
    return request;
}