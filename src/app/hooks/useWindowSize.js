import { useLayoutEffect, useState} from "react";
export function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  console.log("running",window.innerWidth);

  useLayoutEffect(() => {
    console.log("running",window.innerWidth);

    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}