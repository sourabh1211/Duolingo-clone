import { SpeakerIcon } from "@/components/ui/Icons";
import { Mascot } from "@/components/ui/Mascot";
import { speak } from "@/lib/speech";

export function PromptTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="mb-6 text-2xl font-extrabold sm:text-[32px] sm:leading-tight">{children}</h1>;
}

/** Mascot with a speech bubble holding the sentence, plus a play button when there's audio. */
export function SpeechBubble({ text, audio }: { text: string; audio?: string | null }) {
  return (
    <div className="mb-6 flex items-end gap-3">
      <Mascot className="h-24 w-24 shrink-0 sm:h-32 sm:w-32" />
      <div className="relative mb-6 flex items-center gap-3 rounded-2xl border-2 border-line px-4 py-3 text-lg">
        <span className="absolute -left-[9px] bottom-4 h-4 w-4 rotate-45 border-b-2 border-l-2 border-line bg-surface" />
        {audio && (
          <button onClick={() => speak(audio)} className="text-blue" aria-label="Play audio">
            <SpeakerIcon />
          </button>
        )}
        <span className="relative">{text}</span>
      </div>
    </div>
  );
}
