import { useState } from 'react';
import { Alert } from 'react-native';


import AuthContent from 'components/Auth/AuthContent';
import { AuthApiError, createUser } from 'api/auth';
import { LoadingOverlay } from 'components/ui/LoadingOverlay';



export function SignupScreen() {
  const [authenticating, setAuthenticating] = useState(false);

  async function signupHandler(credentials: { email: string; password: string }) {
    setAuthenticating(true);

    try {
      await createUser(credentials.email, credentials.password);
    } catch (error) {
      const authError =
        error instanceof AuthApiError
          ? error
          : new AuthApiError(
              'AUTH/UNKNOWN',
              'Account creation failed. Please try again.'
            );

      Alert.alert(authError.code, authError.message);
    } finally {
      setAuthenticating(false);
    }
  }

  if (authenticating) {
    return <LoadingOverlay message="Creating user..." />;
  }

  return <AuthContent isLogin={false} onAuthenticate={signupHandler} />;
}
