import { useCallback, useRef } from "react";

export const useGlitchSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const playGlitchSound = useCallback(() => {
    // Create or reuse AudioContext
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    const ctx = audioContextRef.current;

    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const duration = 0.15;

    // Create oscillator for glitchy electronic sound
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Glitchy square wave
    osc1.type = "square";
    osc1.frequency.setValueAtTime(200, now);
    osc1.frequency.exponentialRampToValueAtTime(800, now + 0.05);
    osc1.frequency.exponentialRampToValueAtTime(100, now + duration);

    // High-pitched glitch overlay
    osc2.type = "sawtooth";
    osc2.frequency.setValueAtTime(2000, now);
    osc2.frequency.exponentialRampToValueAtTime(500, now + duration);

    // Filter for that digital crunch
    filter.type = "highpass";
    filter.frequency.setValueAtTime(500, now);
    filter.Q.setValueAtTime(10, now);

    // Volume envelope - quick attack, quick decay
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.08, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    // Connect nodes
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Start and stop
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);

    // Add random clicks for extra glitch effect
    for (let i = 0; i < 3; i++) {
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      
      clickOsc.type = "square";
      clickOsc.frequency.setValueAtTime(Math.random() * 1000 + 500, now + i * 0.03);
      
      clickGain.gain.setValueAtTime(0.03, now + i * 0.03);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.02);
      
      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      
      clickOsc.start(now + i * 0.03);
      clickOsc.stop(now + i * 0.03 + 0.02);
    }
  }, []);

  return { playGlitchSound };
};
