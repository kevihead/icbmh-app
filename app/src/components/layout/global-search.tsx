
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
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { MOCK_SESSIONS, MOCK_ABSTRACTS } from "@/lib/mock-data";
import { useRouter } from "next/navigation";

export function GlobalSearch() {
    const [open, setOpen] = React.useState(false);
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
        command();
    }, []);

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
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Sessions">
                        {MOCK_SESSIONS.slice(0, 5).map(session => (
                            <CommandItem key={session.id} onSelect={() => runCommand(() => router.push(`/schedule?highlight=${session.id}`))}>
                                <Calendar className="mr-2 h-4 w-4" />
                                <span>{session.title}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Papers">
                        {MOCK_ABSTRACTS?.slice(0, 5).map(paper => (
                            <CommandItem key={paper.id} onSelect={() => runCommand(() => router.push(`/papers?highlight=${paper.id}`))}>
                                <FileText className="mr-2 h-4 w-4" />
                                <span>{paper.title}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
