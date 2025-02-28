declare module "#auth-utils" {
  interface User {
    id?: number;
    username?: string;
    firstName?: string;
    email: string;
    agent?: boolean;
  }
}

export { User };
