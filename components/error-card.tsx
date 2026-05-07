import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Props = {
  error: string;
  prompt: string;
  onClick: (Props?: undefined) => unknown;
};

export function ErrorCard({ error, prompt, onClick }: Props) {
  return (
    <Card className="flex items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="flex size-8 items-center justify-center rounded-full bg-destructive/10">
          <X size={18} className="text-destructive/80" />
        </div>
        <p className="text-2xl font-semibold text-destructive">{error}</p>
        <p className="pb-4 text-muted-foreground">{prompt}</p>
        <Button onClick={() => onClick()} variant={"outline"}>
          Refresh
        </Button>
      </div>
    </Card>
  );
}
