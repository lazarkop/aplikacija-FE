import { useRef, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useEffectOnce = (callback: (...args: any[]) => void | any) => {
  const calledOnce = useRef(false);

  useEffect(() => {
    if (!calledOnce.current) {
      callback();
      calledOnce.current = true;
    }
  }, [callback]);
};
export default useEffectOnce;
