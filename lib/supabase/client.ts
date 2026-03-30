import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const isServer = typeof window === "undefined";

const webStorage = {
  getItem: (storageKey: string) =>
    Promise.resolve(window.localStorage.getItem(storageKey)),
  setItem: (storageKey: string, value: string) => {
    window.localStorage.setItem(storageKey, value);
    return Promise.resolve();
  },
  removeItem: (storageKey: string) => {
    window.localStorage.removeItem(storageKey);
    return Promise.resolve();
  },
};

const authStorage = isServer
  ? undefined
  : Platform.OS === "web"
    ? webStorage
    : AsyncStorage;

// Initialize the Supabase client
export const supabase = createClient(url, key, {
  auth: {
    storage: authStorage,
    persistSession: !isServer,
    autoRefreshToken: !isServer,
    detectSessionInUrl: false,
  },
});
