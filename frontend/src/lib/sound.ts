// Short synthesized chimes (no audio files needed). Muted when the learner turns sound off.
let ctx: AudioContext | null = null;

function enabled() {
  try {
    return localStorage.getItem("sound") !== "off";
  } catch {
    return true;
  }
}

function tone(freqs: number[], step = 0.09, type: OscillatorType = "sine") {
  if (typeof window === "undefined" || !enabled()) return;
  ctx ??= new AudioContext();
  const start = ctx.currentTime;
  freqs.forEach((f, i) => {
    const osc = ctx!.createOscillator();
    const gain = ctx!.createGain();
    osc.type = type;
    osc.frequency.value = f;
    const t = start + i * step;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + step * 2.2);
    osc.connect(gain).connect(ctx!.destination);
    osc.start(t);
    osc.stop(t + step * 2.4);
  });
}

export const sounds = {
  correct: () => tone([880, 1318.5], 0.08),
  wrong: () => tone([233, 207.7], 0.12, "triangle"),
  complete: () => tone([523.3, 659.3, 784, 1046.5], 0.11),
  tap: () => tone([600], 0.03),
};
