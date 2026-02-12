
import { Timestamp } from "firebase/firestore";

export interface Speaker {
    id: string;
    name: string;
    affiliation?: string;
    bio?: string;
    photoUrl?: string;
}

export interface Session {
    id: string;
    title: string;
    description?: string;
    startTime: Timestamp;
    endTime: Timestamp;
    location?: string;
    track?: string; // e.g., "Track A", "Track B"
    speakers?: Speaker[];
    paperId?: string; // Link to abstract
    isService?: boolean; // e.g., Lunch, Coffee Break
}

export interface Abstract {
    id: string;
    title: string;
    authors: string[]; // List of author names
    body: string; // The abstract text
    keywords?: string[];
    sessionId?: string; // Link to session
    pdfUrl?: string; // Link to full paper PDF
}

export interface UserProfile {
    uid: string;
    displayName?: string;
    email?: string;
    savedSessionIds: string[]; // List of starred session IDs
    savedAbstractIds: string[]; // List of bookmarked abstract IDs
}
