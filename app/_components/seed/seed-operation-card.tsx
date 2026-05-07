"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

interface SeedOperationCardProps {
  title: string;
  description: string;
  actionLabel: string;
  mutationFn: () => Promise<unknown>;
  isDanger?: boolean;
  confirmTitle?: string;
  confirmDescription?: string;
}

type Status = "idle" | "loading" | "success" | "error";

export function SeedOperationCard({
  title,
  description,
  actionLabel,
  mutationFn,
  isDanger = false,
  confirmTitle,
  confirmDescription,
}: SeedOperationCardProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleAction = async () => {
    if (isDanger && !showConfirm) {
      setShowConfirm(true);
      return;
    }

    setShowConfirm(false);
    setStatus("loading");
    setErrorMessage("");

    try {
      await mutationFn();
      setStatus("success");
      toast.success(`${title} completed successfully`);
      
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      setStatus("error");
      const message = error instanceof Error ? error.message : "An error occurred";
      setErrorMessage(message);
      toast.error(`${title} failed: ${message}`);
      
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "loading":
        return (
          <Badge variant="secondary" className="gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Processing
          </Badge>
        );
      case "success":
        return (
          <Badge variant="outline" className="gap-1 border-green-500 text-green-500">
            <CheckCircle2 className="h-3 w-3" />
            Success
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Error
          </Badge>
        );
      default:
        return (
          <Badge variant={isDanger ? "destructive" : "outline"} className={isDanger ? "border-red-500 text-red-500" : ""}>
            {isDanger ? "Danger" : "Ready"}
          </Badge>
        );
    }
  };

  return (
    <>
      <Card className={isDanger ? "border-red-200 dark:border-red-800" : ""}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          {getStatusBadge()}
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-4">{description}</CardDescription>
          <Button
            variant={isDanger ? "destructive" : "default"}
            onClick={handleAction}
            disabled={status === "loading"}
            className="w-full"
          >
            {status === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {actionLabel}
          </Button>
          {status === "error" && errorMessage && (
            <p className="mt-2 text-xs text-destructive">{errorMessage}</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              {confirmTitle ?? `Confirm ${title}`}
            </DialogTitle>
            <DialogDescription>
              {confirmDescription ?? "This action cannot be undone. Are you sure you want to proceed?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleAction}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}