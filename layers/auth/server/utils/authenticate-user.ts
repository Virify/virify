/**
 * Authenticates the user by validating email and password.
 * @param event - The H3 event object.
 * @param email - The email of the user attempting to log in.
 * @param password - The password of the user attempting to log in.
 * @param isAgentLogin - A boolean indicating if the login is for an agent.
 * @returns A User.
 */
export async function authenticateUser(email: string, password: string) {
  const user = await findUser(email);

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: "User not found"});
  }

  if(!user.password) {
    throw createError({ statusCode: 403, statusMessage: "Login failed", message: "User has no password set" });
  }

  // Check if user is admin with basic auth
  if(isAdmin(user, password)) {
    return user;
  }
  
  const passwordVerified = await verifyPassword(user.password as string, password);
  
  if (!passwordVerified) throw createError({ statusCode: 401, statusMessage: "Password incorrect", message: "Password does not match" });

  return user;
}

/**
 * Admin only function to check if the user is an admin using basic auth.
 * Compares the provided password against the plain-text admin password from config.
 * 
 * @param user - The user object to check.
 * @param password - The plain-text password provided during login.
 * @returns true if user is admin and password matches, false otherwise.
 */
function isAdmin(user: User, password: string): boolean {
  const config = useRuntimeConfig();
  
  // Check if email matches admin email and provided password matches admin password
  if(user.email === config.ADMIN_EMAIL && password === config.ADMIN_PASSWORD) {
    return true;
  }
  
  return false;
}