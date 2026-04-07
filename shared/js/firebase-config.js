// Firebase Configuration
// HƯỚNG DẪN: Thay thế firebaseConfig bên dưới bằng config từ Firebase Console của bạn

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};

// Initialize Firebase
let app, auth, database;

try {
  app = firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  database = firebase.database();
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
}

// Firebase helper functions

/**
 * Check if Firebase is configured
 */
function isFirebaseConfigured() {
  return firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";
}

/**
 * Get current Firebase user
 */
function getFirebaseUser() {
  return auth.currentUser;
}

/**
 * Check if user is authenticated
 */
function isFirebaseAuthenticated() {
  return auth.currentUser !== null;
}
