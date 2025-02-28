export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);
  return await loginOwner(event, email, password);
});