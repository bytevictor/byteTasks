"use client";

import { useDrive } from "@/app/components/hooks/DriveHook";

export default function AuthButton() {
  const { handleLogin, handleLogout, user, isReady } = useDrive();

  if (!isReady) {
    return <button className="btn btn-ghost loading">Loading...</button>;
  }

  return (
    <div>
      {user ? (
        <button onClick={handleLogout} className="btn btn-error">
          Logout
        </button>
      ) : (
        <button onClick={handleLogin} className="btn btn-primary">
          Login with Google
        </button>
      )}
    </div>
  );
}
