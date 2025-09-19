<!-- src/components/AccountRow.vue -->
<script setup lang="ts">
import { ref, watch } from "vue";
import type { AccountDTO, AccountType } from "@/types/account";
import { useAccountsStore } from "@/store/accounts";
import { parseLabels, stringifyLabels } from "@/utils/labels";
import IconDelete from "@/icons/iconDelete.vue";

const props = defineProps<{
  account: AccountDTO;
}>();
const emit = defineEmits<{
  (e: "remove", id: string): void;
}>();

const store = useAccountsStore();

// Локальное состояние строки (редактируем до валидации)
const labelsText = ref(stringifyLabels(props.account.labels));
const type = ref<AccountType>(props.account.type);
const login = ref<string>(props.account.login);
const password = ref<string>(props.account.password ?? "");

// Флаги ошибок
const errors = ref({
  labels: false,
  login: false,
  password: false,
});

// Синхронизация, если стор обновился извне
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

// ------- Валидации -------
function validateLabels(): boolean {
  // ТЗ: максимум 50 символов для поля "Метка", поле необязательное
  if (!labelsText.value) {
    return true;
  }
  return labelsText.value.length <= 50;
}
function validateLogin(): boolean {
  return login.value.trim().length > 0 && login.value.length <= 100;
}
function validatePassword(): boolean {
  if (type.value === "LDAP") return true;
  return password.value.trim().length > 0 && password.value.length <= 100;
}
function reflectRequiredErrors() {
  // Логин обязателен всегда
  errors.value.login = !validateLogin();

  if (type.value === "LOCAL") {
    // Для Локальной обязателен и пароль
    errors.value.password = !validatePassword();
  } else {
    // Для LDAP пароль не обязателен и скрыт
    errors.value.password = false;
  }
}

// ------- Сохранение (по blur/change) -------
function onLabelsBlur() {
  const ok = validateLabels();
  errors.value.labels = !ok;
  if (ok) {
    store.update({
      id: props.account.id,
      labels: parseLabels(labelsText.value),
    });
  }

  // ДОБАВЛЕНО: по ТЗ — после ввода метки и потери фокуса
  // проверяем обязательные поля в зависимости от выбранного типа
  reflectRequiredErrors();
}

function onTypeChange() {
  // Сохраняем тип; стор сам выставит password = null для LDAP
  store.update({
    id: props.account.id,
    type: type.value,
  });

  // По ТЗ: при изменении типа проверяем логин (всегда)
  // и пароль — только если тип LOCAL
  reflectRequiredErrors();
}

function onLoginBlur() {
  const ok = validateLogin();
  errors.value.login = !ok;
  if (ok) {
    store.update({
      id: props.account.id,
      login: login.value,
    });
  }
}
function onPasswordBlur() {
  if (type.value === "LDAP") return; // не показывается и не сохраняется для LDAP
  const ok = validatePassword();
  errors.value.password = !ok;
  if (ok) {
    store.update({
      id: props.account.id,
      password: password.value,
    });
  }
}

// Удаление
function emitRemove() {
  emit("remove", props.account.id);
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
        @blur="onLabelsBlur"
        :maxlength="50"
        show-word-limit
      />
    </div>

    <!-- Тип записи  -->
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
        @blur="onLoginBlur"
        :maxlength="100"
        show-word-limit
      />
    </div>

    <!-- Пароль (только для Локальная) -->
    <div
      class="field"
      v-if="type === 'LOCAL'"
      :class="{ invalid: errors.password }"
    >
      <label class="label">Пароль *</label>
      <el-input
        v-model="password"
        type="password"
        placeholder="Введите пароль"
        @blur="onPasswordBlur"
        :maxlength="100"
        show-word-limit
      />
    </div>

    <!-- Удаление -->
    <div class="field field--actions">
      <el-tooltip content="Удалить" placement="top">
        <el-button type="danger" plain aria-label="Удалить" @click="emitRemove">
          <el-icon>
            <IconDelete />
          </el-icon>
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 1fr 150px 1.5fr 140px auto;
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

/* Подсветка ошибки для Element Plus input/select */
.field.invalid :deep(.el-input__wrapper),
.field.invalid :deep(.el-select .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-color-danger) inset;
}
.help {
  font-size: 12px;
  opacity: 0.75;
}
.field--actions {
  width: 18px;
  height: 18px;
  align-self: center;
  margin-top: 5px;
}
</style>
