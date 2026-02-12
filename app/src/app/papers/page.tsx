
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MOCK_ABSTRACTS, MOCK_SESSIONS } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, ChevronDown, ChevronUp, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { saveAgendaToFirestore, loadAgendaFromFirestore } from "@/lib/agenda";
import Link from "next/link";

function PapersContent() {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedPapers, setExpandedPapers] = useState<Set<string>>(new Set());
    const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
    const [showAuthDialog, setShowAuthDialog] = useState(false);
    const searchParams = useSearchParams();
    const { user } = useAuth();
    
    // Load agenda when user logs in or on mount
    useEffect(() => {
        const loadAgenda = async () => {
            if (user) {
                try {
                    const sessions = await loadAgendaFromFirestore(user.uid);
                    setSelectedSessions(sessions);
                } catch (error) {
                    console.error('Error loading agenda:', error);
                    const saved = localStorage.getItem("selectedSessions");
                    if (saved) {
                        setSelectedSessions(JSON.parse(saved));
                    }
                }
            } else {
                const saved = localStorage.getItem("selectedSessions");
                if (saved) {
                    setSelectedSessions(JSON.parse(saved));
                }
            }
        };

        loadAgenda();
    }, [user]);
    
    // Check if there's a paper to focus on from URL params
    useEffect(() => {
        const focusPaperId = searchParams.get('paper');
        if (focusPaperId) {
            setExpandedPapers(new Set([focusPaperId]));
            // Scroll to the paper
            setTimeout(() => {
                const element = document.getElementById(`paper-${focusPaperId}`);
                element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [searchParams]);
    
    const toggleExpanded = (paperId: string) => {
        setExpandedPapers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(paperId)) {
                newSet.delete(paperId);
            } else {
                newSet.add(paperId);
            }
            return newSet;
        });
    };
    
    const toggleAgenda = async (sessionId: string) => {
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

    const filteredPapers = MOCK_ABSTRACTS.filter(paper => {
        const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            paper.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
            paper.keywords?.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesSearch;
    });

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <h1 className="text-4xl font-extrabold text-primary mb-2">Abstract Library</h1>
            <p className="text-muted-foreground mb-8">Browse and search conference papers.</p>

            <div className="relative mb-8">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by title, author, or keyword..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="space-y-4">
                {filteredPapers.length > 0 ? (
                    filteredPapers.map(paper => {
                        const session = MOCK_SESSIONS.find(s => s.id === paper.sessionId);
                        const isExpanded = expandedPapers.has(paper.id);
                        const isInAgenda = session && selectedSessions.includes(session.id);
                        
                        return (
                            <Card 
                                key={paper.id} 
                                id={`paper-${paper.id}`}
                                className={`transition-all ${isExpanded ? 'border-primary shadow-lg' : 'hover:border-primary/50'}`}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <CardTitle className="text-xl text-primary flex items-center gap-2">
                                                <FileText className="h-5 w-5" />
                                                {paper.title}
                                            </CardTitle>
                                            <CardDescription className="mt-2">
                                                {paper.authors.join(", ")}
                                            </CardDescription>
                                        </div>
                                        {session && (
                                            <Button
                                                size="sm"
                                                variant={isInAgenda ? "default" : "outline"}
                                                onClick={() => toggleAgenda(session.id)}
                                                className="gap-2"
                                            >
                                                <Star className={`h-4 w-4 ${isInAgenda ? 'fill-current' : ''}`} />
                                                {isInAgenda ? 'In Agenda' : 'Add to Agenda'}
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className={`text-sm text-muted-foreground mb-3 ${!isExpanded ? 'line-clamp-3' : ''}`}>
                                        {paper.body}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {paper.keywords?.map(keyword => (
                                            <Badge key={keyword} variant="secondary" className="text-xs">
                                                {keyword}
                                            </Badge>
                                        ))}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleExpanded(paper.id)}
                                        className="gap-2 text-primary"
                                    >
                                        {isExpanded ? (
                                            <>
                                                Show Less <ChevronUp className="h-4 w-4" />
                                            </>
                                        ) : (
                                            <>
                                                Read More <ChevronDown className="h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                                {session && (
                                    <CardFooter className="bg-muted/20 border-t pt-4">
                                        <div className="text-sm w-full">
                                            <div className="mb-1">
                                                <span className="font-medium text-muted-foreground">Presented in: </span>
                                                <span className="font-semibold">{session.location || 'TBD'}</span>
                                            </div>
                                            <div>
                                                <Link 
                                                    href={`/schedule?session=${session.id}`} 
                                                    className="text-primary hover:underline font-semibold"
                                                >
                                                    {session.title}
                                                </Link>
                                                {session.startTime && (
                                                    <span className="text-muted-foreground ml-2">
                                                        • {new Date(session.startTime.seconds * 1000).toLocaleDateString('en-US', { 
                                                            weekday: 'short'
                                                        })}, {new Date(session.startTime.seconds * 1000).toLocaleTimeString('en-US', { 
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </CardFooter>
                                )}
                            </Card>
                        );
                    })
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        No papers found matching your search.
                    </div>
                )}
            </div>
            
            <AuthDialog isOpen={showAuthDialog} onOpenChange={setShowAuthDialog} />
        </div>
    );
}

export default function PapersPage() {
    return (
        <Suspense fallback={<div className="container mx-auto py-8 px-4 max-w-4xl"><p>Loading...</p></div>}>
            <PapersContent />
        </Suspense>
    );
}
