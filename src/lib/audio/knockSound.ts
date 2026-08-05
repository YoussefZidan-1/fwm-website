// Synthesized Web Audio Collision Knock (src/sound.c)
let audioCtx: AudioContext | null = null;

export const playKnockSound = (speed: number, soundEnabled: boolean) => {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const dur = 0.09;
    const gainVal = Math.min(1.0, Math.max(0.05, (speed - 120) / 1500));

    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(190, now);
    oscGain.gain.setValueAtTime(0.45 * gainVal, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(oscGain);
    oscGain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + dur);

    const bufferSize = Math.floor(audioCtx.sampleRate * dur);
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const t = i / audioCtx.sampleRate;
      data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 150.0);
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.75 * gainVal, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    noise.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    noise.start(now);
  } catch {
    // Autoplay restrictions
  }
};