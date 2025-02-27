export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);
  return await loginUser(event, email, password, 'user');
});