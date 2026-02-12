"use client";

import { Session } from "@/types/firestore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users, X, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AgendaSessionCardProps {
    session: Session;
    onRemove: (sessionId: string) => void;
}

export function AgendaSessionCard({ session, onRemove }: AgendaSessionCardProps) {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const startTime = session.startTime.toDate();
    const endTime = session.endTime.toDate();

    return (
        <Card className="relative">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            {session.track && (
                                <Badge variant="secondary" className="text-xs">
                                    {session.track}
                                </Badge>
                            )}
                        </div>
                        <h3 className="font-semibold text-lg text-primary">
                            {session.title}
                        </h3>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onRemove(session.id)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{formatDate(startTime)}</span>
                        <span>• {formatTime(startTime)} - {formatTime(endTime)}</span>
                    </div>
                    {session.location && (
                        <div className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            <span>{session.location}</span>
                        </div>
                    )}
                </div>
                {session.speakers && session.speakers.length > 0 && (
                    <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mt-0.5" />
                        <span>{session.speakers.map(s => s.name).join(", ")}</span>
                    </div>
                )}
                {session.paperId && (
                    <Link 
                        href={`/papers?paper=${session.paperId}`}
                        className="flex items-center gap-1.5 text-sm text-primary hover:underline mt-2"
                    >
                        <FileText className="h-4 w-4" />
                        View Abstract
                    </Link>
                )}
            </CardContent>
        </Card>
    );
}
