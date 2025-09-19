export type AccountType = "LDAP" | "LOCAL";

export interface LabelObj {
  text: string;
}

export interface AccountDTO {
  id: string;
  labels: LabelObj[];
  type: AccountType;
  login: string;
  password?: string | null;
}
