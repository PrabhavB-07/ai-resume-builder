import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getStorage } from "firebase/storage";

const firebaseConfig = {

  apiKey: "AIzaSyCb7AyYxDIsh0W5HxIZhfEH45PK5Hm7W7U",

  authDomain: "ai-resume-builder-dea0c.firebaseapp.com",

  projectId: "ai-resume-builder-dea0c",

  storageBucket: "ai-resume-builder-dea0c.appspot.com",

  messagingSenderId: "788378121109",

  appId: "1:788378121109:web:08ae2ed3c80935fd06bc9c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);