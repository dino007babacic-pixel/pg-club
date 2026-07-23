// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyC1Cd28f7zo6t-Cxqd5lmdYT0Lax6hiWsE",
    authDomain: "pg-club-9c9c6.firebaseapp.com",
    projectId: "pg-club-9c9c6",
    storageBucket: "pg-club-9c9c6.firebasestorage.app",
    messagingSenderId: "504345431698",
    appId: "1:504345431698:web:96ff9f130586419607a04b",
    measurementId: "G-GT6Z3D49JF"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ===== BOOKINGS =====
const BookingsDB = {
    async getAll() {
        try {
            const snap = await db.collection('bookings').orderBy('timestamp', 'desc').get();
            return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e) {
            console.error('Error fetching bookings:', e);
            return [];
        }
    },

    async add(booking) {
        try {
            const docRef = await db.collection('bookings').add({
                ...booking,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            return docRef.id;
        } catch (e) {
            console.error('Error adding booking:', e);
            return null;
        }
    },

    async updateStatus(id, status) {
        try {
            await db.collection('bookings').doc(id).update({ status });
            return true;
        } catch (e) {
            console.error('Error updating booking:', e);
            return false;
        }
    }
};

// ===== SITE DATA =====
const SiteDB = {
    async get() {
        try {
            const doc = await db.collection('siteData').doc('main').get();
            if (doc.exists) return doc.data();
            return null;
        } catch (e) {
            console.error('Error fetching site data:', e);
            return null;
        }
    },

    async save(data) {
        try {
            await db.collection('siteData').doc('main').set(data);
            return true;
        } catch (e) {
            console.error('Error saving site data:', e);
            return false;
        }
    }
};
