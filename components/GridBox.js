"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/legacy/image";

const CARD_H = 300;
const COL_GAP = 24;
const ROW_GAP = 24;
const COLS = 3;
const PADDING_X = 0;
const COL_OFFSETS = [80, 0, 140];
const ITEMS_PER_COL = 4;

export default function ScatteredGrid({ images = [] }) {
  const trackRef = useRef(null);
  const wrapperRef = useRef(null);
  const [cardW, setCardW] = useState(200);

  // Recalculate card width whenever the wrapper resizes
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

  // Derive layout from current cardW
  const items = Array.from({ length: COLS }, (_, ci) =>
    Array.from({ length: ITEMS_PER_COL }, (_, ri) => {
      const idx = ci * ITEMS_PER_COL + ri;
      return {
        id: idx + 1,
        col: ci,
        top: COL_OFFSETS[ci] + ri * (CARD_H + ROW_GAP),
        src: images[idx]?.src ?? null,
        alt: images[idx]?.alt ?? "",
      };
    }),
  ).flat();

  const canvasH = Math.max(...items.map((i) => i.top + CARD_H)) + 80;

  // Scroll animation
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTop = 0;
    let animId;

    const tick = () => {
      el.scrollTop += 0.6;
      if (el.scrollTop >= canvasH) el.scrollTop -= canvasH;
      animId = requestAnimationFrame(tick);
    };

    const t = setTimeout(() => {
      animId = requestAnimationFrame(tick);
    }, 300);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(animId);
    };
  }, [canvasH]);

  const renderCards = (keyPrefix = "") =>
    items.map((item) => (
      <div
        key={`${keyPrefix}-${item.id}`}
        style={{
          ...styles.card,
          left: item.col * (cardW + COL_GAP) + PADDING_X,
          top: item.top,
          width: cardW,
          height: CARD_H,
        }}
      >
        <div style={styles.imgPlaceholder}>
          <Image
            src={item.src}
            blurDataURL={item.src}
            placeholder="blur"
            alt={item.alt}
            layout="fill"
            objectFit="cover"
            as="image"
            priority
          />
        </div>
      </div>
    ));

  return (
    <div ref={wrapperRef} style={styles.wrapper}>
      <div ref={trackRef} style={styles.track}>
        <div style={{ position: "relative", height: canvasH }}>
          {renderCards("a")}
        </div>
        <div style={{ position: "relative", height: canvasH }}>
          {renderCards("b")}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "relative",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
  },
  track: {
    width: "100%",
    height: "100%",
    overflowY: "hidden",
    overflowX: "hidden",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
  card: {
    position: "absolute",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    borderRadius: "5px",
  },
  imgPlaceholder: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
};
