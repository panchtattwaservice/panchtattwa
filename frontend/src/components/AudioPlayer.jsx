import { useState, useRef, useEffect } from 'react';

// Ambient OM tone player using Web Audio API — exact replica from original
export default function AudioPlayer() {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef(null);
  const gainRef = useRef(null);

  function buildAmbient(ctx) {
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    gainRef.current = master;

    // 136 Hz (Om/Sa frequency) + overtones
    const freqs = [136, 204, 272, 68, 340];
    const types = ['sine', 'sine', 'sine', 'sine', 'triangle'];
    const vols  = [0.22, 0.07, 0.05, 0.12, 0.04];
    freqs.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const g    = ctx.createGain();
      const lfo  = ctx.createOscillator();
      const lfoG = ctx.createGain();
      osc.type = types[i];
      osc.frequency.value = freq;
      lfo.type = 'sine';
      lfo.frequency.value = 0.07 + i * 0.025;
      lfoG.gain.value = freq * 0.003;
      lfo.connect(lfoG);
      lfoG.connect(osc.frequency);
      g.gain.value = vols[i];
      osc.connect(g);
      g.connect(master);
      lfo.start(0);
      osc.start(0);
    });

    // Low-pass noise for warmth
    const bufSize = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let j = 0; j < bufSize; j++) d[j] = (Math.random() * 2 - 1) * 0.012;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = 280;
    const ng = ctx.createGain();
    ng.gain.value = 0.04;
    noise.connect(filt);
    filt.connect(ng);
    ng.connect(master);
    noise.start(0);
  }

  function initAudio() {
    if (ctxRef.current) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    ctxRef.current = ctx;
    buildAmbient(ctx);
  }

  function toggle() {
    initAudio();
    const ctx  = ctxRef.current;
    const gain = gainRef.current;
    if (!gain) return;
    if (!playing) {
      if (ctx.state === 'suspended') ctx.resume();
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 3);
      setPlaying(true);
    } else {
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
      setPlaying(false);
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem('pt_audio');
    if (saved === 'off') return;
    let started = false;
    function startOnGesture() {
      if (started) return;
      started = true;
      toggle();
      window.removeEventListener('pointerdown', startOnGesture);
      window.removeEventListener('keydown', startOnGesture);
      window.removeEventListener('scroll', startOnGesture);
    }
    window.addEventListener('pointerdown', startOnGesture, { once: false, passive: true });
    window.addEventListener('keydown', startOnGesture);
    window.addEventListener('scroll', startOnGesture, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', startOnGesture);
      window.removeEventListener('keydown', startOnGesture);
      window.removeEventListener('scroll', startOnGesture);
      if (gainRef.current && ctxRef.current) {
        gainRef.current.gain.cancelScheduledValues(ctxRef.current.currentTime);
        gainRef.current.gain.setValueAtTime(0, ctxRef.current.currentTime);
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('pt_audio', playing ? 'on' : 'off');
  }, [playing]);

  return (
    <button
      data-testid="audio-player-btn"
      className="audio-btn"
      onClick={toggle}
      aria-label={playing ? 'Mute ambient sound' : 'Play ambient Om tone'}
    >
      {playing && <span className="audio-ring r1" />}
      {playing && <span className="audio-ring r2" />}
      <span className="audio-tooltip">{playing ? 'Mute sound' : 'Ambient OM'}</span>
      {playing ? (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.55 }}>
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
        </svg>
      )}
    </button>
  );
}
