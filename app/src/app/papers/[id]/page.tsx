import { MOCK_ABSTRACTS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Users, Tag } from "lucide-react";
import Link from "next/link";

// Generate static params for all papers
export function generateStaticParams() {
    return MOCK_ABSTRACTS.map((paper) => ({
        id: paper.id,
    }));
}

export default function PaperPage({ params }: { params: { id: string } }) {
    const paperId = params.id;
    
    const paper = MOCK_ABSTRACTS.find(p => p.id === paperId);

    if (!paper) {
        return (
            <div className="container mx-auto py-16 px-4 text-center">
                <h1 className="text-4xl font-bold mb-4">Paper Not Found</h1>
                <p className="text-muted-foreground mb-8">The requested paper could not be found.</p>
                <Link href="/papers">
                    <Button>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Papers
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <Link href="/papers">
                <Button variant="ghost" className="mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Papers
                </Button>
            </Link>

            <Card>
                <CardHeader>
                    <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <Badge variant="secondary" className="mb-3">
                                    Paper ID: {paper.id.toUpperCase()}
                                </Badge>
                                <CardTitle className="text-3xl font-bold text-primary">
                                    {paper.title}
                                </CardTitle>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span className="text-sm">{paper.authors.join(", ")}</span>
                        </div>

                        {paper.keywords && paper.keywords.length > 0 && (
                            <div className="flex items-start gap-2">
                                <Tag className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                                <div className="flex flex-wrap gap-2">
                                    {paper.keywords.map((keyword) => (
                                        <Badge key={keyword} variant="outline" className="text-xs">
                                            {keyword}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Abstract</h3>
                        <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                            {paper.body.split('\n\n').map((paragraph, index) => (
                                <p key={index} className="mb-4">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>

                    {paper.pdfUrl && (
                        <div className="pt-4 border-t">
                            <Button className="w-full sm:w-auto">
                                <Download className="mr-2 h-4 w-4" />
                                Download Full Paper (PDF)
                            </Button>
                        </div>
                    )}

                    {paper.sessionId && (
                        <div className="pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                This paper is associated with session: <span className="font-mono">{paper.sessionId}</span>
                            </p>
                            <Link href={`/schedule?session=${paper.sessionId}`}>
                                <Button variant="outline" className="mt-2">
                                    View in Schedule
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
