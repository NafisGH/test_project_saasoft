import { defineStore } from "pinia";
import type { AccountDTO, AccountType } from "@/types/account";

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
      const current = this.items.find((a) => a.id === payload.id);
      if (!current) return;

      const nextType: AccountType = payload.type ?? current.type;

      const next: AccountDTO = {
        id: current.id,
        labels: payload.labels ?? current.labels,
        type: nextType,
        login: payload.login ?? current.login,
        password:
          nextType === "LDAP"
            ? null
            : payload.password ?? current.password ?? "",
      };

      const idx = this.items.findIndex((a) => a.id === payload.id);
      if (idx !== -1) {
        this.items.splice(idx, 1, next);
        saveToStorage(this.items);
      }
    },

    replaceAll(next: AccountDTO[]) {
      this.items = next;
      saveToStorage(this.items);
    },

    clear() {
      this.items = [];
      saveToStorage(this.items);
    },
  },
});
