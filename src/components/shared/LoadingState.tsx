export default function LoadingState({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <svg className="animate-spin h-6 w-6 text-ink-faint" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      {message && <p className="text-[0.875rem] text-ink-muted">{message}</p>}
    </div>
  );
}
