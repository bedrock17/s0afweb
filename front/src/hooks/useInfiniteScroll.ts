import { useEffect, useState } from 'react';
import type { MutableRefObject } from 'react';

import { useIntersectionObserver } from '~/hooks/useIntersectionObserver';

export const useInfiniteScroll = (
  ref: MutableRefObject<Element | null>,
  callback: () => void
) => {
  const [lastLoadTime, setLastLoadTime] = useState(0);
  const shouldLoadMore = useIntersectionObserver(ref, { threshold: 0 });

  useEffect(() => {
    const currentTime = Date.now();
    if (shouldLoadMore && currentTime - lastLoadTime >= 100) {
      setLastLoadTime(currentTime);
      callback();
    }
  }, [shouldLoadMore, callback, lastLoadTime]);
};
