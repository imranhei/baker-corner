import { useRef } from "react";

export const useInfiniteScroll = (callback, hasMore, loading) => {
  const observer = useRef();

  const lastElementRef = (node) => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        callback();
      }
    });

    if (node) observer.current.observe(node);
  };

  return lastElementRef;
};
