# React Native Auth App (Expo + Firebase)

This app demonstrates a complete mobile authentication flow using Expo, React Navigation, Firebase Authentication (Identity Toolkit REST API), and a Firebase Realtime Database endpoint that requires authentication.

## What The App Does

- Lets users sign up with email/password.
- Lets existing users log in.
- Stores the auth token locally so sessions survive app restarts.
- Restores the stored token on app launch before the first screen renders.
- Shows an authenticated screen that fetches protected data from Firebase.
- Supports logout, which clears both in-memory auth state and persisted token.

## Auth Architecture

### 1) Firebase Authentication

The app calls Firebase Identity Toolkit endpoints:

- `accounts:signUp` to create a user
- `accounts:signInWithPassword` to log in

Both return an `idToken`. That token is the proof of authentication used for protected backend requests.

### 2) Context-Based Auth State

`AuthContext` holds:

- `token`
- `isAuthenticated`
- `authenticate(token)`
- `logout()`

`authenticate` saves token to context and `AsyncStorage`.
`logout` clears token from context and `AsyncStorage`.

### 3) Startup Token Restore + Splash Screen

On app start, splash is kept visible while startup auth restore runs:

1. Read `token` from `AsyncStorage`
2. If present, pass it to context
3. Hide splash screen
4. Render navigation

This prevents flicker between unauthenticated and authenticated stacks.

### 4) Protected Backend Access

After login, the app requests data from Firebase Realtime Database using the auth token:

- `GET /message.json?auth=<idToken>`

If the token is valid and database rules require auth, the request succeeds.

## Error Handling

The auth API maps Firebase and network failures to user-facing errors:

- `AUTH/EMAIL_EXISTS`
- `AUTH/INVALID_CREDENTIALS`
- `AUTH/INVALID_PASSWORD`
- `AUTH/USER_DISABLED`
- `AUTH/TOO_MANY_REQUESTS`
- `AUTH/NETWORK_ERROR`
- `AUTH/SERVICE_UNAVAILABLE`
- `AUTH/UNKNOWN`

Screens display both a readable code and message so users can understand what failed.

## Environment Variables

This project reads the Firebase API key from:

- `EXPO_PUBLIC_FIREBASE_API_KEY`

Create `.env.local` in project root:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_web_api_key
```

Then restart Expo after changing env values.

## Firebase Backend Setup Notes

Use your Firebase project values for auth and database.

For Realtime Database, example rules that require authentication:

```json
{
	"rules": {
		".read": "auth != null",
		".write": "auth != null"
	}
}
```

With rules like these, unauthenticated requests are denied.

## Run The App

1. Install dependencies:

```bash
npm install
```

2. Start Expo:

```bash
npx expo start
```

3. Run on iOS/Android simulator or Expo Go.

## Tech Stack

- Expo SDK 54
- React Native
- TypeScript
- React Navigation (native stack)
- Firebase Auth (Identity Toolkit REST)
- Firebase Realtime Database
- AsyncStorage
- Axios