import { useDriveContext } from "@/app/components/hooks/DriveHook";
import { Settings, SettingsIcon, User, UserIcon } from "lucide-react";
import SyncBadge from "./SyncBadge";
import { useLanguage } from "@/app/components/hooks/LanguageHook";

export default function Navbar() {
  const { user, isReady, handleLogin, handleLogout, storageMode } =
    useDriveContext();
  const { t } = useLanguage();

  return (
    <div className="navbar bg-base-100/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-base-content/10">
      <div className="navbar-start">
        <a className="btn btn-ghost normal-case text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
          {t("app.title")}
        </a>
      </div>

      <div className="navbar-center flex">
        {user && <SyncBadge showLabel={true} />}
      </div>

      <div className="navbar-end gap-2">
        {!isReady ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : user ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex text-primary text-sm font-medium opacity-70">
              {storageMode === "guest" ? t("guest") : t("connected")}
            </div>

            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-8 h-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  {user.picture ? (
                    <img src={user.picture} alt="User Profile" />
                  ) : (
                    <div className="bg-neutral text-neutral-content w-full h-full flex items-center justify-center">
                      <UserIcon className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-1 p-2 shadow-sm menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-content/10"
              >
                {/* Mobile Settings Option */}
                <li className="sm:hidden">
                  <label htmlFor="theme-drawer" className="justify-between">
                    {t("settings")}
                    <Settings className="w-4 h-4" />
                  </label>
                </li>
                {/* Logout Option */}
                <li>
                  <button onClick={handleLogout} className="text-error">
                    {t("logout")}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <button onClick={handleLogin} className="btn btn-sm btn-primary">
            {t("login")}
          </button>
        )}

        {/* Settings Icon - Hidden on Mobile */}
        <label
          htmlFor="theme-drawer"
          className="hidden sm:flex btn btn-outline text-primary btn-circle"
          aria-label="Theme Settings"
        >
          <SettingsIcon className="w-6 h-6" />
        </label>
      </div>
    </div>
  );
}
