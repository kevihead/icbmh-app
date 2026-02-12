
"use client";

import Link from "next/link";
import Image from "next/image";
import { GlobalSearch } from "./global-search";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { AuthDialog } from "@/components/auth/auth-dialog";

export function Navbar() {
    const { user, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [showAuthDialog, setShowAuthDialog] = useState(false);
    const [authTab, setAuthTab] = useState<"signin" | "register">("signin");

    const openAuth = (tab: "signin" | "register") => {
        setAuthTab(tab);
        setShowAuthDialog(true);
        setIsOpen(false); // Close mobile menu if open
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center px-4">
                    {/* Mobile Menu */}
                    <div className="md:hidden mr-2">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[80vw] sm:w-[350px]">
                                <SheetHeader>
                                    <SheetTitle className="text-left flex items-center gap-2">
                                        <Image src="/logo.png" alt="Logo" width={24} height={24} />
                                        ICBMH 2026
                                    </SheetTitle>
                                </SheetHeader>
                                <nav className="flex flex-col gap-4 mt-8">
                                    <Link href="/" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary">Home</Link>
                                    <Link href="/schedule" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary">Schedule</Link>
                                    <Link href="/papers" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary">Papers</Link>
                                    {user ? (
                                        <button onClick={() => { signOut(); setIsOpen(false); }} className="text-lg font-medium hover:text-primary text-left">
                                            Sign Out
                                        </button>
                                    ) : (
                                        <button onClick={() => openAuth("signin")} className="text-lg font-medium hover:text-primary text-left">
                                            Sign In / Register
                                        </button>
                                    )}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Logo & Desktop Nav */}
                    <div className="mr-4 flex">
                        <Link href="/" className="mr-6 flex items-center space-x-2">
                            <Image src="/logo.png" alt="ICBMH Logo" width={32} height={32} className="h-8 w-auto" />
                            <span className="hidden font-bold sm:inline-block text-primary">
                                ICBMH 2026
                            </span>
                        </Link>
                        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                            <Link href="/schedule" className="transition-colors hover:text-foreground/80 text-foreground/60">
                                Schedule
                            </Link>
                            <Link href="/papers" className="transition-colors hover:text-foreground/80 text-foreground/60">
                                Papers
                            </Link>
                        </nav>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex flex-1 items-center justify-end space-x-2">
                        <div className="w-full max-w-[200px] md:max-w-[260px]">
                            <GlobalSearch />
                        </div>
                        <nav className="flex items-center">
                            {user ? (
                                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                                    Sign Out
                                </Button>
                            ) : (
                                <Button size="sm" onClick={() => openAuth("register")}>Register</Button>
                            )}
                        </nav>
                    </div>
                </div>
            </header>
            <AuthDialog isOpen={showAuthDialog} onOpenChange={setShowAuthDialog} defaultTab={authTab} />
        </>
    );
}
