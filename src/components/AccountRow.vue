<template>
  <div class="row">
    <!-- Метка -->
    <div class="field">
      <label class="label">Метка (необязательно)</label>
      <el-input placeholder="prod; critical" />
    </div>

    <!-- Тип записи -->
    <div class="field">
      <label class="label">Тип записи</label>
      <el-select placeholder="Выберите тип">
        <el-option label="LDAP" value="LDAP" />
        <el-option label="Локальная" value="LOCAL" />
      </el-select>
    </div>

    <!-- Логин -->
    <div class="field">
      <label class="label">Логин *</label>
      <el-input placeholder="Введите логин" />
    </div>

    <!-- Пароль -->
    <div class="field">
      <label class="label">Пароль *</label>
      <el-input type="password" placeholder="Введите пароль" />
    </div>

    <!-- Удаление -->
    <div class="field field--actions">
      <el-button type="danger" plain @click="emitRemove">Удалить</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AccountDTO } from "@/types/account";

const props = defineProps<{
  account: AccountDTO;
}>();

const emit = defineEmits<{
  (e: "remove", id: string): void;
}>();

function emitRemove() {
  emit("remove", props.account.id);
}
</script>

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
