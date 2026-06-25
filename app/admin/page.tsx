import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { LoginForm } from "@/components/admin/LoginForm";
import { isAdminAuthenticated } from "@/lib/auth";
import { getEvents, getFamilyData, getRsvps, getUpdates } from "@/lib/storage";

export const metadata: Metadata = {
  title: "Admin | Prisca & Safal",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return <LoginForm />;
  }

  const [events, rsvps, updates, family] = await Promise.all([
    getEvents(),
    getRsvps(),
    getUpdates(),
    getFamilyData(),
  ]);

  return (
    <AdminDashboard
      initialEvents={events}
      initialRsvps={rsvps}
      initialUpdates={updates}
      initialFamily={family}
    />
  );
}
