declare module "#auth-utils" {
  interface User {
    id?: number;
    username?: string;
    firstName?: string;
    email: string;
    role: string;
  }
}

export { User };
