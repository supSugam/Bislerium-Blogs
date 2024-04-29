//useDetectOutsideClick.ts

import { useEffect } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useDetectOutsideClick(ref: React.RefObject<any>, handler: () => void) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handler]);
}

export { useDetectOutsideClick };
