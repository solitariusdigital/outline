"use client";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Image from "next/image";

const PORTRAIT_RATIO = 4 / 3;

const shuffleImages = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const COL_GAP = 16;
const ROW_GAP = 16;
const COLS = 3;
const PADDING_X = 0;
const ITEMS_PER_COL = 6;
const COL_OFFSETS = [80, 0, 140];

export default function GridBox({ images = [] }) {
  const trackRef = useRef(null);
  const wrapperRef = useRef(null);
  const [cardW, setCardW] = useState(200);

  const recalc = useCallback(() => {
    if (!wrapperRef.current) return;
    const totalW = wrapperRef.current.offsetWidth;
    const available = totalW - PADDING_X * 2 - COL_GAP * (COLS - 1);
    setCardW(Math.floor(available / COLS));
  }, []);

  useEffect(() => {
    recalc();
    const ro = new ResizeObserver(recalc);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, [recalc]);

  const CARD_H = Math.round(cardW * PORTRAIT_RATIO);

  // loopH = the vertical stride of one repeating unit.
  // Every column repeats at exactly this interval regardless of its offset.
  const loopH = useMemo(() => ITEMS_PER_COL * (CARD_H + ROW_GAP), [CARD_H]);

  const shuffledRef = useRef(null);
  if (shuffledRef.current === null && images.length > 0) {
    shuffledRef.current = shuffleImages(images);
  }
  const shuffled = shuffledRef.current ?? [];

  // Build 2× the items so we have copy A (top) and copy B (bottom).
  // Copy B cards sit at top + loopH, so they continue seamlessly from copy A.
  // Both copies live in ONE flat canvas — no separate divs needed.
  const allCards = useMemo(() => {
    const cards = [];
    [0, 1].forEach((copy) => {
      Array.from({ length: COLS }, (_, ci) => {
        Array.from({ length: ITEMS_PER_COL }, (_, ri) => {
          const idx = ci * ITEMS_PER_COL + ri;
          cards.push({
            key: `${copy}-${ci}-${ri}`,
            col: ci,
            top: COL_OFFSETS[ci] + ri * (CARD_H + ROW_GAP) + copy * loopH,
            src: shuffled[idx % shuffled.length]?.src ?? null,
            alt: shuffled[idx % shuffled.length]?.alt ?? "",
          });
        });
      });
    });
    return cards;
  }, [shuffled, CARD_H, loopH]);

  // Total canvas height = 2 copies + tallest offset for breathing room
  const canvasH = useMemo(() => loopH * 2 + Math.max(...COL_OFFSETS), [loopH]);

  // Scroll animation — snap back by exactly loopH for seamless loop
  useEffect(() => {
    const el = trackRef.current;
    if (!el || !loopH) return;
    let animId;
    let y = 0;
    let last = performance.now();
    const SPEED = 36; // px per second (was 0.6px/frame at 60fps)

    const tick = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      y = (y + SPEED * dt) % loopH;
      el.style.transform = `translate3d(0, ${-y}px, 0)`;
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [loopH]);

  return (
    <div ref={wrapperRef} style={styles.wrapper}>
      <div ref={trackRef} style={styles.track}>
        <div style={{ position: "relative", height: canvasH }}>
          {allCards.map((card) => (
            <div
              key={card.key}
              style={{
                ...styles.card,
                left: card.col * (cardW + COL_GAP) + PADDING_X,
                top: card.top,
                width: cardW,
                height: CARD_H,
              }}
            >
              {card.src && (
                <Image
                  src={card.src}
                  blurDataURL={card.src}
                  placeholder="blur"
                  alt={card.alt}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "relative",
    width: "100%",
    height: "100dvh",
    overflow: "hidden",
  },
  track: {
    width: "100%",
    willChange: "transform",
  },
  card: {
    position: "absolute",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    borderRadius: "5px",
  },
};
