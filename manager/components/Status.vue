<template>
  <div style="display: flex; gap: 10px; align-items: center">
    <span style="white-space: nowrap">{{ statusText }}</span>
    <div
      :style="`width: 15px; height: 15px; background: ${statusColor}; border-radius: 50%`"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { createInstance } from "~/services/wpp";
import { ConnectionItem } from "~/types";

const { item } = defineProps<{
  item: ConnectionItem;
}>();

const statusColor = ref<string>(
  (() => {
    if (item.status === "creating" || item.status === "starting")
      return "#68DEF8";
    if (item.status === "up") return "#E3DF72";
    if (item.status === "error" || item.status === "paused") return "#C98985";
    return "#E1E1E1";
  })()
);

const statusText = ref<string>(
  (() => {
    switch (item.status) {
      case "new":
        return "Aguardando Criação";
      case "creating":
        return "Criando";
      case "starting":
        return "Iniciando";
      case "paused":
        return "Pausado";
      case "up":
        return "Aguardando conexão";

      case "error":
        return "Com erro";
    }
    return "Aguardando";
  })()
);

if (item.status === "up") {
  const { api } = createInstance(item);
  api
    .get("/check-connection-session")
    .then((response) => {
      if (response.data.status) {
        statusColor.value = "#77CC8A";
        statusText.value = "Conectado";
      }
    })
    .catch(() => {
      statusColor.value = "#C98985";
      statusText.value = "Offline";
    });
}
</script>
