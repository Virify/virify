export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);
  return await loginAgent(event, email, password);
});
