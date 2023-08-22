<template>
  <div style="text-align: center">
    <header>
      <h1
        style="
          font-family: v-sans, system-ui, -apple-system, BlinkMacSystemFont,
            'Segoe UI', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
            'Segoe UI Symbol';
        "
      >
        DuLeads
      </h1>
    </header>
    <main>
      <Loading v-if="isLoading" />
      <Connected v-if="!isLoading && status" :api="api" :socket="socket" />
      <StartSession v-if="!isLoading && !status" :api="api" :socket="socket" />
      <Offline v-if="!isLoading && offline" />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { AxiosInstance } from "axios";
import { createInstance } from "~/services/wpp";
import { Socket } from "socket.io-client";
import { ConnectionItem } from "types";
import { api as nuxtApi } from "~/services/api";
import Loading from "./components/Loading.vue";
import Connected from "./components/Connected.vue";
import StartSession from "./components/StartSession.vue";
import Offline from "./components/Offline.vue";

const { key } = useRoute().params;

const isLoading = ref<boolean>(true);
const offline = ref<boolean>(false);
const status = ref<boolean>(false);
const connection = ref<ConnectionItem>();
const api = ref<AxiosInstance>();
const socket = ref<Socket>();

// load instance settings
nuxtApi
  .get(`/connections/${key}`)
  .then(({ data }) => (connection.value = data));

// create axios & socket.io instance
watchEffect(() => {
  if (connection.value) {
    const instance = createInstance(connection.value);
    api.value = instance.api;
    socket.value = instance.socket;
  }
});

// check connection status
watchEffect(() => {
  if (!api.value) return;

  api.value
    .get("/check-connection-session")
    .then((response) => (status.value = !!response?.data.status))
    .catch(() => (offline.value = true))
    .finally(() => (isLoading.value = false));
});

// watch wpp events
watchEffect(() => {
  if (!socket.value) return null;

  socket.value?.on(
    "whatsapp-status",
    (value: boolean) => (status.value = !!value)
  );

  socket.value?.on("session-logged", () => (status.value = true));
});

onUnmounted(() => {
  socket.value?.offAny();
  socket.value?.disconnect();
});
</script>
