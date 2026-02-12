
"use client";

import { Session } from "@/types/firestore";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/auth/auth-dialog";

interface SessionCardProps {
    session: Session;
    isStarred: boolean;
    onToggleStar: (sessionId: string) => void;
}

export function SessionCard({ session, isStarred, onToggleStar }: SessionCardProps) {
    const { user } = useAuth();
    const [showAuthDialog, setShowAuthDialog] = useState(false);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const startTime = session.startTime.toDate();
    const endTime = session.endTime.toDate();

    const handleStarClick = () => {
        if (!user) {
            setShowAuthDialog(true);
        } else {
            onToggleStar(session.id);
        }
    };

    return (
        <>
            <Card className={cn("mb-4 transition-colors", isStarred ? "border-primary/50 bg-primary/5" : "")}>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            {session.track && <Badge variant="secondary" className="mb-1">{session.track}</Badge>}
                            <CardTitle className="text-xl font-bold text-primary">{session.title}</CardTitle>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleStarClick}
                            className={cn("hover:text-yellow-500", isStarred ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground")}
                        >
                            <Star className={cn("h-5 w-5", isStarred ? "fill-current" : "")} />
                        </Button>
                    </div>
                    <CardDescription className="flex items-center gap-4 text-sm mt-1">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatTime(startTime)} - {formatTime(endTime)}</span>
                        {session.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {session.location}</span>}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {session.speakers && session.speakers.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                            <span className="font-semibold">Speakers: </span>
                            {session.speakers.map(s => s.name).join(", ")}
                        </div>
                    )}
                </CardContent>
                {session.paperId && (
                    <CardFooter className="pt-0">
                        <Button variant="outline" size="sm" className="w-full">View Abstract</Button>
                    </CardFooter>
                )}
            </Card>

            <AuthDialog isOpen={showAuthDialog} onOpenChange={setShowAuthDialog} />
        </>
    );
}
