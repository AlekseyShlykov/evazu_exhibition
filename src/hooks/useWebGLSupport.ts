"use client";

import { useEffect, useState } from "react";

export function useWebGLSupport(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      setSupported(Boolean(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl"))
      ));
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}
