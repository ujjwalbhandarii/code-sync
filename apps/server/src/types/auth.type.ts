export type SignToken = {
  userId: string;
  email: string;
  role: string;
};

export type GetUser = {
  email: string;
  role?: string;
};

export type HashPassword = {
  password: string;
};

export type PasswordMatch = { loginPassword: string; userPassword: string };
