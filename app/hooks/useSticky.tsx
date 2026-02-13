/**
 * @type Hook
 * Detects whether floatable components should be sticky or not based on if
 * the user has scrolled down (past a threshold).
 *
 * @author Ethan Mahon (Candidate Number: 9093) | A2 Computer Science Coursework
 * @memberof GreenGlide
 */

import { useEffect, useState } from 'react';

export function useSticky(threshold = 70) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    let rafId: number;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      lastScrollY = window.scrollY;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setIsSticky(lastScrollY > threshold);
      });
    };

    // Connect to the listeners to actually receive the updates.
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [threshold]);

  return isSticky;
}
