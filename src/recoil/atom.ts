import { atom } from "recoil";

export const statDateRange = atom<string>({
  key: "statdaterange",
  default: "24h",
});
