import { useDriveContext } from "@/app/components/hooks/DriveHook";
import { Settings, SettingsIcon } from "lucide-react";
import SyncBadge from "./SyncBadge";
import { useLanguage } from "@/app/components/hooks/LanguageHook";

export default function Navbar() {
  const { user, isReady, handleLogin, handleLogout } = useDriveContext();
  const { t } = useLanguage();

  return (
    <div className="navbar bg-base-100/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-base-content/10">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a>{t("my_tasks")}</a>
            </li>
            <li>
              <a>{t("settings")}</a>
            </li>
          </ul>
        </div>
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
              {t("connected")}
            </div>

            {/* Profile Image */}
            <div className="avatar">
              <div className="w-8 h-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                {user.picture ? (
                  <img src={user.picture} alt="User Profile" />
                ) : (
                  <div className="bg-neutral text-neutral-content w-full h-full flex items-center justify-center">
                    <span className="text-xs">U</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-sm btn-ghost text-error"
            >
              {t("logout")}
            </button>
          </div>
        ) : (
          <button onClick={handleLogin} className="btn btn-sm btn-primary">
            {t("login")}
          </button>
        )}

        {/* Settings Icon - Far Right */}
        <label
          htmlFor="theme-drawer"
          className="btn btn-outline text-primary btn-circle"
          aria-label="Theme Settings"
        >
          <SettingsIcon className="w-6 h-6" />
        </label>
      </div>
    </div>
  );
}
