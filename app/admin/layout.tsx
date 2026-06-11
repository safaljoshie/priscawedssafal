export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-none bg-ivory shadow-none">
      {children}
    </div>
  );
}
