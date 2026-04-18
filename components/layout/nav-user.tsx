"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useLogout, useMe } from "@/features/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function NavUser() {
  const router = useRouter();
  const { data: me } = useMe();
  const logoutMutation = useLogout();

  const userName = me?.fullName || me?.userName || "User";
  const userEmail = me?.userName || "No email";
  const userAvatar = me?.userProfilePicture?.trim() || null;
  const userInitials = userName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => setShowLogoutDialog(true);

  const confirmLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      router.replace("/auth");
    }
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 group-data-[collapsible=icon]:hidden">
            <Avatar className="h-8 w-8 rounded-lg">
              {userAvatar ? <AvatarImage src={userAvatar} alt={userName} /> : null}
              <AvatarFallback className="rounded-lg">{userInitials || "U"}</AvatarFallback>
            </Avatar>
            <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{userName}</span>
              <span className="truncate text-xs">{userEmail}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="cursor-pointer shrink-0"
              aria-label="Log out"
            >
              <LogOut className="size-4" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
          <div className="hidden group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="cursor-pointer"
                  aria-label="Log out"
                >
                  <LogOut className="size-4" />
                  <span className="sr-only">Log out</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Log out</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
      <ConfirmationDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title="Log out?"
        description="Are you sure you want to log out?"
        cancelLabel="Cancel"
        confirmLabel="Log out"
        confirmVariant="destructive"
        onConfirm={confirmLogout}
        isPending={logoutMutation.isPending}
      />
    </>
  );
}
