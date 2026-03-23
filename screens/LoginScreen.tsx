import AuthContent from 'components/Auth/AuthContent';

export function LoginScreen() {
  function loginHandler(credentials: { email: string; password: string }) {
    console.log('login credentials', credentials);
  }

  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}
