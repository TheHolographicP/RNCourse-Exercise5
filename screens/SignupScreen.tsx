import AuthContent from 'components/Auth/AuthContent';

export function SignupScreen() {
  function signupHandler(credentials: { email: string; password: string }) {
    console.log('signup credentials', credentials);
  }

  return <AuthContent isLogin={false} onAuthenticate={signupHandler} />;
}
