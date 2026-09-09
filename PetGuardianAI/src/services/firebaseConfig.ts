import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBJfHAjz9bIQhCoqCfcObyb-ntOBnrUXcs",
  authDomain: "petguardianai-2eaad.firebaseapp.com",
  projectId: "petguardianai-2eaad",
  storageBucket: "petguardianai-2eaad.firebasestorage.app",
  messagingSenderId: "452958414591",
  appId: "1:452958414591:web:2b16169d780a3cfa740eca"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
