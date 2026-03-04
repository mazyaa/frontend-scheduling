"use client";

import { useRef } from "react";

// this hook for debounce function, so if user typing in input it will wait until user stop typing for certain delay
const useDebounce = () => {
  // use useRef because it saves the value between re-renders
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null); // type nodejs.timeout for setTimeout return type

  //create function for debounce so if user typing it will wait until user stop typing for certain delay
  const debounce = (func: Function, delay: number) => {
    if (debounceTimeout.current) {
      // for clear previous timeout e.g. if user typing a, b, c it will clear previous timeout for a and b so only c will be executed (result is: abc will be executed after delay)
      clearTimeout(debounceTimeout.current);
    }

    // set new timeout
    // so after setting new delay, the function will be executed after delay if user stop typing
    debounceTimeout.current = setTimeout(() => {
      func();
      debounceTimeout.current = null;
    }, delay);
  };

  return debounce;
};

export default useDebounce;
