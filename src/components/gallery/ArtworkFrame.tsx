import { useEffect, useMemo, useState } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { ThreeEvent } from "@react-three/fiber";
import type { Artwork } from "@/types/artwork";
import { assetPath } from "@/lib/paths";
import { track } from "@/lib/analytics";

interface ArtworkFrameProps {
  artwork: Artwork;
  selected: boolean;
  onSelect: (artwork: Artwork) => void;
  showLabel?: boolean;
  generousHitArea?: boolean;
}

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = candidate;
  });
  if (line) lines.push(line);
  return lines;
}

function makeLabelTexture(artwork: Artwork): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 400;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  context.fillStyle = "#e7e3d8";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#282620";
  context.font = "52px Georgia, serif";
  context.fillText(artwork.title, 64, 82);
  context.fillStyle = "#5c584f";
  context.font = "22px Arial, sans-serif";
  context.fillText(`${artwork.year} · ${artwork.materials} · ${artwork.dimensions}`, 64, 130);
  context.font = "20px Arial, sans-serif";
  wrapText(context, artwork.description, 890).slice(0, 4).forEach((line, index) => {
    context.fillText(line, 64, 190 + index * 31);
  });
  const label = new THREE.CanvasTexture(canvas);
  label.colorSpace = THREE.SRGBColorSpace;
  label.anisotropy = 4;
  return label;
}

export function ArtworkFrame({ artwork, selected, onSelect, showLabel = true, generousHitArea = false }: ArtworkFrameProps) {
  const texture = useTexture(assetPath(artwork.previewImage));
  const [hovered, setHovered] = useState(false);
  const [width, height] = artwork.frameSize;
  const labelTexture = useMemo(() => makeLabelTexture(artwork), [artwork]);
  useEffect(() => () => labelTexture.dispose(), [labelTexture]);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  const select = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(artwork);
  };

  return (
    <group position={[...artwork.galleryPosition]} rotation={[...artwork.galleryRotation]}>
      <mesh position={[0, 0, -.045]}>
        <boxGeometry args={[width + .13, height + .13, .09]} />
        <meshStandardMaterial
          color={hovered || selected ? "#453e34" : "#2d2923"}
          roughness={.62}
        />
      </mesh>
      <mesh
        onClick={select}
        onPointerEnter={(event) => {
          event.stopPropagation();
          document.body.style.cursor = "pointer";
          setHovered(true);
          track("artwork_hovered", { artwork: artwork.slug });
        }}
        onPointerLeave={() => {
          document.body.style.cursor = "default";
          setHovered(false);
        }}
        position={[0, 0, .012]}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={texture} roughness={.8} toneMapped />
      </mesh>
      {generousHitArea && (
        <mesh
          position={[0, 0, .035]}
          onClick={select}
          onPointerEnter={(event) => { event.stopPropagation(); document.body.style.cursor = "pointer"; setHovered(true); }}
          onPointerLeave={() => { document.body.style.cursor = "default"; setHovered(false); }}
        >
          <planeGeometry args={[width * 1.3, height * 1.3]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
      {showLabel && (
        <mesh position={[0, -height / 2 - .34, .025]}>
          <planeGeometry args={[.92, .36]} />
          <meshStandardMaterial map={labelTexture} color="#f3efe5" roughness={.9} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}
