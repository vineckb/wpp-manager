<template>
  <Loading v-if="isLoading" />
  <div v-if="!isLoading">
    <p>
      O <strong>DuLeads</strong> está conectado com o <strong>WhatsApp</strong>
    </p>
    <div v-if="!isLoading">
      <p>
        {{ data.pushname ? data.pushname + ": " : "" }}
        {{ data.phoneNumber.split("@")[0] }}
      </p>
    </div>
    <n-button @click="disconnect">Desconectar</n-button>
  </div>
</template>

<script lang="ts" setup>
import { AxiosInstance } from "axios";
import { Socket } from "socket.io-client";
import Loading from "./Loading.vue";

interface Props {
  api?: AxiosInstance;
  socket?: Socket;
}

const { api } = defineProps<Props>();
const isLoading = ref<boolean>(true);
const data = ref();

api?.get("/host-device").then((response) => {
  isLoading.value = false;
  data.value = response.data.response;
});

function disconnect() {
  isLoading.value = true;
  api?.post("/logout-session");
}
</script>
