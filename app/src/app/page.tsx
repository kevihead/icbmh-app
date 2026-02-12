
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthDialog } from "@/components/auth/auth-dialog";

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleOpenAuth = () => {
    setShowAuthDialog(true);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      <AuthDialog isOpen={showAuthDialog} onOpenChange={setShowAuthDialog} />
      {/* Hero Section */}
      <section className="w-full flex-1 flex flex-col justify-center items-center py-12 md:py-24 lg:py-32 xl:py-48 bg-primary text-primary-foreground text-center">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                ICBMH 2026
              </h1>
              <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
                15th International Conference on Bulk Materials Storage, Handling & Transportation
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/schedule">
                <Button variant="secondary" size="lg" className="font-semibold">
                  View Schedule
                </Button>
              </Link>
              {!user && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleOpenAuth}
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  Sign In / Register
                </Button>
              )}
              {user && (
                <Link href="/schedule?tab=favorites">
                  <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    My Agenda
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background flex flex-col justify-center items-center">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12 text-center">
            <Card className="flex flex-col items-center">
              <CardHeader className="flex flex-col items-center gap-4 pb-2">
                <Calendar className="w-10 h-10 text-secondary" />
                <CardTitle>Date & Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">07 - 09 July 2026</p>
                <p className="text-sm text-muted-foreground">3 Days of Technical Sessions</p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center">
              <CardHeader className="flex flex-col items-center gap-4 pb-2">
                <MapPin className="w-10 h-10 text-secondary" />
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">Freemantle, Western Australia</p>
                <p className="text-sm text-muted-foreground">Esplanade Hotel</p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center">
              <CardHeader className="flex flex-col items-center gap-4 pb-2">
                <Users className="w-10 h-10 text-secondary" />
                <CardTitle>Networking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">Gala Dinner & Awards</p>
                <p className="text-sm text-muted-foreground">Connect with Industry Leaders</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-muted/50 flex flex-col justify-center items-center">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            About the Conference
          </h2>
          <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            The International Conference on Bulk Materials Storage, Handling & Transportation (ICBMH) is the premier global forum for the exchange of knowledge and experience in the field of bulk solids handling. Join us to explore the latest innovations, technologies, and best practices.
          </p>
        </div>
      </section>
    </div>
  );
}
