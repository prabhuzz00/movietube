import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const WATCHLIST_COLLECTION = 'watchlist';

// Get user's watchlist
export const getWatchlist = async (userId) => {
  try {
    // Simplified query without orderBy (no index required)
    const q = query(
      collection(db, WATCHLIST_COLLECTION),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const watchlist = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      watchlist.push({
        id: doc.id,
        ...data
      });
    });
    
    // Sort in JavaScript instead of Firestore
    watchlist.sort((a, b) => {
      const timeA = a.addedAt?.toMillis() || 0;
      const timeB = b.addedAt?.toMillis() || 0;
      return timeB - timeA; // Descending order (newest first)
    });
    
    return { success: true, watchlist };
  } catch (error) {
    console.error('Error getting watchlist:', error);
    return { success: false, error: `Failed to load watchlist: ${error.message}` };
  }
};

// Add item to watchlist
export const addToWatchlist = async (userId, item) => {
  try {
    // Convert mediaId to string for consistency
    const mediaIdStr = String(item.mediaId);
    
    // Check if item already exists
    const exists = await checkInWatchlist(userId, item.mediaType, mediaIdStr);
    if (exists) {
      return { success: true, message: 'Already in watchlist' };
    }
    
    const docRef = await addDoc(collection(db, WATCHLIST_COLLECTION), {
      userId,
      mediaType: item.mediaType,
      mediaId: mediaIdStr, // Store as string
      title: item.title,
      posterPath: item.posterPath || null,
      addedAt: serverTimestamp()
    });
    
    return { success: true, message: 'Added to watchlist' };
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return { success: false, error: `Failed to add: ${error.message}` };
  }
};

// Remove item from watchlist
export const removeFromWatchlist = async (userId, mediaType, mediaId) => {
  try {
    // Convert mediaId to string for consistency
    const mediaIdStr = String(mediaId);
    
    const q = query(
      collection(db, WATCHLIST_COLLECTION),
      where('userId', '==', userId),
      where('mediaType', '==', mediaType),
      where('mediaId', '==', mediaIdStr)
    );
    
    const querySnapshot = await getDocs(q);
    
    const deletePromises = [];
    querySnapshot.forEach((document) => {
      deletePromises.push(deleteDoc(doc(db, WATCHLIST_COLLECTION, document.id)));
    });
    
    await Promise.all(deletePromises);
    
    return { success: true, message: 'Removed from watchlist' };
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return { success: false, error: 'Failed to remove from watchlist' };
  }
};

// Check if item is in watchlist
export const checkInWatchlist = async (userId, mediaType, mediaId) => {
  try {
    // Convert mediaId to string for consistency
    const mediaIdStr = String(mediaId);
    
    const q = query(
      collection(db, WATCHLIST_COLLECTION),
      where('userId', '==', userId),
      where('mediaType', '==', mediaType),
      where('mediaId', '==', mediaIdStr)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking watchlist:', error);
    return false;
  }
};

// Remove item by document ID (for watchlist page)
export const removeFromWatchlistById = async (docId) => {
  try {
    await deleteDoc(doc(db, WATCHLIST_COLLECTION, docId));
    return { success: true, message: 'Removed from watchlist' };
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return { success: false, error: 'Failed to remove from watchlist' };
  }
};
