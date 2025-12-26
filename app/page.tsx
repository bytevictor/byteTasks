"use client";

import { useEffect, useRef } from "react";
import { useDriveContext } from "@/app/components/hooks/DriveHook";
import TaskList from "@/app/components/TaskList";
import ThemeSelector from "@/app/components/ThemeSelector";
import ShortcutsPanel from "./components/ShortcutsPanel";
import Navbar from "@/app/components/Navbar";
import SyncBadge from "@/app/components/SyncBadge";
import { useLanguage } from "@/app/components/hooks/LanguageHook";

export default function Home() {
  const {
    user,
    isReady,
    loadTasks,
    saveTasks,
    error,
    handleLogin,
    handleGuestLogin,
    tasks,
    setTasks,
  } = useDriveContext();
  const { t } = useLanguage();

  const isLoading = !isReady; // Simplification

  // Swipe Gesture Handling
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    const drawerCheckbox = document.getElementById(
      "theme-drawer"
    ) as HTMLInputElement;

    if (isLeftSwipe) {
      // Open drawer (Right to Left swipe)
      if (drawerCheckbox) drawerCheckbox.checked = true;
    }

    if (isRightSwipe) {
      // Close drawer (Left to Right swipe)
      if (drawerCheckbox) drawerCheckbox.checked = false;
    }
  };

  return (
    <div
      className="drawer drawer-end bg-base-100 min-h-screen font-sans"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <input id="theme-drawer" type="checkbox" className="drawer-toggle" />

      {/* Page Content */}
      <div className="drawer-content flex flex-col items-center relative bg-linear-to-br from-base-200 to-base-300 min-h-screen">
        <Navbar />
        <ShortcutsPanel />
        <div className="drawer-content flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 pt-20 w-full max-w-4xl -mt-16">
          <div className="card w-full bg-base-100/60 shadow-2xl backdrop-blur-xl border border-white/20 rounded-box overflow-hidden animate-fade-in-up">
            <div className="card-body items-center text-center p-8 sm:p-16">
              {!user && (
                <>
                  <h1 className="text-6xl sm:text-7xl font-extrabold pb-2 mb-6 tracking-tight animate-text-glow">
                    {t("app.title")}
                  </h1>

                  <p className="text-xl sm:text-2xl opacity-80 mb-10 max-w-xl leading-relaxed text-base-content">
                    {t("app.subtitle")}
                  </p>
                </>
              )}

              {error ? (
                <div className="alert alert-error shadow-lg mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span
                    className="font-medium text-base-content"
                    dangerouslySetInnerHTML={{ __html: error }}
                  ></span>
                </div>
              ) : !isReady ? (
                <div className="flex flex-col items-center gap-4">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                  <p className="text-base-content/70">Initializing...</p>
                </div>
              ) : user ? (
                <div className="w-full">
                  <div className="flex flex-col items-start gap-2 mb-6">
                    <div className="flex items-center gap-4">
                      <h2 className="text-3xl font-bold text-base-content">
                        {t("my_tasks")}
                      </h2>
                    </div>
                    <p className="text-base-content/60">
                      {t("manage_description")}
                    </p>
                  </div>
                  <TaskList
                    tasks={tasks}
                    setTasks={setTasks}
                    saveTasks={saveTasks}
                    isLoading={isLoading}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                  <button
                    onClick={handleLogin}
                    className="btn btn-primary btn-lg shadow-xl shadow-primary/30 hover:scale-105 transition-transform duration-200 normal-case text-xl px-8 w-full"
                  >
                    <svg
                      className="w-6 h-6 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </button>

                  <div className="flex flex-col gap-2 w-full items-center">
                    <div className="divider opacity-50 text-sm my-0">Or</div>
                    <button
                      onClick={handleGuestLogin}
                      className="btn btn-outline btn-neutral w-full transition-all duration-300 hover:scale-[1.02]"
                    >
                      {t("continue_guest")}
                    </button>
                    <p className="text-xs text-base-content/50 px-4">
                      {t("guest_login_desc")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Sidebar */}
      <div className="drawer-side z-50">
        <label
          htmlFor="theme-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ThemeSelector />
      </div>
    </div>
  );
}
