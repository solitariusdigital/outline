"use client";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Image from "next/legacy/image";

const shuffleImages = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function GridBox({ images = [], fullSizeScreen }) {
  const CARD_H = fullSizeScreen ? 300 : 180;
  const COL_GAP = 24;
  const ROW_GAP = 24;
  const COLS = 3;
  const PADDING_X = 0;
  const COL_OFFSETS = [80, 0, 140];
  const ITEMS_PER_COL = 4;

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

  const shuffledRef = useRef(null);
  if (shuffledRef.current === null && images.length > 0) {
    shuffledRef.current = shuffleImages(images);
  }
  const shuffled = shuffledRef.current ?? [];

  const items = useMemo(
    () =>
      Array.from({ length: COLS }, (_, ci) =>
        Array.from({ length: ITEMS_PER_COL }, (_, ri) => {
          const idx = ci * ITEMS_PER_COL + ri;
          return {
            id: idx + 1,
            col: ci,
            top: COL_OFFSETS[ci] + ri * (CARD_H + ROW_GAP),
            src: shuffled[idx]?.src ?? null,
            alt: shuffled[idx]?.alt ?? "",
          };
        }),
      ).flat(),
    [shuffled, CARD_H],
  );

  const canvasH = useMemo(() => ITEMS_PER_COL * (CARD_H + ROW_GAP), [CARD_H]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || !canvasH) return;
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
    borderRadius: "0px",
  },
  imgPlaceholder: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
};
