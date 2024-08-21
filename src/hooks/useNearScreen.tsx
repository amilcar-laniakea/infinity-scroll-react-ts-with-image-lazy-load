import { useState, useRef, useEffect, RefObject } from "react";

export const useNearScreen = ({ rootMargin = "0px" } = {}): [
  boolean,
  RefObject<HTMLDivElement>
] => {
  const [isNear, setIsNear] = useState<boolean>(false);
  const el = useRef<HTMLDivElement>(null);
  useEffect(
    function () {
      if (typeof el.current === "undefined") return;

      let observer: IntersectionObserver;
      Promise.resolve(
        typeof window.IntersectionObserver !== "undefined"
          ? window.IntersectionObserver
          : import("intersection-observer")
      ).then(() => {
        const onIntersect = (
          entries: IntersectionObserverEntry[],
          observer: IntersectionObserver
        ): void => {
          const { isIntersecting } = entries[0];

          if (isIntersecting) {
            setIsNear(true);
            observer.disconnect();
          }
        };

        observer = new window.IntersectionObserver(onIntersect, { rootMargin });
        if (observer && el.current) {
          observer.observe(el.current);
        }
      });

      return () => observer && observer.disconnect();
    },
    [el, rootMargin]
  );

  return [isNear, el];
};
