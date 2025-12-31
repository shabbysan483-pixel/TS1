
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQRn6QerAL8U6Js-sXnPuWGJlRdCuA5Ng",
  authDomain: "english1-dc0f6.firebaseapp.com",
  projectId: "english1-dc0f6",
  storageBucket: "english1-dc0f6.firebasestorage.app",
  messagingSenderId: "816049586866",
  appId: "1:816049586866:web:90ba6d4ccd559fa1333fab",
  measurementId: "G-4GL8JFXZND"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// --- AUTHENTICATION FUNCTIONS ---

export const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const handleLogout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

// --- FIRESTORE DATA FUNCTIONS ---

/**
 * Lưu danh sách từ vựng đã học/yêu thích của người dùng
 * @param userId - ID của người dùng (từ auth.currentUser.uid)
 * @param savedWordIds - Mảng các ID từ vựng (number hoặc string)
 */
export const saveUserProgress = async (userId: string, savedWordIds: (number | string)[]) => {
  if (!userId) return;
  try {
    const userRef = doc(db, "users", userId);
    // Sử dụng { merge: true } để không ghi đè các trường khác (nếu có)
    await setDoc(userRef, { 
      savedWords: savedWordIds,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    console.log("Progress saved successfully!");
  } catch (error) {
    console.error("Error saving progress:", error);
  }
};

/**
 * Tải danh sách từ vựng đã lưu của người dùng
 * @param userId - ID của người dùng
 * @returns Mảng các ID từ vựng hoặc mảng rỗng nếu chưa có dữ liệu
 */
export const loadUserProgress = async (userId: string): Promise<(number | string)[]> => {
  if (!userId) return [];
  try {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.savedWords || [];
    } else {
      console.log("No such document!");
      return [];
    }
  } catch (error) {
    console.error("Error loading progress:", error);
    return [];
  }
};
