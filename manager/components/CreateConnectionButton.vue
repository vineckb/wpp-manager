<template>
  <n-button @click="showModal = true">Novo cliente</n-button>
  <n-modal v-model:show="showModal">
    <n-card
      style="width: 600px"
      title="Novo cliente"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-button
          @click="showModal = false"
          strong
          secondary
          circle
          type="primary"
        >
          <template #icon>
            <n-icon><Close /></n-icon>
          </template>
        </n-button>
      </template>
      <n-form ref="formRef" :model="formValue" :rules="rules">
        <n-space vertical>
          <n-space horizontal style="flex-wrap: nowrap">
            <n-form-item path="name" label="Nome">
              <n-input v-model:value="formValue.name" />
            </n-form-item>
            <n-form-item
              path="port"
              label="Porta"
              :validation-status="portValidationStatus"
              :feedback="`${minPort} ~ ${maxPort}`"
            >
              <n-input-number v-model:value="formValue.port" />
            </n-form-item>
          </n-space>
          <n-form-item path="secret" label="Secret">
            <n-input
              type="password"
              show-password-on="click"
              v-model:value="formValue.secret"
            />
          </n-form-item>
        </n-space>
      </n-form>
      <template #footer>
        <div style="justify-content: end; gap: 10px; display: flex">
          <n-button>Cancelar</n-button>
          <n-button type="primary" @click="submit">Salvar</n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { Close } from "@vicons/carbon";
import { FormInst } from "naive-ui";
import { api } from "~/services/api";
import { randomString } from "~/helpers/randomString";
import { useQueryClient } from "@tanstack/vue-query";

const queryClient = useQueryClient();

const showModal = ref<boolean>(false);

function submit(e: MouseEvent) {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      api.post("/connections/create", formValue.value).then((response) => {
        queryClient.invalidateQueries({
          queryKey: ["connections"],
        });
        showModal.value = false;
        reset();
      });
    } else {
      console.log(errors);
      alert("Invalid");
    }
  });
}

function reset() {
  formValue.value = {
    name: "",
    port: minPort + 1,
    secret: randomString(20),
  };
}
const minPort = 4000;
const maxPort = 5000;
const portValidationStatus = computed(() =>
  formValue.value.port >= minPort && formValue.value.port <= maxPort
    ? undefined
    : "error"
);

const formRef = ref<FormInst | null>(null);
const formValue = ref({
  name: "",
  port: 4000,
  secret: randomString(64),
});
const rules = {
  name: {
    required: true,
    message: "Campo obrigatório",
    trigger: "blur",
  },
  secret: {
    required: true,
    message: "Campo obrigatório",
    trigger: "blur",
  },
};
</script>
