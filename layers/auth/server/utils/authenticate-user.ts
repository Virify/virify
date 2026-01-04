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
  
  const passwordVerified = await verifyPassword(user.password as string, password);
  
  if (!passwordVerified) throw createError({ statusCode: 401, statusMessage: "Password incorrect", message: "Password does not match" });

  return user;
}