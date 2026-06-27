"use client";
import { useEffect, useRef } from "react";

const CARD_W = 200;
const CARD_H = 300; // vertical aspect ratio (portrait)
const COL_GAP = 24;
const ROW_GAP = 24; // equal gap between all cards
const COLS = 3;
const PADDING_X = 40;

// Each column has 4 cards stacked with equal ROW_GAP spacing.
// Columns are offset vertically to create the scattered/staggered look.
const COL_OFFSETS = [80, 0, 140]; // px shift down per column

// Build items: 4 per column, evenly spaced
const ITEMS_PER_COL = 4;
const items = Array.from({ length: COLS }, (_, ci) =>
  Array.from({ length: ITEMS_PER_COL }, (_, ri) => ({
    id: ci * ITEMS_PER_COL + ri + 1,
    col: ci,
    top: COL_OFFSETS[ci] + ri * (CARD_H + ROW_GAP),
  })),
).flat();

const canvasW = COLS * CARD_W + (COLS - 1) * COL_GAP + PADDING_X * 2;
// Canvas tall enough for all cards + their column offset + bottom breathing room
const canvasH = Math.max(...items.map((i) => i.top + CARD_H)) + 80;

export default function ScatteredGrid() {
  const trackRef = useRef(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // We duplicate the canvas so the loop is seamless.
    // Scroll starts at top of the first copy; when we reach the top of the
    // second copy (== canvasH) we snap back to 0 silently.
    el.scrollTop = 0;

    let animId;
    const speed = 0.6; // px per frame  (bottom-to-top = positive scrollTop)

    const tick = () => {
      el.scrollTop += speed;
      // Seamless loop: once we've scrolled one full canvas height, snap back
      if (el.scrollTop >= canvasH) {
        el.scrollTop -= canvasH;
      }
      animId = requestAnimationFrame(tick);
    };

    const t = setTimeout(() => {
      animId = requestAnimationFrame(tick);
    }, 300);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Render items twice for the seamless loop
  const renderCards = (keyPrefix = "") =>
    items.map((item) => (
      <div
        key={`${keyPrefix}-${item.id}`}
        style={{
          ...styles.card,
          left: item.col * (CARD_W + COL_GAP) + PADDING_X,
          top: item.top,
          width: CARD_W,
          height: CARD_H,
          background: "white",
        }}
      >
        {/* Placeholder image area */}
        <div style={styles.imgPlaceholder}></div>
      </div>
    ));

  return (
    <div style={styles.wrapper}>
      <div ref={trackRef} style={styles.track}>
        {/* First copy */}
        <div style={{ ...styles.canvas, width: canvasW, height: canvasH }}>
          {renderCards("a")}
        </div>
        {/* Second copy — sits right below, enables seamless loop */}
        <div style={{ ...styles.canvas, width: canvasW, height: canvasH }}>
          {renderCards("b")}
        </div>
      </div>
      <div
        style={{
          ...styles.fade,
          top: 0,
          background: "linear-gradient(to bottom, #000819 10%, transparent)",
        }}
      />
      <div
        style={{
          ...styles.fade,
          bottom: 0,
          background: "linear-gradient(to top,    #000819 10%, transparent)",
        }}
      />
    </div>
  );
}

const styles = {
  wrapper: {
    position: "relative",
    width: "100%",
    height: "100dvh",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
  },
  track: {
    width: "100%",
    maxWidth: canvasW,
    height: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
  canvas: {
    position: "relative",
  },
  card: {
    position: "absolute",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  imgPlaceholder: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  fade: {
    position: "absolute",
    left: 0,
    width: "100%",
    height: 120,
    pointerEvents: "none",
    zIndex: 4,
  },
};
