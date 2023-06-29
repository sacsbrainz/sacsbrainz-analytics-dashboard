import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLastNDays(n: number): Date[] {
  const today = new Date();
  const dates: Date[] = [];

  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date);
  }

  return dates;
}

export function getDateToAndFrom(date:string): string[]{
  if(date === "24h"){
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return [yesterday.toISOString(), today.toISOString()];
  }
  else if(date === "7d"){
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return [sevenDaysAgo.toISOString(), today.toISOString()];
  }
  else if(date === "30d"){
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return [thirtyDaysAgo.toISOString(), today.toISOString()];
  }
  else if(date === "90d"){
    const today = new Date();
    const ninetyDaysAgo = new Date(today);
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    return [ninetyDaysAgo.toISOString(), today.toISOString()];
  }
  else if(date === "1y"){
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);
    return [oneYearAgo.toISOString(), today.toISOString()];
  }
  else if(date === "all"){
    const today = new Date();
    const allTime = new Date("2021-06-01");
    return [allTime.toISOString(), today.toISOString()];
  }
  else{
    return ["", ""];
  }
}