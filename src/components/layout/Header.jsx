export default function Header() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            POS Billing
          </h1>

          <p className="text-xs text-[var(--muted)]">
            Hardware & Building Materials
          </p>
        </div>
      </div>
    </header>
  );
}