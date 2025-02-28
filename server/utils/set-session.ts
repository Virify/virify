import { H3Event } from "h3";

export default async function setSession(event: H3Event, user: any, isAgent: boolean) {
  // clear any existing session
  await clearUserSession(event);
  // set the new session
  return await setUserSession(event, {
    user: {
      id: user.id,
      email: user.email,
      username: user.username || user.email || user.firstName,
      agent: isAgent,
    },
    loggedIn: true,
    loggedInAt: new Date(),
  });
}
