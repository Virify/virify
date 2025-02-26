declare module "#auth-utils" {
  interface User {
    id?: number;
    username?: string;
    email: string;
    agent?: string;
  }
}

export {};
