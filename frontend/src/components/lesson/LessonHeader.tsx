import { CloseIcon, HeartIcon } from "@/components/ui/Icons";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function LessonHeader({ progress, hearts, practice, onClose }: { progress: number; hearts: number; practice: boolean; onClose: () => void }) {
  return (
    <header className="mx-auto flex w-full max-w-[1000px] items-center gap-4 px-4 pt-6 sm:pt-12">
      <button onClick={onClose} className="text-line hover:text-muted" aria-label="Quit lesson">
        <CloseIcon className="h-7 w-7" />
      </button>
      <ProgressBar value={progress} />
      <span className="flex items-center gap-1 text-lg font-extrabold text-red" aria-label={practice ? "Unlimited hearts" : `${hearts} hearts`}>
        <HeartIcon className="h-7 w-7" /> {practice ? "∞" : hearts}
      </span>
    </header>
  );
}
