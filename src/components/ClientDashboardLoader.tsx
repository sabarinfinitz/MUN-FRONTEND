"use client";

import dynamic from "next/dynamic";

const Dashboard = dynamic(() => import("@/components/Dashboard").then((m) => m.Dashboard), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
      <p>Loading session...</p>
    </div>
  ),
});

export function ClientDashboardLoader() {
  return <Dashboard />;
}
