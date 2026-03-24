import AuthContent from 'components/Auth/AuthContent';
import { useState } from 'react';
import { Alert } from 'react-native';
import { AuthApiError, login } from 'api/auth';
import { LoadingOverlay } from 'components/ui/LoadingOverlay';

export function LoginScreen() {
  async function loginHandler(credentials: { email: string; password: string }) {
    setAuthenticating(true);

    try {
      await login(credentials.email, credentials.password);
    } catch (error) {
      const authError =
        error instanceof AuthApiError
          ? error
          : new AuthApiError('AUTH/UNKNOWN', 'Login failed. Please try again.');

      Alert.alert(authError.code, authError.message);
    } finally {
      setAuthenticating(false);
    }
  }

  const [authenticating, setAuthenticating] = useState(false);

  if (authenticating) {
    return <LoadingOverlay message="Logging in..." />;
  }

  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}
