<!-- src/components/AccountsForm.vue -->
<script setup lang="ts">
import { computed } from "vue";
import { useAccountsStore } from "@/store/accounts";
import AccountRow from "./AccountRow.vue";
import { ElButton } from "element-plus";

const store = useAccountsStore();
const accounts = computed(() => store.all);

function onAdd() {
  store.addEmpty();
}
function onRemove(id: string) {
  store.remove(id);
}
</script>

<template>
  <section class="accounts">
    <header class="accounts__header">
      <h1 class="accounts__title">Учетные записи</h1>
      <el-button type="primary" @click="onAdd">+</el-button>
    </header>

    <p class="accounts__hint">
      Подсказка: метки вводятся через «;». Пример:
      <i>xxx;aaa;metka</i>.
    </p>

    <div class="accounts__list">
      <AccountRow
        v-for="acc in accounts"
        :key="acc.id"
        :account="acc"
        @remove="onRemove"
      />
    </div>
  </section>
</template>

<style scoped>
.accounts__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.accounts__title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}
.accounts__hint {
  margin: 4px 0 16px;
  font-size: 13px;
  opacity: 0.8;
}
.accounts__list {
  display: grid;
  gap: 12px;
}
</style>
