type LoginParams = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  user: {
    email: string;
  };
};

export async function login({ email, password }: LoginParams): Promise<LoginResponse> {
  // API呼び出しのモック
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token: 'mock-jwt-token',
        user: {
          email,
        },
      });
    }, 1000);
  });
}
