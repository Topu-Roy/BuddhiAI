"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Loader2, CheckCircle2, XCircle, Ban, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserStatus = "idle" | "loading" | "success" | "error";

interface User {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned: boolean | null;
  banReason: string | null;
  createdAt: Date;
  profile: {
    id: string;
    educationLevel: string;
  } | null;
}

export function UserTable() {
  const { data: users, isPending, refetch } = api.seed.getUsers.useQuery();
  const [statusMap, setStatusMap] = useState<Record<string, UserStatus>>({});
  const [showBanDialog, setShowBanDialog] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [banReason, setBanReason] = useState("");

  const toggleBanMutation = api.seed.toggleBanUser.useMutation({
    onSuccess: (data) => {
      setStatusMap((prev) => ({ ...prev, [data.userId]: "success" }));
      toast.success(data.banned ? "User banned" : "User unbanned");
      void refetch();
      setTimeout(() => {
        setStatusMap((prev) => ({ ...prev, [data.userId]: "idle" }));
        setShowBanDialog(false);
        setPendingUser(null);
        setBanReason("");
      }, 2000);
    },
    onError: (error) => {
      setStatusMap((prev) => ({ ...prev, [pendingUser?.id ?? ""]: "error" }));
      toast.error(error.message);
      setTimeout(() => {
        setStatusMap((prev) => ({ ...prev, [pendingUser?.id ?? ""]: "idle" }));
      }, 3000);
    },
  });

  const handleBanToggle = (user: User, _banned: boolean) => {
    setPendingUser(user);
    setBanReason("");
    setShowBanDialog(true);
  };

  const confirmBan = () => {
    if (!pendingUser) return;
    setStatusMap((prev) => ({ ...prev, [pendingUser.id]: "loading" }));
    toggleBanMutation.mutate({
      userId: pendingUser.id,
      banned: !pendingUser.banned,
      banReason: banReason,
    });
  };

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case "loading":
        return (
          <Badge variant="secondary" className="gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
          </Badge>
        );
      case "success":
        return (
          <Badge variant="outline" className="gap-1 border-green-500 text-green-500">
            <CheckCircle2 className="h-3 w-3" />
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No users found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="pb-3 text-left font-medium text-muted-foreground">Name</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Email</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Role</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-3">{user.name}</td>
                    <td className="py-3 text-muted-foreground">{user.email}</td>
                    <td className="py-3">
                      <Badge variant={user.role === "admin" ? "default" : "outline"}>
                        {user.role ?? "user"}
                      </Badge>
                    </td>
                    <td className="py-3">
                      {user.banned ? (
                        <Badge variant="destructive">Banned</Badge>
                      ) : (
                        <Badge variant="outline" className="border-green-500 text-green-500">
                          Active
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {getStatusBadge(statusMap[user.id] ?? "idle")}
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon-sm" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleBanToggle(user, !user.banned)}
                              disabled={statusMap[user.id] === "loading"}
                              className={user.banned ? "text-green-600" : "text-destructive"}
                            >
                              {user.banned ? (
                                <>
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Unban User
                                </>
                              ) : (
                                <>
                                  <Ban className="mr-2 h-4 w-4" />
                                  Ban User
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              {pendingUser?.banned ? "Unban User" : "Ban User"}
            </DialogTitle>
            <DialogDescription>
              {pendingUser?.banned
                ? `This will unban ${pendingUser.name}. They will be able to access the platform again.`
                : `This will ban ${pendingUser?.name}. They will lose access to the platform.`}
            </DialogDescription>
          </DialogHeader>
          {!pendingUser?.banned && (
            <div className="py-2">
              <label className="text-sm font-medium">Ban Reason (optional)</label>
              <input
                type="text"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Reason for banning..."
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBanDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmBan}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}