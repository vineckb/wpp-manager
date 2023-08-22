<template>
  <ClientOnly>
    <div v-if="auth">
      <header
        style="
          padding: 10px;
          display: flex;
          width: 100%;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
        "
      >
        <h1>WPP Manager</h1>

        <CreateConnectionButton />
      </header>

      <n-list
        v-if="!isLoading"
        hoverable
        clickable
        style="margin: 10px; border: 1px solid #efeff5"
      >
        <ConnectionListItem v-for="item in data" :key="item.key" :item="item" />
      </n-list>
    </div>
  </ClientOnly>
</template>

<script lang="ts" setup>
import ConnectionListItem from "~/components/ConnectionListItem.vue";
import CreateConnectionButton from "~/components/CreateConnectionButton.vue";
import { api } from "~/services/api";
import { useQuery } from "@tanstack/vue-query";
import { io } from "socket.io-client";

const ws = io("http://localhost:3001");
console.log("ioio");

ws.emit("createConnection", "okok");

const auth = ref<boolean>(false);

function useConnectionsList() {
  return useQuery({
    queryKey: ["connections"],
    queryFn: async () => {
      const response = await api.get("/connections");
      return response.data;
    },
  });
}

const { isLoading, data } = useConnectionsList();

if (process.client) {
  const hasAuth = !!localStorage.getItem("auth");
  if (hasAuth) {
    auth.value = true;
  } else {
    const password = window.prompt("Informe a senha");
    api.post("/auth", { password }).then((res) => {
      if (res.data !== "ok") {
        return location.reload();
      }
      localStorage.setItem("auth", "1");
      auth.value = true;
    });
  }
}
</script>
