import AuthContent from 'components/Auth/AuthContent';
import { useState } from 'react';
import { login } from 'api/auth';
import { LoadingOverlay } from 'components/ui/LoadingOverlay';

export function LoginScreen() {
  async function loginHandler(credentials: { email: string; password: string }) {
    setAuthenticating(true);
    const user = await login(credentials.email, credentials.password);
    setAuthenticating(false);
  }

  const [authenticating, setAuthenticating] = useState(false);

  if (authenticating) {
    return <LoadingOverlay message="Logging in..." />;
  }

  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}
