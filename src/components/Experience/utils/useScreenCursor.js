import { useRef, useEffect } from "react";
import * as THREE from "three";

export function useScreenCursor() {
  const screenCursor = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const updateCursor = (event) => {
      screenCursor.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      screenCursor.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("pointermove", updateCursor);

    return () => {
      window.removeEventListener("pointermove", updateCursor);
    };
  }, []);

  return screenCursor;
}
