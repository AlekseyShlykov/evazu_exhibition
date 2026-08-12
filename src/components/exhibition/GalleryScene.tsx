import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import type { Artwork } from "@/types/artwork";
import { artworks, camelArtwork } from "@/data/artworks";
import { GalleryRoom } from "@/components/gallery/GalleryRoom";
import { ArtworkFrame } from "@/components/gallery/ArtworkFrame";
import { CameraController, type GalleryAction } from "@/components/camera/CameraController";
import { useTimeOfDay, type TimeOfDay } from "@/hooks/useTimeOfDay";

interface GallerySceneProps {
  selectedArtwork?: Artwork;
  onSelect: (artwork: Artwork) => void;
  room: 1 | 2;
  onEnterOtherRoom: () => void;
  onOpenGuestbook: () => void;
  lightingOverride?: TimeOfDay;
  action: GalleryAction;
  onActionComplete: (action: Exclude<GalleryAction, null>) => void;
}

export function GalleryScene({ selectedArtwork, onSelect, room, onEnterOtherRoom, onOpenGuestbook, lightingOverride, action, onActionComplete }: GallerySceneProps) {
  const roomArtworks = room === 1 ? artworks.slice(0, 5) : artworks.slice(5, 9);
  const lighting = useTimeOfDay(lightingOverride);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return (
    <Canvas
      shadows={!mobile}
      dpr={mobile ? 1 : [1, 1.5]}
      camera={{ position: [0, 1.65, -1], fov: 52, near: .1, far: 40 }}
      gl={{ antialias: !mobile, powerPreference: "high-performance", alpha: false }}
      className="touch-none cursor-grab active:cursor-grabbing"
      onPointerMissed={() => undefined}
    >
      <color attach="background" args={[lighting.background]} />
      <fog attach="fog" args={[lighting.fog, 14, 25]} />
      <ambientLight intensity={lighting.ambientIntensity} />
      <hemisphereLight args={[lighting.hemisphereSky, lighting.hemisphereGround, lighting.hemisphereIntensity]} />
      <directionalLight position={[3, 7, 4]} color={lighting.directionalColor} intensity={lighting.directionalIntensity} castShadow={!mobile} shadow-mapSize={[mobile ? 512 : 1024, mobile ? 512 : 1024]} />
      <rectAreaLight position={[0, 3.6, -2]} rotation={[-Math.PI / 2, 0, 0]} width={11} height={11} intensity={lighting.period === "night" ? 2.1 : 2.6} color={lighting.period === "evening" ? "#f3c3a4" : "#fffdf5"} />
      <Suspense fallback={null}>
        <GalleryRoom room={room} onEnterOtherRoom={onEnterOtherRoom} onOpenGuestbook={onOpenGuestbook} lighting={lighting} doorOpening={action === "door"} reducedEffects={mobile} />
        {roomArtworks.map((artwork) => (
          <ArtworkFrame
            key={artwork.id}
            artwork={artwork}
            selected={selectedArtwork?.id === artwork.id}
            onSelect={onSelect}
          />
        ))}
        {room === 2 && (
          <ArtworkFrame artwork={camelArtwork} selected={selectedArtwork?.id === camelArtwork.id} onSelect={onSelect} showLabel={false} generousHitArea />
        )}
        <Preload all />
      </Suspense>
      <CameraController room={room} action={action} mobile={mobile} onActionComplete={onActionComplete} />
    </Canvas>
  );
}
