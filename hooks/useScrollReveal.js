import { useEffect, useRef, useState } from "react";

export function useScrollReveal(options = {}) {
  const { threshold = 0.15, rootMargin = "0px" } = options;
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const currentScrollY = window.scrollY;
        const scrollingDown = currentScrollY > lastScrollY.current;
        lastScrollY.current = currentScrollY;

        if (entry.isIntersecting) {
          setIsVisible(true);
        } else if (!scrollingDown) {
          // Only reset when scrolling up
          setIsVisible(false);
        }
        // When scrolling down past element, it stays visible
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, isVisible };
}
