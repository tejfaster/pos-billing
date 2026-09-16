import Header from "./Header";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* <Header /> */}

      <main className="w-full">
        {children}
      </main>
    </div>
  );
}