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
    throw createError({ statusCode: 404, statusMessage: "Login failed", message: "The email and password combination was incorrect, please check your details and try again" });
  }

  if(!user.password) {
    throw createError({ statusCode: 403, statusMessage: "Login failed", message: "The email and password combination was incorrect, please check your details and try again" });
  }
  
  const passwordVerified = await verifyPassword(user.password as string, password);
  
  if (!passwordVerified) throw createError({ statusCode: 401, statusMessage: "Login failed", message: "The email and password combination was incorrect, please check your details and try again" });

  return user;
}