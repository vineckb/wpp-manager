import { createInstance } from "~/services/wpp";
import { getConnection, updateConnection } from "../../data/connections";

export default defineEventHandler(async (e) => {
  const key = e.context.params?.key as string;

  const connection = await getConnection(key);

  if (!connection) {
    throw "Connection not found";
  }

  const { api } = createInstance(connection);

  const response = await api.post(`/${connection.secret}/generate-token`);

  if (response.data.status !== "success") {
    throw "Error on token generation";
  }

  const updatedConnection = await updateConnection(connection.id, {
    token: response.data.token,
    status: "up",
  });

  return updatedConnection;
});
