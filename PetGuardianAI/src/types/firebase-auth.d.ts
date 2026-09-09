import type { Persistence } from 'firebase/auth';

/**
 * `firebase/auth` typings resolve to the web build regardless of platform
 * (the package's conditional `exports` map lists an unconditional `types`
 * key before the `react-native` condition), so `getReactNativePersistence`
 * is missing even though it exists at runtime in the RN build Metro loads.
 * This augmentation restores the type without touching the real module.
 */
declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: unknown): Persistence;
}
