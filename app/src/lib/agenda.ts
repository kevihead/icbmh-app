import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export interface UserAgenda {
    userId: string;
    selectedSessions: string[];
    lastUpdated: Date;
}

/**
 * Save user's agenda to Firestore
 */
export async function saveAgendaToFirestore(userId: string, selectedSessions: string[]): Promise<void> {
    try {
        const agendaRef = doc(db, 'agendas', userId);
        await setDoc(agendaRef, {
            userId,
            selectedSessions,
            lastUpdated: new Date(),
        });
        
        // Also save to localStorage as backup
        localStorage.setItem('selectedSessions', JSON.stringify(selectedSessions));
    } catch (error) {
        console.error('Error saving agenda to Firestore:', error);
        throw error;
    }
}

/**
 * Load user's agenda from Firestore
 */
export async function loadAgendaFromFirestore(userId: string): Promise<string[]> {
    try {
        const agendaRef = doc(db, 'agendas', userId);
        const agendaDoc = await getDoc(agendaRef);
        
        if (agendaDoc.exists()) {
            const data = agendaDoc.data() as UserAgenda;
            // Save to localStorage for offline access
            localStorage.setItem('selectedSessions', JSON.stringify(data.selectedSessions));
            return data.selectedSessions;
        }
        
        // If no Firestore data, try localStorage
        const localData = localStorage.getItem('selectedSessions');
        if (localData) {
            const sessions = JSON.parse(localData);
            // Sync localStorage data to Firestore
            await saveAgendaToFirestore(userId, sessions);
            return sessions;
        }
        
        return [];
    } catch (error) {
        console.error('Error loading agenda from Firestore:', error);
        // Fallback to localStorage
        const localData = localStorage.getItem('selectedSessions');
        return localData ? JSON.parse(localData) : [];
    }
}

/**
 * Merge local and remote agendas (union of both)
 */
export async function syncAgenda(userId: string, localSessions: string[]): Promise<string[]> {
    try {
        const remoteSessions = await loadAgendaFromFirestore(userId);
        // Merge unique sessions from both sources
        const merged = Array.from(new Set([...localSessions, ...remoteSessions]));
        await saveAgendaToFirestore(userId, merged);
        return merged;
    } catch (error) {
        console.error('Error syncing agenda:', error);
        return localSessions;
    }
}
