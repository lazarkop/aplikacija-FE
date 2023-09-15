import React, { useEffect, useState } from 'react';

const useDetectOutsideClick = <T extends HTMLElement>(
  ref: React.MutableRefObject<T | null>,
  initialState: boolean
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [isActive, setIsActive] = useState(initialState);

  useEffect(() => {
    const onClick = (event: globalThis.MouseEvent) => {
      if (ref && ref.current && !ref.current.contains(event.target as Node)) {
        setIsActive(!isActive);
      }
    };

    if (isActive) {
      window.addEventListener('mousedown', onClick);
    }

    return () => {
      window.removeEventListener('mousedown', onClick);
    };
  }, [isActive, ref]);

  return [isActive, setIsActive];
};

export default useDetectOutsideClick;
