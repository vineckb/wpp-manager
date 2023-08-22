import { getConnections } from "../../data/connections";

export default defineEventHandler(async (e) => {
  const response = await getConnections();

  return response;
});
