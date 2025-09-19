<script setup lang="ts">
import { ref, watch } from "vue";
import type { AccountDTO, AccountType, LabelObj } from "@/types/account";

function stringifyLabels(labels: LabelObj[]): string {
  return labels.map((l) => l.text).join("; ");
}

const props = defineProps<{
  account: AccountDTO;
}>();

const emit = defineEmits<{
  (e: "remove", id: string): void;
}>();

function emitRemove() {
  emit("remove", props.account.id);
}

// Локальное состояние
const labelsText = ref<string>(stringifyLabels(props.account.labels));
const type = ref<AccountType>(props.account.type);
const login = ref<string>(props.account.login);
const password = ref<string>(props.account.password ?? "");

// Флаги ошибок
const errors = ref({
  labels: false,
  login: false,
  password: false,
});

// Синхронизация при внешних изменениях
watch(
  () => props.account,
  (acc) => {
    labelsText.value = stringifyLabels(acc.labels);
    type.value = acc.type;
    login.value = acc.login;
    password.value = acc.password ?? "";
  },
  { deep: true }
);

// Валидации
function validateLabels(): boolean {
  if (!labelsText.value) return true; // необязательно
  return labelsText.value.length <= 50;
}
function validateLogin(): boolean {
  return login.value.trim().length > 0 && login.value.length <= 100;
}
function validatePassword(): boolean {
  // пока не учитываем тип, просто обязательность и длину
  return password.value.trim().length > 0 && password.value.length <= 100;
}

// Обработчики
function onLabelsBlur() {
  errors.value.labels = !validateLabels();
}
function onTypeChange() {
  errors.value.login = !validateLogin();
  errors.value.password = !validatePassword();
}
function onLoginBlur() {
  errors.value.login = !validateLogin();
}
function onPasswordBlur() {
  errors.value.password = !validatePassword();
}
</script>

<template>
  <div class="row">
    <!-- Метка -->
    <div class="field" :class="{ invalid: errors.labels }">
      <label class="label">Метка</label>
      <el-input
        v-model="labelsText"
        placeholder="prod; critical"
        :maxlength="50"
        show-word-limit
        @blur="onLabelsBlur"
      />
    </div>

    <!-- Тип записи -->
    <div class="field">
      <label class="label">Тип записи</label>
      <el-select
        v-model="type"
        placeholder="Выберите тип"
        @change="onTypeChange"
      >
        <el-option label="LDAP" value="LDAP" />
        <el-option label="Локальная" value="LOCAL" />
      </el-select>
    </div>

    <!-- Логин -->
    <div class="field" :class="{ invalid: errors.login }">
      <label class="label">Логин</label>
      <el-input
        v-model="login"
        placeholder="Введите логин"
        :maxlength="100"
        show-word-limit
        @blur="onLoginBlur"
      />
    </div>

    <!-- Пароль -->
    <div class="field" :class="{ invalid: errors.password }">
      <label class="label">Пароль</label>
      <el-input
        v-model="password"
        type="password"
        placeholder="Введите пароль"
        :maxlength="100"
        show-word-limit
        @blur="onPasswordBlur"
      />
    </div>

    <!-- Удаление -->
    <div class="field field--actions">
      <el-button type="danger" plain @click="emitRemove">Удалить</el-button>
    </div>
  </div>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 1fr 180px 1fr 1fr auto;
  gap: 12px;
  align-items: end;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.label {
  font-size: 13px;
  opacity: 0.9;
}
.field--actions {
  align-self: center;
}
</style>
