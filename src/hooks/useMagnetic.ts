import { useCallback, useRef, type PointerEvent } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useMagnetic<T extends HTMLElement = HTMLButtonElement>(
  strength = 5,
) {
  const ref = useRef<T>(null);
  const reducedMotion = useReducedMotion();

  const handlePointerMove = useCallback(
    (event: PointerEvent<T>) => {
      const element = ref.current;
      if (!element || reducedMotion || event.pointerType === "touch") return;

      const rect = element.getBoundingClientRect();
      const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * strength;
      const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * strength;
      element.style.setProperty("--magnetic-x", `${offsetX.toFixed(2)}px`);
      element.style.setProperty("--magnetic-y", `${offsetY.toFixed(2)}px`);
    },
    [reducedMotion, strength],
  );

  const handlePointerLeave = useCallback(() => {
    const element = ref.current;
    if (!element) return;
    element.style.setProperty("--magnetic-x", "0px");
    element.style.setProperty("--magnetic-y", "0px");
  }, []);

  return { ref, onPointerMove: handlePointerMove, onPointerLeave: handlePointerLeave };
}