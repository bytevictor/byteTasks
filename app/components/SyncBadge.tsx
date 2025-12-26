import { useDriveContext } from "@/app/components/hooks/DriveHook";
import { BadgeCheck, RefreshCw, HardDrive } from "lucide-react"; // Using HardDrive for local
import { useLanguage } from "@/app/components/hooks/LanguageHook";

export default function SyncBadge({
  showLabel = true,
}: {
  showLabel?: boolean;
}) {
  const { isSyncing, user, storageMode } = useDriveContext();
  const { t } = useLanguage();

  if (!user) return null;

  if (storageMode === "guest") {
    return (
      <div className="flex items-center gap-2 transition-all duration-300">
        {/* Mobile: Icon only, text-neutral/content */}
        <div className="sm:hidden text-base-content/70 p-2">
          <HardDrive className="w-6 h-6" />
        </div>

        {/* Desktop: Badge style - Neutral/Info */}
        <div className="hidden sm:flex badge badge-neutral gap-2 p-3 font-medium shadow-sm">
          <HardDrive className="w-4 h-4" />
          {t("local_storage")}
        </div>
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div className="flex items-center gap-2 transition-all duration-300">
        {/* Mobile: Icon only, text-warning */}
        <div className="sm:hidden text-warning p-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
        </div>

        {/* Desktop: Badge style */}
        <div className="hidden sm:flex badge badge-warning gap-2 p-3 font-medium shadow-sm">
          <RefreshCw className="w-4 h-4 animate-spin" />
          {t("syncing")}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 transition-all duration-300">
      {/* Mobile: Icon only, text-success */}
      <div className="sm:hidden text-success p-2">
        <BadgeCheck className="w-6 h-6" />
      </div>

      {/* Desktop: Badge style */}
      <div className="hidden sm:flex badge badge-success gap-2 p-3 font-medium shadow-sm">
        <BadgeCheck className="w-4 h-4" />
        {t("synced")}
      </div>
    </div>
  );
}
