/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect } from 'react';

const useInfiniteScroll = (
  bodyRef: React.MutableRefObject<HTMLElement | null>,
  bottomLineRef: React.MutableRefObject<HTMLElement | null>,
  callback: (...args: any[]) => void | any
): void => {
  const handleScroll = useCallback(() => {
    const containerHeight = bodyRef?.current?.getBoundingClientRect().height;
    const bottomLineTop = bottomLineRef?.current?.getBoundingClientRect().top;
    if (
      bottomLineTop !== undefined &&
      containerHeight !== undefined &&
      bottomLineTop <= containerHeight
    ) {
      callback();
    }
  }, [bodyRef, bottomLineRef, callback]);

  useEffect(() => {
    const bodyRefCurrent = bodyRef?.current;
    bodyRefCurrent?.addEventListener('scroll', handleScroll, true);
    return () => {
      if (bodyRefCurrent) {
        bodyRefCurrent.removeEventListener('scroll', handleScroll, true);
      }
    };
  }, [bodyRef, handleScroll]);
};

export default useInfiniteScroll;
