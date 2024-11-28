import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function checkTutorialAccess(
  userId: string,
  tutorialId: string
): Promise<boolean> {
  try {
    // Get tutorial details
    const tutorialRef = collection(db, 'tutorials');
    const tutorialQuery = query(tutorialRef, where('id', '==', tutorialId));
    const tutorialSnapshot = await getDocs(tutorialQuery);
    
    if (tutorialSnapshot.empty) {
      return false;
    }

    const tutorial = tutorialSnapshot.docs[0].data();

    // If tutorial is free, grant access
    if (!tutorial.isPremium) {
      return true;
    }

    // Check user's subscription status
    const userRef = collection(db, 'users');
    const userQuery = query(userRef, where('id', '==', userId));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      return false;
    }

    const user = userSnapshot.docs[0].data();
    
    return (
      user.subscription.tier === 'premium' &&
      user.subscription.validUntil.toDate() > new Date()
    );
  } catch (error) {
    console.error('Error checking tutorial access:', error);
    return false;
  }
}