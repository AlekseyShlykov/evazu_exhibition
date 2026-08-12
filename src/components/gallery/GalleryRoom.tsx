import { useEffect, useMemo, useRef, useState } from "react";
import { ContactShadows, useTexture } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { gallerySpot } from "@/data/artworks";
import type { LightingPreset } from "@/hooks/useTimeOfDay";
import { assetPath } from "@/lib/paths";

interface GalleryRoomProps {
  room: 1 | 2;
  onEnterOtherRoom: () => void;
  onOpenGuestbook: () => void;
  lighting: LightingPreset;
  doorOpening: boolean;
  reducedEffects: boolean;
}

const wallIndexes = [0, 1, 2, 3, 4, 5, 6] as const;

function signTexture(label: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  context.fillStyle = "#eeeae0";
  context.fillRect(0, 0, 512, 128);
  context.fillStyle = "#2f2d29";
  context.font = "44px Georgia, serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(label, 256, 66);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function GalleryRoom({ room, onEnterOtherRoom, onOpenGuestbook, lighting, doorOpening, reducedEffects }: GalleryRoomProps) {
  const [doorHovered, setDoorHovered] = useState(false);
  const [bookHovered, setBookHovered] = useState(false);
  const doorHinge = useRef<THREE.Group>(null);
  const windowTexture = useTexture(assetPath("/artworks/window-view.jpg"));
  const [wallTexture, stoneTexture, doorTexture] = useTexture([
    assetPath("/textures/gallery-plaster.jpg"),
    assetPath("/textures/gallery-stone.jpg"),
    assetPath("/textures/gallery-oak.jpg"),
  ]);
  const plaqueTexture = useMemo(() => signTexture(room === 1 ? "Hall 2" : "Hall 1"), [room]);
  [windowTexture, wallTexture, stoneTexture, doorTexture].forEach((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
  });
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(2.8, 2.2);
  stoneTexture.wrapS = stoneTexture.wrapT = THREE.RepeatWrapping;
  stoneTexture.repeat.set(3.5, 3.5);
  doorTexture.wrapS = doorTexture.wrapT = THREE.RepeatWrapping;
  doorTexture.repeat.set(1, 1.7);
  const skyColor = useMemo(() => new THREE.Color(lighting.sky), [lighting.sky]);

  useEffect(() => () => plaqueTexture.dispose(), [plaqueTexture]);

  useFrame((_, delta) => {
    if (!doorHinge.current) return;
    doorHinge.current.rotation.y = THREE.MathUtils.damp(doorHinge.current.rotation.y, doorOpening ? -1.48 : 0, 3.6, delta);
  });

  const enterRoom = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onEnterOtherRoom();
  };

  const openGuestbook = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onOpenGuestbook();
  };

  return (
    <group>
      <mesh receiveShadow position={[0, -.04, -2]}>
        <cylinderGeometry args={[7.05, 7.05, .08, 64]} />
        <meshStandardMaterial map={stoneTexture} bumpMap={stoneTexture} bumpScale={.028} color={room === 1 ? "#c1beb6" : "#bab9b5"} roughness={.76} metalness={0} />
      </mesh>
      {wallIndexes.map((index) => {
        const spot = gallerySpot(index);
        return (
          <group key={index} position={[...spot.position]} rotation={[...spot.rotation]}>
            {index === 5 ? (
              <group>
                <mesh receiveShadow position={[-1.72, .3, -.14]}><boxGeometry args={[1.81, 4.25, .2]} /><meshStandardMaterial map={wallTexture} bumpMap={wallTexture} bumpScale={.024} color={lighting.roomTint} roughness={.91} /></mesh>
                <mesh receiveShadow position={[1.72, .3, -.14]}><boxGeometry args={[1.81, 4.25, .2]} /><meshStandardMaterial map={wallTexture} bumpMap={wallTexture} bumpScale={.024} color={lighting.roomTint} roughness={.91} /></mesh>
                <mesh receiveShadow position={[0, 1.85, -.14]}><boxGeometry args={[1.65, 1.15, .2]} /><meshStandardMaterial map={wallTexture} bumpMap={wallTexture} bumpScale={.024} color={lighting.roomTint} roughness={.91} /></mesh>
                <mesh position={[0, -.18, -.65]}><planeGeometry args={[1.62, 3.18]} /><meshStandardMaterial color={room === 1 ? "#d9d5cc" : "#ddd9d0"} emissive={lighting.directionalColor} emissiveIntensity={.16} roughness={.92} /></mesh>
                <mesh position={[-.82, -.18, -.35]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[.5, 3.2]} /><meshStandardMaterial map={wallTexture} color={lighting.roomTint} roughness={.92} /></mesh>
                <mesh position={[.82, -.18, -.35]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[.5, 3.2]} /><meshStandardMaterial map={wallTexture} color={lighting.roomTint} roughness={.92} /></mesh>
                <mesh position={[0, 1.41, -.35]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[1.65, .5]} /><meshStandardMaterial map={wallTexture} color={lighting.roomTint} roughness={.92} /></mesh>
              </group>
            ) : (
              <mesh receiveShadow position={[0, .3, -.14]}>
                <boxGeometry args={[5.25, 4.25, .2]} />
                <meshStandardMaterial map={wallTexture} bumpMap={wallTexture} bumpScale={.024} color={room === 1 ? lighting.roomTint : new THREE.Color(lighting.roomTint).multiplyScalar(.97)} roughness={.91} metalness={0} />
              </mesh>
            )}
            <mesh position={[0, -1.81, .01]}>
              <boxGeometry args={[5.25, .055, .08]} />
              <meshStandardMaterial color="#d3d0c7" roughness={.88} />
            </mesh>
            {index === 5 && (
              <group>
                <group
                  ref={doorHinge}
                  position={[-.825, -.18, .035]}
                  onClick={enterRoom}
                  onPointerEnter={(event) => { event.stopPropagation(); setDoorHovered(true); document.body.style.cursor = "pointer"; }}
                  onPointerLeave={() => { setDoorHovered(false); document.body.style.cursor = "grab"; }}
                >
                  <mesh castShadow position={[.825, 0, 0]}>
                    <boxGeometry args={[1.65, 3.2, .085]} />
                    <meshStandardMaterial map={doorTexture} bumpMap={doorTexture} bumpScale={.035} color={doorHovered ? "#b9aa99" : "#a69787"} roughness={.64} metalness={0} />
                  </mesh>
                  <mesh position={[.825, .73, .055]}><boxGeometry args={[1.25, .035, .035]} /><meshStandardMaterial color="#453f39" roughness={.78} /></mesh>
                  <mesh position={[.825, -.67, .055]}><boxGeometry args={[1.25, .035, .035]} /><meshStandardMaterial color="#453f39" roughness={.78} /></mesh>
                  <mesh position={[1.405, 0, .075]}><sphereGeometry args={[.045, 16, 16]} /><meshStandardMaterial color="#c4b998" metalness={.35} roughness={.4} /></mesh>
                </group>
                <mesh position={[-.88, -.18, .045]}><boxGeometry args={[.085, 3.32, .09]} /><meshStandardMaterial map={doorTexture} color="#766a5f" roughness={.7} /></mesh>
                <mesh position={[.88, -.18, .045]}><boxGeometry args={[.085, 3.32, .09]} /><meshStandardMaterial map={doorTexture} color="#766a5f" roughness={.7} /></mesh>
                <mesh position={[0, 1.5, .045]}><boxGeometry args={[1.84, .085, .09]} /><meshStandardMaterial map={doorTexture} color="#766a5f" roughness={.7} /></mesh>
                <mesh position={[0, 1.64, .07]}><planeGeometry args={[1.05, .265]} /><meshBasicMaterial map={plaqueTexture} toneMapped={false} /></mesh>
              </group>
            )}
            {index === 6 && (
              <group position={[0, .22, .035]}>
                <mesh>
                  <planeGeometry args={[2.6, 1.95]} />
                  <meshStandardMaterial map={windowTexture} color={skyColor} emissive={skyColor} emissiveMap={windowTexture} emissiveIntensity={lighting.windowIntensity} roughness={.55} />
                </mesh>
                <mesh position={[0, 0, .025]}><boxGeometry args={[.055, 2.08, .06]} /><meshStandardMaterial color="#e6e2d8" /></mesh>
                <mesh position={[0, 0, .02]}><boxGeometry args={[2.78, 2.13, .05]} /><meshStandardMaterial color="#d5d1c8" wireframe /></mesh>
              </group>
            )}
          </group>
        );
      })}
      {room === 2 && (() => {
        const spot = gallerySpot(4, 0);
        return (
          <group position={[...spot.position]} rotation={[...spot.rotation]}>
            <mesh castShadow receiveShadow position={[0, .82, .72]}>
              <boxGeometry args={[1.85, .11, .78]} />
              <meshStandardMaterial map={doorTexture} bumpMap={doorTexture} bumpScale={.02} color="#a99a89" roughness={.68} />
            </mesh>
            {[-.76, .76].flatMap((x) => [-.24, .24].map((z) => (
              <mesh key={`${x}-${z}`} castShadow position={[x, .4, .72 + z]}>
                <boxGeometry args={[.085, .78, .085]} />
                <meshStandardMaterial map={doorTexture} color="#817568" roughness={.72} />
              </mesh>
            )))}
            <group
              position={[0, .91, .69]}
              onClick={openGuestbook}
              onPointerEnter={(event) => { event.stopPropagation(); setBookHovered(true); document.body.style.cursor = "pointer"; }}
              onPointerLeave={() => { setBookHovered(false); document.body.style.cursor = "grab"; }}
            >
              <mesh castShadow position={[-.31, .015, 0]} rotation={[-Math.PI / 2, 0, -.09]}>
                <planeGeometry args={[.62, .78]} />
                <meshStandardMaterial color={bookHovered ? "#fffdf5" : "#eee9dc"} roughness={.82} side={THREE.DoubleSide} />
              </mesh>
              <mesh castShadow position={[.31, .015, 0]} rotation={[-Math.PI / 2, 0, .09]}>
                <planeGeometry args={[.62, .78]} />
                <meshStandardMaterial color={bookHovered ? "#fffdf5" : "#eee9dc"} roughness={.82} side={THREE.DoubleSide} />
              </mesh>
              {[-.16, -.08, 0, .08, .16].map((z) => (
                <group key={z}>
                  <mesh position={[-.31, .025, z]} rotation={[-Math.PI / 2, 0, -.09]}><planeGeometry args={[.38, .008]} /><meshBasicMaterial color="#999286" /></mesh>
                  <mesh position={[.31, .025, z]} rotation={[-Math.PI / 2, 0, .09]}><planeGeometry args={[.38, .008]} /><meshBasicMaterial color="#999286" /></mesh>
                </group>
              ))}
              <mesh position={[0, -.005, 0]}><boxGeometry args={[.055, .055, .8]} /><meshStandardMaterial color="#8b3f35" roughness={.7} /></mesh>
            </group>
          </group>
        );
      })()}
      <mesh position={[0, 4.17, -2]}>
        <cylinderGeometry args={[7, 7, .08, 64]} />
        <meshStandardMaterial map={wallTexture} bumpMap={wallTexture} bumpScale={.012} color="#e7e4dc" roughness={.96} />
      </mesh>
      {!reducedEffects && <ContactShadows position={[0, .02, -2]} opacity={.16} scale={14} blur={3.2} far={4} frames={1} />}
    </group>
  );
}
