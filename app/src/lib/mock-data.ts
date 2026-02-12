
import { Session, Speaker, Abstract } from "@/types/firestore";
import { Timestamp } from "firebase/firestore";

// Helper to create timestamps for specific days in July 2026
const createDate = (day: number, hour: number, minute: number) => {
    const date = new Date(2026, 6, day, hour, minute); // Month is 0-indexed (6 = July)
    return Timestamp.fromDate(date);
};

export const MOCK_SPEAKERS: Speaker[] = [
    { id: "s1", name: "Dr. Alistair C. B. M. H.", affiliation: "University of Bulk", bio: "Expert in granular flow." },
    { id: "s2", name: "Prof. Sarah Silo", affiliation: "Storage Solutions Inc.", bio: "Specialist in silo design." },
    { id: "s3", name: "Eng. Belt Conveyor", affiliation: "Moving Parts Ltd.", bio: "10 years in conveyor belt optimization." },
    { id: "s4", name: "Dr. Dust Free", affiliation: "Clean Air Systems", bio: "Researching dust suppression technologies." },
    { id: "s5", name: "Mr. Heavy Lifter", affiliation: "Port Operations", bio: "Manager of major coal terminal." },
    { id: "s6", name: "Ms. Digital Twin", affiliation: "Tech Innovations", bio: "Simulation expert." },
    { id: "s7", name: "Prof. Flow Dynamics", affiliation: "Physics Dept", bio: "DEM modelling specialist." },
    { id: "s8", name: "Eng. Rail Transport", affiliation: "National Rail", bio: "Logistics coordinator." },
];

const generateSessions = () => {
    const sessions: Session[] = [];

    // Day 1: Tuesday, July 07
    sessions.push({
        id: "d1-plenary-1",
        title: "Opening Ceremony & Keynote: The Future of Bulk Handling",
        startTime: createDate(7, 9, 0),
        endTime: createDate(7, 10, 30),
        location: "Grand Ballroom",
        track: "Plenary",
        speakers: [MOCK_SPEAKERS[0]],
        isService: false,
    });
    sessions.push({
        id: "d1-morning-coffee",
        title: "Morning Coffee",
        startTime: createDate(7, 10, 30),
        endTime: createDate(7, 11, 0),
        location: "Foyer",
        isService: true,
    });

    // Day 1 Parallel Sessions (11:00 - 12:30)
    sessions.push({
        id: "d1-s1-a",
        title: "Optimizing Silo Discharge Flow",
        startTime: createDate(7, 11, 0),
        endTime: createDate(7, 11, 30),
        location: "Room A",
        track: "Track A: Storage",
        speakers: [MOCK_SPEAKERS[1]],
        paperId: "p1",
    });
    sessions.push({
        id: "d1-s1-b",
        title: "Belt Conveyor Energy Efficiency",
        startTime: createDate(7, 11, 0),
        endTime: createDate(7, 11, 30),
        location: "Room B",
        track: "Track B: Handling",
        speakers: [MOCK_SPEAKERS[2]],
        paperId: "p2",
    });
    sessions.push({
        id: "d1-s1-c",
        title: "Rail Logistics Optimization",
        startTime: createDate(7, 11, 0),
        endTime: createDate(7, 11, 30),
        location: "Room C",
        track: "Track C: Transportation",
        speakers: [MOCK_SPEAKERS[7]],
    });

    // More Day 1 Sessions...
    sessions.push({
        id: "d1-lunch",
        title: "Networking Lunch",
        startTime: createDate(7, 12, 30),
        endTime: createDate(7, 13, 30),
        location: "Dining Hall",
        isService: true,
    });

    sessions.push({
        id: "d1-s2-a",
        title: "Dust Control Strategies",
        startTime: createDate(7, 13, 30),
        endTime: createDate(7, 14, 0),
        location: "Room A",
        track: "Track A: Storage",
        speakers: [MOCK_SPEAKERS[3]],
        paperId: "p3",
    });
    sessions.push({
        id: "d1-s2-b",
        title: "Port Terminal Operations",
        startTime: createDate(7, 13, 30),
        endTime: createDate(7, 14, 0),
        location: "Room B",
        track: "Track B: Handling",
        speakers: [MOCK_SPEAKERS[4]],
    });
    // ... (Repeating pattern to ensure volume)
    for (let i = 0; i < 5; i++) {
        sessions.push({
            id: `d1-s3-a-${i}`,
            title: `Granular Flow Research - Part ${i + 1}`,
            startTime: createDate(7, 14 + (i * 0.5), 0),
            endTime: createDate(7, 14 + (i * 0.5) + 0.5, 0),
            location: "Room A",
            track: "Track A: Storage",
            speakers: [MOCK_SPEAKERS[6]],
        });
        sessions.push({
            id: `d1-s3-b-${i}`,
            title: `Conveyor Innovation - Part ${i + 1}`,
            startTime: createDate(7, 14 + (i * 0.5), 0),
            endTime: createDate(7, 14 + (i * 0.5) + 0.5, 0),
            location: "Room B",
            track: "Track B: Handling",
            speakers: [MOCK_SPEAKERS[2]],
        });
    }

    // Day 2: Wednesday, July 08
    sessions.push({
        id: "d2-plenary",
        title: "Keynote: Digital Twins in Bulk Handling",
        startTime: createDate(8, 9, 0),
        endTime: createDate(8, 10, 0),
        location: "Grand Ballroom",
        track: "Plenary",
        speakers: [MOCK_SPEAKERS[5]],
    });

    for (let i = 0; i < 8; i++) {
        sessions.push({
            id: `d2-s1-a-${i}`,
            title: `Advanced Silo Mechanics - Case Study ${i + 1}`,
            startTime: createDate(8, 10 + (i * 0.5), 30),
            endTime: createDate(8, 11 + (i * 0.5), 0),
            location: "Room A",
            track: "Track A: Storage",
            speakers: [MOCK_SPEAKERS[1]],
        });
        sessions.push({
            id: `d2-s1-b-${i}`,
            title: `Pneumatic Conveying - Session ${i + 1}`,
            startTime: createDate(8, 10 + (i * 0.5), 30),
            endTime: createDate(8, 11 + (i * 0.5), 0),
            location: "Room B",
            track: "Track B: Handling",
            speakers: [MOCK_SPEAKERS[0]],
        });
        sessions.push({
            id: `d2-s1-c-${i}`,
            title: `Heavy Haul Rail - Technical Paper ${i + 1}`,
            startTime: createDate(8, 10 + (i * 0.5), 30),
            endTime: createDate(8, 11 + (i * 0.5), 0),
            location: "Room C",
            track: "Track C: Transportation",
            speakers: [MOCK_SPEAKERS[7]],
        });
    }
    sessions.push({
        id: "d2-gala",
        title: "Gala Dinner & Awards",
        startTime: createDate(8, 19, 0),
        endTime: createDate(8, 23, 0),
        location: "Esplanade Hotel Ballroom",
        isService: true,
    });

    // Day 3: Thursday, July 09
    for (let i = 0; i < 4; i++) {
        sessions.push({
            id: `d3-s1-a-${i}`,
            title: `Environmental Compliance - Topic ${i + 1}`,
            startTime: createDate(9, 9 + (i * 0.5), 0),
            endTime: createDate(9, 9 + (i * 0.5) + 0.5, 0),
            location: "Room A",
            track: "Track A: Storage",
            speakers: [MOCK_SPEAKERS[3]],
        });
    }
    sessions.push({
        id: "d3-closedown",
        title: "Closing Ceremony",
        startTime: createDate(9, 12, 0),
        endTime: createDate(9, 13, 0),
        location: "Grand Ballroom",
        track: "Plenary",
        speakers: [MOCK_SPEAKERS[0]],
    });

    return sessions.sort((a, b) => a.startTime.seconds - b.startTime.seconds);
};

export const MOCK_SESSIONS = generateSessions();

export const MOCK_ABSTRACTS: Abstract[] = [
    {
        id: "p1",
        title: "Optimizing Silo Discharge Flow",
        authors: ["Prof. Sarah Silo", "Dr. Grain"],
        body: "This paper discusses advanced techniques for ensuring consistent flow from storage silos...",
        sessionId: "d1-s1-a",
        keywords: ["Silo", "Flow", "Storage"],
    },
    {
        id: "p2",
        title: "Belt Conveyor Energy Efficiency",
        authors: ["Eng. Belt Conveyor"],
        body: "Energy consumption in long-distance belt conveyors can be reduced by 15% using...",
        sessionId: "d1-s1-b",
        keywords: ["Conveyor", "Energy", "Efficiency"],
    },
    {
        id: "p3",
        title: "Dust Control Strategies",
        authors: ["Dr. Alistair C. B. M. H."],
        body: "Controlling fugitive dust in bulk terminals is critical for environmental compliance...",
        sessionId: "d1-s2-a",
        keywords: ["Dust", "Environment", "Safety"],
    },
];
