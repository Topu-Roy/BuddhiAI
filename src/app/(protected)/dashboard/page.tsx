import { RenderHeader } from "@/app/_components/dashboard/header";
import { RenderGenerateQuiz } from "@/app/_components/dashboard/prefetch- generate-quiz";
import { RenderProfileCard } from "@/app/_components/dashboard/profile-card";
import { RenderQuickStatsCard } from "@/app/_components/dashboard/quick-stats-card";
import { RenderRecentActivityCard } from "@/app/_components/dashboard/recent-activity-card";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardScreen() {
  return (
    <div className="to-primary/10 from-background bg-gradient-to-br">
      <main className="container mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:px-8">
        {/* ----------  Welcome Header  ---------- */}
        <RenderHeader />

        {/* ----------  2-Column Grid  ---------- */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* -- Left / Main Column -- */}
          <div className="space-y-8 lg:col-span-2">
            {/* Generate Quiz Card */}
            <RenderGenerateQuiz />

            {/* Recent Activity (placeholder) */}
            <RenderRecentActivityCard />
          </div>

          {/* -- Right Sidebar -- */}
          <aside className="space-y-6">
            {/* Profile Snapshot */}
            <RenderProfileCard />

            {/* Quick Stats */}
            <RenderQuickStatsCard />

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
    </div>
  );
}
