"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "./LoadingScreen";
import { useAssetLoader } from "@/hooks/useAssetLoader";
import { track } from "@/lib/analytics";

export function Entrance() {
  const router = useRouter();
  const loading = useAssetLoader();
  const [leaving, setLeaving] = useState(false);
  useEffect(() => { router.prefetch("/exhibition"); }, [router]);

  const enter = () => {
    setLeaving(true);
    track("exhibition_started");
    window.setTimeout(() => router.push("/exhibition"), 850);
  };

  return <LoadingScreen {...loading} leaving={leaving} onEnter={enter} />;
}
