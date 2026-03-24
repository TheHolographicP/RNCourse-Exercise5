import { useState } from 'react';


import AuthContent from 'components/Auth/AuthContent';
import { createUser } from 'api/auth';
import { LoadingOverlay } from 'components/ui/LoadingOverlay';



export function SignupScreen() {
  const [authenticating, setAuthenticating] = useState(false);

  async function signupHandler(credentials: { email: string; password: string }) {
    setAuthenticating(true);
    const user = await createUser(credentials.email, credentials.password);
    setAuthenticating(false);
  }

  if (authenticating) {
    return <LoadingOverlay message="Creating user..." />;
  }

  return <AuthContent isLogin={false} onAuthenticate={signupHandler} />;
}
