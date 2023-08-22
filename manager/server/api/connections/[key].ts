import { getConnection } from "../../data/connections";

export default defineEventHandler(async (e) => {
  const response = await getConnection(e.context.params?.key as string);

  return response;
});
