"use client";

import { useDriveContext } from "@/app/components/hooks/DriveHook";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/app/components/hooks/LanguageHook";

export default function SyncBadge({
  showLabel = true,
}: {
  showLabel?: boolean;
}) {
  const { isSyncing, user } = useDriveContext();
  const { t } = useLanguage();

  if (!user) return null;

  if (isSyncing) {
    return (
      <div className="badge badge-warning gap-2 p-3 font-medium shadow-sm transition-all duration-300">
        <Loader2 className="w-4 h-4 animate-spin" />
        {showLabel && t("syncing")}
      </div>
    );
  }

  return (
    <div className="badge badge-success gap-2 p-3 font-medium shadow-sm transition-all duration-300">
      <CheckCircle2 className="w-4 h-4" />
      {showLabel && t("synced")}
    </div>
  );
}
