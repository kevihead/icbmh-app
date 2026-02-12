"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MOCK_SESSIONS } from "@/lib/mock-data";
import { Session } from "@/types/firestore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScheduleGridCell } from "@/components/schedule/schedule-grid-cell";
import { AgendaSessionCard } from "@/components/schedule/agenda-session-card";
import { Save, Calendar, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { saveAgendaToFirestore, loadAgendaFromFirestore } from "@/lib/agenda";

const DAYS = [
    { id: "day1", label: "Tue, 07 July", date: 7 },
    { id: "day2", label: "Wed, 08 July", date: 8 },
    { id: "day3", label: "Thu, 09 July", date: 9 },
];

export default function SchedulePage() {
    return (
        <Suspense fallback={<div className="container mx-auto py-8 px-4 text-center">Loading...</div>}>
            <ScheduleContent />
        </Suspense>
    );
}

function ScheduleContent() {
    const { user, loading: authLoading } = useAuth();
    const searchParams = useSearchParams();
    const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState("day1");
    const [showAuthDialog, setShowAuthDialog] = useState(false);
    const [justSaved, setJustSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [highlightedSession, setHighlightedSession] = useState<string | null>(null);
    const [pendingScrollSession, setPendingScrollSession] = useState<string | null>(null);

    const waitForAndScrollToSession = (sessionId: string) => {
        const selector = `#session-${CSS.escape(sessionId)}`;
        const startedAt = performance.now();
        const maxWaitMs = 7000;

        const scrollingElement = () => (document.scrollingElement ?? document.documentElement);

        const isLaidOutAndVisible = (el: HTMLElement) => {
            // If an element is display:none, offsetParent is null and client rects are empty.
            if (el.getClientRects().length === 0) return false;
            const rect = el.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) return false;

            const cs = getComputedStyle(el);
            if (cs.display === "none" || cs.visibility === "hidden") return false;

            return true;
        };

        const pickBestTarget = () => {
            const candidates = Array.from(document.querySelectorAll<HTMLElement>(selector));
            if (candidates.length === 0) return null;

            // Prefer the element that is actually laid out at this breakpoint.
            const laidOut = candidates.find(isLaidOutAndVisible);
            return laidOut ?? candidates[0];
        };

        const scrollVerticalToElement = (el: HTMLElement) => {
            const se = scrollingElement();
            const rect = el.getBoundingClientRect();
            const targetTop = se.scrollTop + rect.top - window.innerHeight / 2;
            se.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
        };

        const scrollHorizontalIntoViewIfNeeded = (el: HTMLElement) => {
            const scroller = el.closest<HTMLElement>(".overflow-x-auto");
            if (!scroller || getComputedStyle(scroller).display === "none") return;

            const scrollerRect = scroller.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();

            if (elRect.left >= scrollerRect.left && elRect.right <= scrollerRect.right) return;

            const elCenter = elRect.left + elRect.width / 2;
            const scrollerCenter = scrollerRect.left + scrollerRect.width / 2;
            scroller.scrollBy({ left: elCenter - scrollerCenter, behavior: "smooth" });
        };

        const tick = () => {
            const el = pickBestTarget();

            if (el && isLaidOutAndVisible(el)) {
                scrollVerticalToElement(el);
                requestAnimationFrame(() => {
                    scrollHorizontalIntoViewIfNeeded(el);
                    // Re-assert vertical position after any layout/horizontal adjustments
                    scrollVerticalToElement(el);
                });
                return;
            }

            if (performance.now() - startedAt >= maxWaitMs) return;
            requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    };

    const handleSessionHighlight = (sessionId: string) => {
        setHighlightedSession(sessionId);

        const session = MOCK_SESSIONS.find((s) => s.id === sessionId);
        if (session) {
            const sessionDate = session.startTime.toDate().getDate();
            const dayNum = sessionDate === 7 ? 1 : sessionDate === 8 ? 2 : 3;
            setActiveTab(`day${dayNum}`);
        }

        // Scroll once the element is actually in the DOM (tab content + grid).
        // Using rAF polling avoids brittle timeout tuning and survives auth re-renders.
        waitForAndScrollToSession(sessionId);

        setTimeout(() => setHighlightedSession(null), 3500);
    };

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
        
        // Check for hash to navigate to specific day and/or session on mount
        const hash = window.location.hash;
        if (hash) {
            // Check for day navigation
            const dayMatch = hash.match(/#day(\d+)/);
            if (dayMatch) {
                const dayNum = dayMatch[1];
                setActiveTab(`day${dayNum}`);
            }
            
            // Check for session highlighting
            const sessionMatch = hash.match(/#session-(.+)/);
            if (sessionMatch) {
                const sessionId = sessionMatch[1];
                setPendingScrollSession(sessionId);
            }
        }
        
        // Check for query parameter session
        const sessionParam = searchParams.get('session');
        if (sessionParam) {
            setPendingScrollSession(sessionParam);
        }
    }, [user, searchParams]);

    // Handle pending scroll after auth is loaded
    useEffect(() => {
        if (!authLoading && pendingScrollSession) {
            handleSessionHighlight(pendingScrollSession);
            setPendingScrollSession(null);
        }
    }, [authLoading, pendingScrollSession]);

    // Handle hash changes (when navigating from search)
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            
            // Check for session highlighting
            const sessionMatch = hash.match(/#session-(.+)/);
            if (sessionMatch) {
                const sessionId = sessionMatch[1];
                handleSessionHighlight(sessionId);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

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
        <div className="container mx-auto py-8 px-4 max-w-7xl pb-24 md:pb-8">
            {/* Sticky Save Button for Mobile */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t p-4 shadow-lg">
                <Button 
                    onClick={user ? saveAgenda : () => setShowAuthDialog(true)}
                    disabled={isLoading || selectedCount === 0}
                    className="w-full gap-2"
                    variant={justSaved ? "secondary" : "default"}
                >
                    <Save className="h-4 w-4" />
                    {isLoading ? "Saving..." : justSaved ? "Saved!" : user ? "Save Agenda" : "Sign In to Save"}
                    {selectedCount > 0 && <span className="ml-auto">({selectedCount})</span>}
                </Button>
            </div>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2">Conference Schedule</h1>
                    <p className="text-sm md:text-base text-muted-foreground">
                        {user 
                            ? "Click on sessions to add them to your personal agenda" 
                            : "Sign in to save your agenda and sync across devices"}
                    </p>
                </div>
                {/* Desktop Save Button */}
                <div className="hidden md:flex flex-col items-end gap-2">
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
                                                isHighlighted={highlightedSession === plenaryOrService.id}
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
                                        {/* Mobile: Stacked layout */}
                                        <div className="md:hidden p-4 space-y-3">
                                            <div className="text-sm font-semibold text-primary pb-2 border-b">
                                                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            {scheduleGrid.tracks.map(track => {
                                                const sessions = getSessionsForSlot(timeSlot, track);
                                                if (sessions.length === 0) return null;
                                                return (
                                                    <div key={track} className="space-y-2">
                                                        {sessions.map(session => (
                                                            <ScheduleGridCell
                                                                key={session.id}
                                                                session={session}
                                                                isSelected={selectedSessions.includes(session.id)}
                                                                isHighlighted={highlightedSession === session.id}
                                                                onToggleSelect={toggleSelect}
                                                            />
                                                        ))}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Desktop: Grid layout with horizontal scroll */}
                                        <div className="hidden md:block overflow-x-auto">
                                            <div 
                                                className="grid gap-2 p-4 min-w-max"
                                                style={{ gridTemplateColumns: `120px repeat(${scheduleGrid.tracks.length}, minmax(250px, 1fr))` }}
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
                                                                            isHighlighted={highlightedSession === session.id}
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
