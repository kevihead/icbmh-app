
"use client";

import { useState, useEffect } from "react";
import { MOCK_SESSIONS } from "@/lib/mock-data";
import { SessionCard } from "@/components/schedule/session-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const DAYS = [
    { id: "day1", label: "Tue, 07 July", date: 7 },
    { id: "day2", label: "Wed, 08 July", date: 8 },
    { id: "day3", label: "Thu, 09 July", date: 9 },
];

export default function SchedulePage() {
    const [starredSessions, setStarredSessions] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("day1");
    const [activeTrack, setActiveTrack] = useState("all");

    useEffect(() => {
        const saved = localStorage.getItem("starredSessions");
        if (saved) {
            setStarredSessions(JSON.parse(saved));
        }
    }, []);

    const toggleStar = (sessionId: string) => {
        setStarredSessions(prev => {
            const newStarred = prev.includes(sessionId)
                ? prev.filter(id => id !== sessionId)
                : [...prev, sessionId];

            localStorage.setItem("starredSessions", JSON.stringify(newStarred));
            return newStarred;
        });
    };

    const currentDay = DAYS.find(d => d.id === activeTab);

    // Filter by Day first (unless searching or viewing favorites)
    const daySessions = MOCK_SESSIONS.filter(session => {
        if (activeTab === "favorites") return true;
        if (searchQuery) return true; // Search across all days

        const sessionDate = session.startTime.toDate().getDate();
        return sessionDate === currentDay?.date;
    });

    const tracks = Array.from(new Set(daySessions.map(s => s.track).filter(Boolean))) as string[];

    const filteredSessions = daySessions.filter(session => {
        const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTrack = activeTrack === "all" || session.track === activeTrack;
        const matchesFavorites = activeTab === "favorites" ? starredSessions.includes(session.id) : true;

        return matchesSearch && matchesTrack && matchesFavorites;
    });

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <h1 className="text-4xl font-extrabold text-primary mb-2">Conference Schedule</h1>
            <p className="text-muted-foreground mb-8">
                {activeTab === "favorites" ? "My Personal Agenda" :
                    searchQuery ? "Search Results" :
                        currentDay?.label}
            </p>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search all sessions..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Tabs defaultValue="day1" value={activeTab} onValueChange={(val) => { setActiveTab(val); setActiveTrack("all") }} className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto mb-6 h-auto flex-wrap gap-2 bg-transparent p-0">
                    {DAYS.map(day => (
                        <TabsTrigger
                            key={day.id}
                            value={day.id}
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-card min-w-[100px]"
                        >
                            {day.label}
                        </TabsTrigger>
                    ))}
                    <TabsTrigger value="favorites" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white border bg-card ml-auto">
                        My Agenda
                    </TabsTrigger>
                </TabsList>

                {/* Track Filtering (Only show if not in Favorites mode and not searching) */}
                {activeTab !== "favorites" && !searchQuery && tracks.length > 0 && (
                    <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
                        <button
                            onClick={() => setActiveTrack("all")}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${activeTrack === "all" ? "bg-secondary text-white border-secondary" : "bg-background hover:bg-muted"}`}
                        >
                            All Tracks
                        </button>
                        {tracks.map(track => (
                            <button
                                key={track}
                                onClick={() => setActiveTrack(track)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap ${activeTrack === track ? "bg-secondary text-white border-secondary" : "bg-background hover:bg-muted"}`}
                            >
                                {track}
                            </button>
                        ))}
                    </div>
                )}

                <div className="space-y-4">
                    {filteredSessions.length > 0 ? (
                        filteredSessions.map(session => (
                            <SessionCard
                                key={session.id}
                                session={session}
                                isStarred={starredSessions.includes(session.id)}
                                onToggleStar={toggleStar}
                            />
                        ))
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            No sessions found matching your criteria.
                        </div>
                    )}
                </div>
            </Tabs>
        </div>
    );
}
