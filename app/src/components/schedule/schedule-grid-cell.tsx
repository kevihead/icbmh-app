"use client";

import { Session } from "@/types/firestore";
import { cn } from "@/lib/utils";
import { Clock, MapPin, Users, FileText } from "lucide-react";
import Link from "next/link";

interface ScheduleGridCellProps {
    session: Session;
    isSelected: boolean;
    isHighlighted?: boolean;
    onToggleSelect: (sessionId: string) => void;
}

export function ScheduleGridCell({ session, isSelected, isHighlighted = false, onToggleSelect }: ScheduleGridCellProps) {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const startTime = session.startTime.toDate();
    const endTime = session.endTime.toDate();
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60); // Duration in minutes

    // Calculate height based on duration (each 30 min = 60px base height)
    const height = Math.max((duration / 30) * 60, 60);

    const handleClick = () => {
        if (!session.isService) {
            onToggleSelect(session.id);
        }
    };

    if (session.isService) {
        return (
            <div
                id={`session-${session.id}`}
                className="border-2 border-dashed border-muted bg-muted/20 p-3 rounded-lg"
                style={{ minHeight: `${height}px` }}
            >
                <div className="text-sm font-medium text-muted-foreground text-center">
                    {session.title}
                </div>
                <div className="text-xs text-muted-foreground text-center mt-1 flex items-center justify-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(startTime)} - {formatTime(endTime)}
                </div>
            </div>
        );
    }

    return (
        <div
            id={`session-${session.id}`}
            onClick={handleClick}
            className={cn(
                "border-2 p-3 rounded-lg cursor-pointer transition-all hover:shadow-md",
                isSelected && "border-primary bg-primary/10 shadow-lg",
                !isSelected && "border-border bg-card hover:border-primary/50",
                isHighlighted && "ring-2 ring-primary shadow-xl scale-[1.02]"
            )}
            style={{ minHeight: `${height}px` }}
        >
            <div className="flex flex-col h-full">
                <div className="flex-1">
                    <h3 className="font-semibold text-sm leading-tight mb-2">
                        {session.title}
                    </h3>
                    {session.speakers && session.speakers.length > 0 && (
                        <div className="text-xs text-muted-foreground flex items-start gap-1 mb-1">
                            <Users className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{session.speakers.map(s => s.name).join(", ")}</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 pt-2 border-t">
                    <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(startTime)}
                    </span>
                    {session.location && (
                        <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {session.location}
                        </span>
                    )}
                </div>
                {session.paperId && (
                    <Link 
                        href={`/papers?paper=${session.paperId}`}
                        className="flex items-center gap-1 text-xs text-primary hover:underline mt-2 pt-2 border-t"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <FileText className="h-3 w-3" />
                        View Abstract
                    </Link>
                )}
            </div>
            {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
            )}
        </div>
    );
}
