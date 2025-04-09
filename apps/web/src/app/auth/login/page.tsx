'use client';

import { Button } from '@/components/ui/button';

const LoginPage = () => {
  const handleGoogleLogin = () => {
    window.open('http://localhost:8080/auth/google');
  };

  return (
    <div className='m-10'>
      <Button
        onClick={handleGoogleLogin}
        className='cursor-pointer bg-black text-white'
      >
        Login with Google
      </Button>
    </div>
  );
};

export default LoginPage;
