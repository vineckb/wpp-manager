<template>
  <Loading v-if="isLoading" />
  <div v-if="!isLoading">
    <h4>Leia o código abaixo com seu WhatsApp</h4>
    <img :src="qrcode" alt="" />
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

const { api, socket } = defineProps<Props>();

const isLoading = ref<boolean>(true);
const qrcode = ref<string>("");
const interval = ref<any>();

startSession();

onUnmounted(() => {
  if (process.client) {
    window.clearTimeout(interval.value);
  }
});

function startSession() {
  api?.post("/start-session").then((response) => {
    setQrCode(response?.data.qrcode);
    if (process.client) {
      interval.value = window.setTimeout(startSession, 15000);
    }
  });
}

function setQrCode(newCode: string) {
  if (!newCode || newCode === qrcode.value) return;
  qrcode.value = newCode;
  isLoading.value = false;
}

socket?.on("qrCode", ({ data }) => {
  setQrCode(data);
});
</script>
