import { useState, useRef, useEffect } from 'react';

function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastCallRef = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      setThrottledValue(value);
      lastCallRef.current = Date.now();
    }, delay - (Date.now() - lastCallRef.current));

    return () => clearTimeout(handler);
  }, [value, delay]);

  return throttledValue;
}

export default useThrottle;

// Usage of the useThrottle hook
// import { useState } from 'react';
// import Dropdown from './Reusables/Dropdown';
// import { SearchIcon } from 'lucide-react';
// import useThrottle from '../hooks/useThrottle';

// const SearchInput = () => {
//   const [searchInput, setSearchInput] = useState<string>('');
//   const throttledSearchInput = useThrottle(searchInput, 500);
