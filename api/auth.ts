import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
const AUTH_URL = 'https://identitytoolkit.googleapis.com/v1';

export type AuthErrorCode =
    | 'AUTH/EMAIL_EXISTS'
    | 'AUTH/INVALID_CREDENTIALS'
    | 'AUTH/INVALID_PASSWORD'
    | 'AUTH/USER_DISABLED'
    | 'AUTH/TOO_MANY_REQUESTS'
    | 'AUTH/NETWORK_ERROR'
    | 'AUTH/SERVICE_UNAVAILABLE'
    | 'AUTH/UNKNOWN';

export class AuthApiError extends Error {
    code: AuthErrorCode;

    constructor(code: AuthErrorCode, message: string) {
        super(message);
        this.code = code;
        this.name = 'AuthApiError';
    }
}

export async function createUser(email: string, password: string) {
    return await authenticate('signUp', email, password);
}

export async function login(email: string, password: string) {
    return await authenticate('signInWithPassword', email, password);
}

type AuthMode = 'signInWithPassword' | 'signUp';

type AuthResponseData = {
    idToken: string;
    localId: string;
    email: string;
};

async function authenticate(mode: AuthMode, email: string, password: string) {
    if (!API_KEY) {
        throw new AuthApiError(
            'AUTH/SERVICE_UNAVAILABLE',
            'Authentication is not configured. Set EXPO_PUBLIC_FIREBASE_API_KEY and restart Expo.'
        );
    }

    try {
        const response = await axios.post<AuthResponseData>(
            `${AUTH_URL}/accounts:${mode}?key=${API_KEY}`,
            {
                email,
                password,
                returnSecureToken: true,
            }
        );

        return response.data;
    } catch (error) {
        throw mapToAuthError(error, mode);
    }
}

function mapToAuthError(error: unknown, mode: AuthMode): AuthApiError {
    if (axios.isAxiosError(error)) {
        const firebaseCode = error.response?.data?.error?.message;
        
        switch (firebaseCode) {
            case 'EMAIL_EXISTS':
                return new AuthApiError(
                    'AUTH/EMAIL_EXISTS',
                    'An account already exists for this email address.'
                );
            case 'INVALID_LOGIN_CREDENTIALS':
            case 'EMAIL_NOT_FOUND':
                return new AuthApiError(
                    'AUTH/INVALID_CREDENTIALS',
                    'The email or password you entered is not correct.'
                );
            case 'INVALID_PASSWORD':
                return new AuthApiError(
                    'AUTH/INVALID_PASSWORD',
                    'The password you entered is not correct.'
                );
            case 'USER_DISABLED':
                return new AuthApiError(
                    'AUTH/USER_DISABLED',
                    'This account has been disabled. Contact support for help.'
                );
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                return new AuthApiError(
                    'AUTH/TOO_MANY_REQUESTS',
                    'Too many failed attempts. Please try again later.'
                );
            default:
                if (!error.response) {
                    return new AuthApiError(
                        'AUTH/NETWORK_ERROR',
                        'Unable to reach the authentication service. Check your connection and try again.'
                    );
                }

                const isLoginMode = mode === 'signInWithPassword';
                return new AuthApiError(
                    'AUTH/UNKNOWN',
                    isLoginMode
                        ? 'Login failed. Please try again.'
                        : 'Account creation failed. Please try again.'
                );
        }
    }

    return new AuthApiError(
        'AUTH/SERVICE_UNAVAILABLE',
        'Authentication is temporarily unavailable. Please try again.'
    );
}