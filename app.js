// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, setDoc, doc, deleteDoc, getDocs } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCvtWTmqmJt10icRtFRWg58SWf4JE1hXmc",
    authDomain: "calendar-2026-5ba8e.firebaseapp.com",
    projectId: "calendar-2026-5ba8e",
    storageBucket: "calendar-2026-5ba8e.firebasestorage.app",
    messagingSenderId: "357308222372",
    appId: "1:357308222372:web:153a95f8f544e6a59ecf31",
    measurementId: "G-0EP154JP2Z"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- 導出功能給 cal-gemini.js 使用 ---

// 1. 上傳單一行程
window.uploadEvent = async (eventData) => {
    console.log("📤 正在上傳至雲端...", eventData); // 加這行測試
    try {
        const eventId = eventData.id.toString();
        await setDoc(doc(db, "events", eventId), eventData);
        console.log("✅ 雲端上傳成功！");
    } catch (e) {
        console.error("❌ 雲端上傳失敗:", e);
    }
};
// 2. 刪除單一行程
// app.js
window.removeEventFromCloud = async (eventId) => {
    try {
        const idStr = eventId.toString();
        await deleteDoc(doc(db, "events", idStr));
        console.log("✅ 雲端資料已刪除:", idStr);
    } catch (e) {
        console.error("❌ 刪除失敗:", e);
    }
};

onSnapshot(collection(db, "events"), (snapshot) => {
    const cloudEvents = [];
    snapshot.forEach((doc) => {
        // 建議這裡強制補上 id，避免比對出錯
        const data = doc.data();
        if (!data.id) data.id = doc.id; 
        cloudEvents.push(data);
    });
    
    console.log("🔔 偵測到雲端變動，同步中...");
    
    if (window.updateCalendarUI) {
        window.updateCalendarUI(cloudEvents); 
    }
});

console.log("Firebase 監聽器已啟動");