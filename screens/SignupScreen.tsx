import { useState, useContext } from 'react';
import { Alert } from 'react-native';


import AuthContent from 'components/Auth/AuthContent';
import { AuthApiError, createUser } from 'api/auth';
import { LoadingOverlay } from 'components/ui/LoadingOverlay';
import { AuthContext } from 'store/auth-context';


export function SignupScreen() {
  const [authenticating, setAuthenticating] = useState(false);
  const authContext = useContext(AuthContext);

  async function signupHandler(credentials: { email: string; password: string }) {
    setAuthenticating(true);

    try {
      const response = await createUser(credentials.email, credentials.password);
      authContext.authenticate(response.idToken);
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
