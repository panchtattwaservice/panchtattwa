import { useEffect } from 'react';

export default function useReveal() {
  useEffect(() => {
    const run = (className) => {
      const els = document.querySelectorAll(`.${className}`);
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add('visible');
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );
      els.forEach((el) => obs.observe(el));
      return obs;
    };
    const obs1 = run('reveal');
    const obs2 = run('reveal-scale');
    const obs3 = run('stagger');
    return () => {
      obs1.disconnect();
      obs2.disconnect();
      obs3.disconnect();
    };
  }, []);
}
