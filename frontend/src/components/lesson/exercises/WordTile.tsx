export function WordTile({ text, onClick, ghost, disabled }: { text: string; onClick?: () => void; ghost?: boolean; disabled?: boolean }) {
  if (ghost) {
    // keeps the bank layout stable while the word sits in the answer line
    return <span className="rounded-xl bg-line px-3 py-2 text-lg text-transparent select-none">{text}</span>;
  }
  return (
    <button onClick={onClick} disabled={disabled} className="tile tile-press rounded-xl px-3 py-2 text-lg font-semibold hover:bg-line/30">
      {text}
    </button>
  );
}
