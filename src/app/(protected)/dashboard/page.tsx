import { Header } from "@/app/_components/dashboard/header";
import { ProfileCard } from "@/app/_components/dashboard/profile-card";
import { QuickStatsCard } from "@/app/_components/dashboard/quick-stats-card";
import { GenerateQuizCard } from "@/app/_components/dashboard/quiz-card";
import { RecentActivityCard } from "@/app/_components/dashboard/recent-activity-card";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardScreen() {
  return (
    <main className="container mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:px-8">
      {/* ----------  Welcome Header  ---------- */}
      <Header />

      {/* ----------  2-Column Grid  ---------- */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* -- Left / Main Column -- */}
        <div className="space-y-8 lg:col-span-2">
          {/* Generate Quiz Card */}
          <GenerateQuizCard />

          {/* Recent Activity (placeholder) */}
          <RecentActivityCard />
        </div>

        {/* -- Right Sidebar -- */}
        <aside className="space-y-6">
          {/* Profile Snapshot */}
          <ProfileCard />

          {/* Quick Stats */}
          <QuickStatsCard />

          {/* Call-to-Action */}
          <Card className="border-0 bg-gradient-to-br from-indigo-900/70 to-sky-900/70 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Zap className="h-10 w-10 flex-shrink-0 text-indigo-500" />
                <div>
                  <p className="text-background dark:text-foreground">Daily Challenge</p>
                  <p className="text-background/80 dark:text-foreground/50 text-sm">
                    Take a 5-question lightning round and climb the leaderboard.
                  </p>
                  <Button size="sm" className="mt-3">
                    Coming soon
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}
