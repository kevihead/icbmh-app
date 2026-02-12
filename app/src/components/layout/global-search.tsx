
"use client";

import * as React from "react";
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    Search,
    FileText
} from "lucide-react";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
    Command,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { MOCK_SESSIONS, MOCK_ABSTRACTS } from "@/lib/mock-data";
import { useRouter } from "next/navigation";

export function GlobalSearch() {
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const router = useRouter();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        setSearchQuery("");
        command();
    }, []);

    // Filter sessions and papers based on search query
    const filteredSessions = React.useMemo(() => {
        if (!searchQuery) return MOCK_SESSIONS.filter(s => !s.isService).slice(0, 8);
        
        const query = searchQuery.toLowerCase();
        return MOCK_SESSIONS.filter(s => 
            !s.isService && (
                s.title.toLowerCase().includes(query) ||
                s.description?.toLowerCase().includes(query) ||
                s.track?.toLowerCase().includes(query) ||
                s.location?.toLowerCase().includes(query) ||
                s.speakers?.some(speaker => 
                    speaker.name.toLowerCase().includes(query) ||
                    speaker.affiliation?.toLowerCase().includes(query) ||
                    speaker.bio?.toLowerCase().includes(query)
                )
            )
        ).slice(0, 10);
    }, [searchQuery]);

    const filteredPapers = React.useMemo(() => {
        if (!searchQuery) return MOCK_ABSTRACTS.slice(0, 8);
        
        const query = searchQuery.toLowerCase();
        return MOCK_ABSTRACTS.filter(p => 
            p.title.toLowerCase().includes(query) ||
            p.authors.some(a => a.toLowerCase().includes(query)) ||
            p.keywords?.some(k => k.toLowerCase().includes(query)) ||
            p.body.toLowerCase().includes(query) ||
            // Extract university/affiliation from author names (format: "Name (University)")
            p.authors.some(a => {
                const affiliationMatch = a.match(/\(([^)]+)\)/);
                return affiliationMatch && affiliationMatch[1].toLowerCase().includes(query);
            })
        ).slice(0, 10);
    }, [searchQuery]);

    return (
        <>
            <Button
                variant="outline"
                className="text-muted-foreground text-sm gap-2 w-full md:w-64 justify-start"
                onClick={() => setOpen(true)}
            >
                <Search className="h-4 w-4" />
                <span>Search...</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <Command shouldFilter={false}>
                    <CommandInput 
                        placeholder="Search sessions, papers, authors..." 
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                    />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        {filteredSessions.length > 0 && (
                            <>
                                <CommandGroup heading={`Sessions (${filteredSessions.length})`}>
                                    {filteredSessions.map(session => {
                                        const speakerNames = session.speakers?.map(s => s.name).join(", ");
                                        return (
                                            <CommandItem 
                                                key={session.id} 
                                                value={`session-${session.id}`}
                                                onSelect={() => runCommand(() => router.push(`/schedule?session=${session.id}`))}
                                            >
                                                <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                                                <div className="flex flex-col items-start overflow-hidden">
                                                    <span className="font-medium truncate w-full">{session.title}</span>
                                                    {speakerNames && (
                                                        <span className="text-xs text-muted-foreground truncate w-full">
                                                            {speakerNames} • {session.location || session.track}
                                                        </span>
                                                    )}
                                                </div>
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                                <CommandSeparator />
                            </>
                        )}
                        {filteredPapers.length > 0 && (
                            <CommandGroup heading={`Papers (${filteredPapers.length})`}>
                                {filteredPapers.map(paper => {
                                    const firstAuthor = paper.authors[0];
                                    const authorCount = paper.authors.length;
                                    const authorText = authorCount > 1 ? `${firstAuthor} +${authorCount - 1}` : firstAuthor;
                                    return (
                                        <CommandItem 
                                            key={paper.id} 
                                            value={`paper-${paper.id}`}
                                            onSelect={() => runCommand(() => router.push(`/papers?paper=${paper.id}`))}
                                        >
                                            <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
                                            <div className="flex flex-col items-start overflow-hidden">
                                                <span className="font-medium truncate w-full">{paper.title}</span>
                                                <span className="text-xs text-muted-foreground truncate w-full">
                                                    {authorText}
                                                    {paper.keywords && paper.keywords.length > 0 && ` • ${paper.keywords[0]}`}
                                                </span>
                                            </div>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </CommandDialog>
        </>
    );
}
