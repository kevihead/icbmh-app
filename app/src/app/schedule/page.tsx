"use client";

import { useState, useEffect, useMemo } from "react";
import { MOCK_SESSIONS } from "@/lib/mock-data";
import { Session } from "@/types/firestore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScheduleGridCell } from "@/components/schedule/schedule-grid-cell";
import { AgendaSessionCard } from "@/components/schedule/agenda-session-card";
import { Save, Calendar, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { saveAgendaToFirestore, loadAgendaFromFirestore, syncAgenda } from "@/lib/agenda";

const DAYS = [
    { id: "day1", label: "Tue, 07 July", date: 7 },
    { id: "day2", label: "Wed, 08 July", date: 8 },
    { id: "day3", label: "Thu, 09 July", date: 9 },
];

export default function SchedulePage() {
    const { user } = useAuth();
    const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState("day1");
    const [showAuthDialog, setShowAuthDialog] = useState(false);
    const [justSaved, setJustSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Load agenda when user logs in or on mount
    useEffect(() => {
        const loadAgenda = async () => {
            if (user) {
                setIsLoading(true);
                try {
                    // Load from Firestore
                    const sessions = await loadAgendaFromFirestore(user.uid);
                    setSelectedSessions(sessions);
                } catch (error) {
                    console.error('Error loading agenda:', error);
                    // Fallback to localStorage
                    const saved = localStorage.getItem("selectedSessions");
                    if (saved) {
                        setSelectedSessions(JSON.parse(saved));
                    }
                } finally {
                    setIsLoading(false);
                }
            } else {
                // Not logged in, use localStorage
                const saved = localStorage.getItem("selectedSessions");
                if (saved) {
                    setSelectedSessions(JSON.parse(saved));
                }
            }
        };

        loadAgenda();
        
        // Check for hash to navigate to specific day
        const hash = window.location.hash;
        if (hash) {
            const dayMatch = hash.match(/#day(\d+)/);
            if (dayMatch) {
                const dayNum = dayMatch[1];
                setActiveTab(`day${dayNum}`);
            }
        }
    }, [user]);

    const toggleSelect = (sessionId: string) => {
        if (!user) {
            setShowAuthDialog(true);
            return;
        }

        setSelectedSessions(prev => {
            const newSelected = prev.includes(sessionId)
                ? prev.filter(id => id !== sessionId)
                : [...prev, sessionId];
            
            // Save to localStorage for backup
            localStorage.setItem("selectedSessions", JSON.stringify(newSelected));
            
            return newSelected;
        });
    };

    const saveAgenda = async () => {
        if (!user) {
            setShowAuthDialog(true);
            return;
        }
        
        setIsLoading(true);
        try {
            await saveAgendaToFirestore(user.uid, selectedSessions);
            setJustSaved(true);
            setTimeout(() => setJustSaved(false), 2000);
        } catch (error) {
            console.error('Error saving agenda:', error);
            alert('Failed to save agenda. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const currentDay = DAYS.find(d => d.id === activeTab);

    const daySessions = MOCK_SESSIONS.filter(session => {
        const sessionDate = session.startTime.toDate().getDate();
        return sessionDate === currentDay?.date;
    });

    // No conflict detection - users can select overlapping sessions

    // Group sessions by time slot and track/location
    const scheduleGrid = useMemo(() => {
        // Get unique time slots (all sessions including breaks/plenary)
        const allTimeSlots = Array.from(new Set(daySessions.map(s => s.startTime.seconds))).sort((a, b) => a - b);

        // Get unique tracks/rooms (filter out service sessions and plenary)
        const tracks = Array.from(
            new Set(
                daySessions
                    .filter(s => !s.isService && s.track && s.track !== "Plenary")
                    .map(s => s.location || s.track || "Unknown")
            )
        ).sort();

        return { allTimeSlots, tracks };
    }, [daySessions]);

    const getSessionsForSlot = (timeSlot: number, trackOrRoom: string) => {
        return daySessions.filter(s => 
            s.startTime.seconds === timeSlot && 
            (s.location === trackOrRoom || s.track === trackOrRoom)
        );
    };

    const selectedCount = selectedSessions.filter(id => 
        daySessions.some(s => s.id === id && !s.isService)
    ).length;

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-primary mb-2">Conference Schedule</h1>
                    <p className="text-muted-foreground">
                        {user 
                            ? "Click on sessions to add them to your personal agenda" 
                            : "Sign in to save your agenda and sync across devices"}
                    </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <Button 
                        onClick={user ? saveAgenda : () => setShowAuthDialog(true)}
                        disabled={isLoading || selectedCount === 0}
                        className="gap-2"
                        variant={justSaved ? "secondary" : "default"}
                    >
                        <Save className="h-4 w-4" />
                        {isLoading ? "Saving..." : justSaved ? "Saved!" : user ? "Save Agenda" : "Sign In to Save"}
                    </Button>
                    {selectedCount > 0 && (
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {selectedCount} session{selectedCount !== 1 ? 's' : ''} selected
                        </div>
                    )}
                </div>
            </div>

            <Tabs defaultValue="day1" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start overflow-x-auto mb-6 h-auto flex-wrap gap-2 bg-transparent p-0">
                    {DAYS.map(day => (
                        <TabsTrigger
                            key={day.id}
                            value={day.id}
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border bg-card min-w-[120px]"
                        >
                            {day.label}
                        </TabsTrigger>
                    ))}
                    <TabsTrigger 
                        value="agenda" 
                        className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white border bg-card ml-auto gap-2"
                    >
                        <Star className="h-4 w-4" />
                        My Agenda ({selectedCount})
                    </TabsTrigger>
                </TabsList>

                {DAYS.map(day => (
                    <TabsContent key={day.id} value={day.id} className="mt-0">
                        <div className="space-y-6">
                            {/* Render all time slots in chronological order */}
                            {scheduleGrid.allTimeSlots.map(timeSlot => {
                                const time = new Date(timeSlot * 1000);
                                const sessionsAtTime = daySessions.filter(s => s.startTime.seconds === timeSlot);
                                
                                // Check if this is a plenary/service session
                                const plenaryOrService = sessionsAtTime.find(s => s.isService || s.track === "Plenary");
                                
                                if (plenaryOrService) {
                                    // Full-width plenary or service session
                                    return (
                                        <div key={timeSlot} className="relative">
                                            <ScheduleGridCell
                                                session={plenaryOrService}
                                                isSelected={selectedSessions.includes(plenaryOrService.id)}
                                                onToggleSelect={toggleSelect}
                                            />
                                        </div>
                                    );
                                }

                                // Parallel sessions - render in grid
                                const hasParallelSessions = scheduleGrid.tracks.some(track => 
                                    getSessionsForSlot(timeSlot, track).length > 0
                                );

                                if (!hasParallelSessions) return null;

                                return (
                                    <div key={timeSlot} className="border rounded-lg overflow-hidden">
                                        {/* Time header and track columns */}
                                        <div 
                                            className="grid gap-2 p-4"
                                            style={{ gridTemplateColumns: `120px repeat(${scheduleGrid.tracks.length}, 1fr)` }}
                                        >
                                            <div className="text-sm font-medium text-muted-foreground pt-2">
                                                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            {scheduleGrid.tracks.map(track => {
                                                const sessions = getSessionsForSlot(timeSlot, track);
                                                return (
                                                    <div key={track} className="relative">
                                                        {sessions.length > 0 ? (
                                                            sessions.map(session => (
                                                                <div key={session.id} className="mb-2 last:mb-0">
                                                                    <ScheduleGridCell
                                                                        session={session}
                                                                        isSelected={selectedSessions.includes(session.id)}
                                                                        onToggleSelect={toggleSelect}
                                                                    />
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="h-full min-h-[60px] border-2 border-dashed border-muted/50 rounded-lg" />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </TabsContent>
                ))}

                {/* My Agenda Tab */}
                <TabsContent value="agenda" className="mt-0">
                    {selectedCount === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">
                            <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold mb-2">No sessions selected yet</h3>
                            <p className="text-sm">
                                Click on sessions in the schedule to add them to your personal agenda
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b">
                                <div>
                                    <h2 className="text-2xl font-bold">My Personal Agenda</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {selectedCount} session{selectedCount !== 1 ? 's' : ''} selected
                                    </p>
                                </div>
                            </div>

                            {/* Group by day */}
                            {DAYS.map(day => {
                                const daySelected = MOCK_SESSIONS.filter(s => {
                                    const sessionDate = s.startTime.toDate().getDate();
                                    return sessionDate === day.date && selectedSessions.includes(s.id) && !s.isService;
                                }).sort((a, b) => a.startTime.seconds - b.startTime.seconds);

                                if (daySelected.length === 0) return null;

                                return (
                                    <div key={day.id}>
                                        <h3 className="text-lg font-semibold mb-4 text-primary">{day.label}</h3>
                                        <div className="space-y-3">
                                            {daySelected.map(session => (
                                                <AgendaSessionCard
                                                    key={session.id}
                                                    session={session}
                                                    onRemove={toggleSelect}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            <AuthDialog isOpen={showAuthDialog} onOpenChange={setShowAuthDialog} />
        </div>
    );
}
