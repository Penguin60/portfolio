"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { incrementPenguinCount, getPenguinCount } from "@/server/actions";
import { Streetcar, Tgv } from "./train-art";
import "./train.css";

const STREETCAR_ROUTES = [
  ["501", "501 QUEEN"],
  ["504", "504 KING"],
  ["505", "505 DUNDAS"],
  ["506", "506 CARLTON"],
  ["510", "510 SPADINA"],
  ["512", "512 ST CLAIR"],
];

const TGV_ROUTES = [
  ["6621", "LYON PART-DIEU"],
  ["8573", "MARSEILLE"],
  ["7215", "BORDEAUX"],
  ["9012", "LILLE EUROPE"],
  ["2438", "STRASBOURG"],
];

const pick = <T,>(list: T[], not?: T): T => {
  const pool = list.filter((v) => v !== not);
  return pool[Math.floor(Math.random() * pool.length)];
};

type Count = { id: number; value: number; x: number; y: number; drift: number };

export default function Train() {
  const vehRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const totalRef = useRef<number | null>(null);
  const countIdRef = useRef(0);
  const summonRef = useRef<(() => void) | null>(null);

  const { resolvedTheme } = useTheme();
  const themeRef = useRef(resolvedTheme);
  themeRef.current = resolvedTheme;

  const [route, setRoute] = useState(STREETCAR_ROUTES[5]);
  const [banner, setBanner] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [moving, setMoving] = useState(false);
  const [open, setOpen] = useState(false);
  const [flip, setFlip] = useState(false);
  const [counts, setCounts] = useState<Count[]>([]);

  useEffect(() => {
    getPenguinCount().then((n) => {
      totalRef.current = n;
    });
  }, []);

  useEffect(() => {
    const veh = vehRef.current;
    if (!veh) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stopX = () => Math.round(window.innerWidth * 0.52 - veh.offsetWidth / 2);

    const place = (x: number, ms = 0, ease = "linear") => {
      veh.style.transition = ms ? `transform ${ms}ms ${ease}` : "none";
      veh.style.transform = `translate3d(${x}px, 0, 0)`;
    };

    if (reduced) {
      place(stopX());
      setActive(true);
      return;
    }

    let cancelled = false;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => setTimeout(resolve, ms));

    (async () => {
      let dir = 1;
      await wait(1400);

      while (!cancelled) {
        const w = veh.offsetWidth;
        const offLeft = -w - 80;
        const offRight = window.innerWidth + 80;

        setRoute(pick(themeRef.current === "dark" ? TGV_ROUTES : STREETCAR_ROUTES));
        setFlip(dir < 0);
        place(dir > 0 ? offLeft : offRight);
        void veh.offsetWidth;

        setActive(true);
        setMoving(true);
        place(stopX(), 4600, "cubic-bezier(0.16, 0.62, 0.26, 1)");
        await wait(4600);
        if (cancelled) return;

        setMoving(false);
        setOpen(true);
        await wait(2800);
        if (cancelled) return;

        setOpen(false);
        await wait(900);
        if (cancelled) return;

        setMoving(true);
        place(dir > 0 ? offRight : offLeft, 4900, "cubic-bezier(0.5, 0, 0.8, 0.42)");
        await wait(4900);
        if (cancelled) return;

        setMoving(false);
        setActive(false);
        dir = -dir;
        await new Promise<void>((resolve) => {
          const timer = setTimeout(resolve, 8000 + Math.random() * 7000);
          summonRef.current = () => {
            clearTimeout(timer);
            resolve();
          };
        });
        summonRef.current = null;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const ring = (event: React.MouseEvent) => {
    const ctx =
      audioRef.current ??
      (audioRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)());
    ctx.resume();

    const strike = (at: number) =>
      [
        [988, 0.24],
        [1319, 0.14],
        [2093, 0.07],
        [2637, 0.035],
      ].forEach(([freq, gain]) => {
        const osc = ctx.createOscillator();
        const amp = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        amp.gain.setValueAtTime(0, at);
        amp.gain.linearRampToValueAtTime(gain, at + 0.004);
        amp.gain.exponentialRampToValueAtTime(0.0001, at + 0.9);
        osc.connect(amp).connect(ctx.destination);
        osc.start(at);
        osc.stop(at + 0.95);
      });

    strike(ctx.currentTime);
    strike(ctx.currentTime + 0.19);

    setBanner("DING DING");
    setTimeout(() => setBanner(null), 1500);

    const spawn = { x: event.clientX, y: event.clientY };
    const show = (value: number) => {
      const id = ++countIdRef.current;
      setCounts((prev) => [
        ...prev,
        { id, value, ...spawn, drift: Math.random() * 2 - 1 },
      ]);
      setTimeout(() => setCounts((prev) => prev.filter((c) => c.id !== id)), 1400);
    };

    if (totalRef.current !== null) {
      show(++totalRef.current);
      incrementPenguinCount();
    } else {
      incrementPenguinCount().then((n) => {
        totalRef.current = n;
        show(n);
      });
    }
  };

  const sign = banner ?? route[1];

  return (
    <div className="train-line" data-active={active} aria-hidden="true">
      <div className="train-track">
        <div className="train-rail" />
        <div className="train-ties" />
      </div>

      <svg
        className="train-stop"
        viewBox="0 0 24 92"
        fill="none"
        onClick={() => summonRef.current?.()}
      >
        <rect x="11" y="16" width="2" height="76" fill="var(--tr-pole)" />
        <rect x="1" y="0" width="22" height="17" rx="3" fill="var(--tr-flag)" />
        <text
          x="12"
          y="12.2"
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fontFamily="ui-monospace, monospace"
          fill="var(--tr-flagtext)"
        >
          {route[0]}
        </text>
      </svg>

      <div
        ref={vehRef}
        className={`train-veh${moving ? " moving" : ""}${open ? " doors-open" : ""}`}
        onClick={ring}
        style={{ transform: "translate3d(-130%, 0, 0)" }}
      >
        <svg
          viewBox="0 -36 600 130"
          className={`tr-day${flip ? " flip" : ""}`}
        >
          <Streetcar sign={sign} code={route[0]} />
        </svg>
        <svg
          viewBox="0 -36 600 130"
          className={`tr-night${flip ? " flip" : ""}`}
        >
          <Tgv sign={sign} />
        </svg>
      </div>

      {counts.map((c) => (
        <span
          key={c.id}
          className="tr-count"
          style={{ left: c.x, top: c.y, ["--drift" as string]: c.drift }}
        >
          {c.value}
        </span>
      ))}
    </div>
  );
}
