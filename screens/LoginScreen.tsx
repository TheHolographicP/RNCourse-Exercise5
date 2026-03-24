import AuthContent from 'components/Auth/AuthContent';
import { useState, useContext } from 'react';
import { Alert } from 'react-native';
import { AuthApiError, login } from 'api/auth';
import { LoadingOverlay } from 'components/ui/LoadingOverlay';
import { AuthContext } from 'store/auth-context';


export function LoginScreen() {
  const authContext = useContext(AuthContext);

  async function loginHandler(credentials: { email: string; password: string }) {
    setAuthenticating(true);

    try {
      const response = await login(credentials.email, credentials.password);
      authContext.authenticate(response.idToken);
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
