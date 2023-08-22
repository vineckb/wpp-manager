<template>
  <n-list-item @click="() => copy(`http://localhost:3000/auth/${item.key}`)">
    <n-thing :title="props.item.name"></n-thing>
    <template #suffix>
      <Status :item="props.item" />
    </template>
  </n-list-item>
</template>

<script lang="ts" setup>
import Status from "~/components/Status.vue";
import { ConnectionItem } from "~/types";

const props = defineProps<{
  item: ConnectionItem;
}>();

function copy(text: string) {
  const storage = document.createElement("textarea");
  storage.style.opacity = "0";
  storage.value = text;
  document.body.appendChild(storage);
  storage.select();
  storage.setSelectionRange(0, 99999);
  document.execCommand("copy");
  document.body.removeChild(storage);
}
</script>
