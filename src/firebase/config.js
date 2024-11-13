import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCLTCdRYBkPOzVgn4R7h_I2DcORAbjtGY8',
  authDomain: 'listingshops-88a6b.firebaseapp.com',
  projectId: 'listingshops-88a6b',
  storageBucket: 'listingshops-88a6b.firebasestorage.app',
  messagingSenderId: '553252337258',
  appId: '1:553252337258:web:b5a5269caa2f48efc5bc13',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
