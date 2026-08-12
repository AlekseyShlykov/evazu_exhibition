"use client";

import { useEffect, useState } from "react";
import { artworks, camelArtwork } from "@/data/artworks";
import { assetPath } from "@/lib/paths";
import { track } from "@/lib/analytics";

interface AssetLoadingState {
  progress: number;
  complete: boolean;
  error: boolean;
}

export function useAssetLoader(): AssetLoadingState {
  const [state, setState] = useState<AssetLoadingState>({ progress: 0, complete: false, error: false });

  useEffect(() => {
    let active = true;
    const urls = [...new Set([
      ...artworks.map((artwork) => assetPath(artwork.previewImage)),
      assetPath(camelArtwork.fullImage),
      assetPath("/artworks/window-view.jpg"),
      assetPath("/textures/gallery-plaster.jpg"),
      assetPath("/textures/gallery-stone.jpg"),
      assetPath("/textures/gallery-oak.jpg"),
      assetPath("/icons/favicon.svg")
    ])];
    let settled = 0;
    let failed = false;

    const update = (didFail: boolean) => {
      settled += 1;
      failed ||= didFail;
      const progress = Math.round((settled / urls.length) * 100);
      if (active) setState({ progress, complete: settled === urls.length, error: failed });
      if (settled === urls.length) track("loading_completed", { assetCount: urls.length, failed });
    };

    urls.forEach((url) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        if (typeof image.decode === "function") image.decode().then(() => update(false)).catch(() => update(false));
        else update(false);
      };
      image.onerror = () => update(true);
      image.src = url;
    });

    return () => { active = false; };
  }, []);

  return state;
}
