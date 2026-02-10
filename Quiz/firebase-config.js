import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBDQi-pqQ4qBvcwGcxOCFjY6G2aHShDlWU",
  authDomain: "quiz-dd10c.firebaseapp.com",
  projectId: "quiz-dd10c",
  storageBucket: "quiz-dd10c.firebasestorage.app",
  messagingSenderId: "290991840621",
  appId: "1:290991840621:web:a1ff0fdc36272730918e64",
  measurementId: "G-V6Z1WMG1ZS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };