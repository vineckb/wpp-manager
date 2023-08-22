export default defineEventHandler(async (e) => {
  const body = await readRawBody(e);
  const { password } = JSON.parse(body as string);

  if (password === process.env.pwd) {
    return "ok";
  }

  return "";
});
