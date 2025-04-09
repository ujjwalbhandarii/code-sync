'use client';

import { Button } from '@/components/ui/button';

const LoginPage = () => {
  const handleGoogleLogin = () => {
    window.open('http://localhost:3000/api/auth/google');
  };

  return (
    <div>
      <Button onClick={handleGoogleLogin}>Login with Google</Button>
    </div>
  );
};

export default LoginPage;
