
"use client";

import { useState } from "react";
import { MOCK_ABSTRACTS, MOCK_SESSIONS } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PapersPage() {
    const [searchQuery, setSearchQuery] = useState("");

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
                        return (
                            <Card key={paper.id} className="transition-all hover:border-primary/50">
                                <CardHeader>
                                    <CardTitle className="text-xl text-primary flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        {paper.title}
                                    </CardTitle>
                                    <CardDescription>
                                        {paper.authors.join(", ")}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                                        {paper.body}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {paper.keywords?.map(keyword => (
                                            <Badge key={keyword} variant="secondary" className="text-xs">
                                                {keyword}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between items-center bg-muted/20 border-t pt-4">
                                    {session ? (
                                        <div className="text-sm">
                                            <span className="font-medium text-muted-foreground">Presented in: </span>
                                            <Link href={`/schedule?highlight=${session.id}`} className="text-primary hover:underline font-semibold">
                                                {session.title}
                                            </Link>
                                        </div>
                                    ) : <div></div>}
                                    <Button variant="ghost" size="sm" className="gap-1 text-primary">
                                        Read Full Paper <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        No papers found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}
