import { defineStore } from "pinia";
import type { AccountDTO, AccountType } from "../types/account";

const STORAGE_KEY = "accounts";

function loadFromStorage(): AccountDTO[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AccountDTO[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: AccountDTO[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function makeId(): string {
  return (crypto as any)?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

export const useAccountsStore = defineStore("accounts", {
  state: () => ({
    items: loadFromStorage() as AccountDTO[],
  }),

  getters: {
    all: (s) => s.items,
  },

  actions: {
    // Добавяем пустую запись в конец списка и сразу сохранить
    addEmpty(): string {
      const acc: AccountDTO = {
        id: makeId(),
        labels: [],
        type: "LOCAL",
        login: "",
        password: "",
      };
      this.items.push(acc);
      saveToStorage(this.items);
      return acc.id;
    },

    remove(id: string) {
      this.items = this.items.filter((a) => a.id !== id);
      saveToStorage(this.items);
    },

    update(payload: Partial<AccountDTO> & { id: string }) {
      const idx = this.items.findIndex((a) => a.id === payload.id);
      if (idx === -1) return;

      const next = { ...this.items[idx], ...payload };

      if (next.type === "LDAP") {
        next.password = null;
      }

      this.items.splice(idx, 1, next);
      saveToStorage(this.items);
    },

    /** Полная замена (если понадобится импорта/ресета) */
    replaceAll(next: AccountDTO[]) {
      this.items = next;
      saveToStorage(this.items);
    },

    /** Сброс стора (удалить всё) */
    clear() {
      this.items = [];
      saveToStorage(this.items);
    },
  },
});
