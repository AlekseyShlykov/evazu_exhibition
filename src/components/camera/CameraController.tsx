import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gallerySpot } from "@/data/artworks";

export type GalleryAction = "door" | "book" | null;
interface CameraControllerProps { room: 1 | 2; action: GalleryAction; onActionComplete: (action: Exclude<GalleryAction, null>) => void; }

const homePosition = new THREE.Vector3(0, 1.65, -2);
const ease = (value: number) => value * value * (3 - 2 * value);

export function CameraController({ room, action, onActionComplete }: CameraControllerProps) {
  const { camera, gl } = useThree();
  const yaw = useRef(0);
  const pitch = useRef(0);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const animation = useRef({ elapsed: 0, fromPosition: homePosition.clone(), fromQuaternion: new THREE.Quaternion(), finished: false });

  useEffect(() => {
    yaw.current = 0;
    pitch.current = 0;
    camera.position.copy(homePosition);
  }, [camera, room]);

  useEffect(() => {
    if (!action) return;
    animation.current = { elapsed: 0, fromPosition: camera.position.clone(), fromQuaternion: camera.quaternion.clone(), finished: false };
    dragging.current = false;
  }, [action, camera]);

  useEffect(() => {
    const element = gl.domElement;
    const down = (event: PointerEvent) => {
      if (action) return;
      dragging.current = true;
      last.current = { x: event.clientX, y: event.clientY };
      element.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (!dragging.current || action) return;
      yaw.current += (event.clientX - last.current.x) * .00252;
      pitch.current = THREE.MathUtils.clamp(pitch.current + (event.clientY - last.current.y) * .0021, -.72, .72);
      last.current = { x: event.clientX, y: event.clientY };
    };
    const up = (event: PointerEvent) => {
      dragging.current = false;
      if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
    };
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", up);
    element.addEventListener("pointercancel", up);
    return () => {
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerup", up);
      element.removeEventListener("pointercancel", up);
    };
  }, [action, gl]);

  useFrame((_, delta) => {
    if (!action) {
      camera.rotation.order = "YXZ";
      camera.rotation.set(pitch.current, yaw.current, 0);
      camera.position.copy(homePosition);
      return;
    }

    const state = animation.current;
    state.elapsed += delta;
    const spot = gallerySpot(action === "door" ? 5 : 4, action === "door" ? 1.55 : .95);
    const normal = new THREE.Vector3(Math.sin(spot.rotation[1]), 0, Math.cos(spot.rotation[1]));
    const focus = new THREE.Vector3(...spot.position).add(action === "book" ? normal.clone().multiplyScalar(.69) : normal.clone().multiplyScalar(-2));
    const approach = new THREE.Vector3(...spot.position).add(normal.clone().multiplyScalar(action === "door" ? 1.35 : 1.18));
    approach.y = action === "door" ? 1.58 : 2.15;
    const destination = action === "door"
      ? new THREE.Vector3(...spot.position).add(normal.clone().multiplyScalar(-1.55)).setY(1.58)
      : approach;
    const lookFrom = action === "door" ? approach : destination;
    const targetQuaternion = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(lookFrom, focus, camera.up));
    const duration = action === "door" ? 2.35 : 1.65;
    const progress = Math.min(state.elapsed / duration, 1);
    const positionProgress = action === "door" && progress > .72
      ? approach.clone().lerp(destination, ease((progress - .72) / .28))
      : state.fromPosition.clone().lerp(approach, ease(Math.min(progress / .72, 1)));
    camera.position.copy(positionProgress);
    camera.quaternion.slerpQuaternions(state.fromQuaternion, targetQuaternion, ease(progress));
    if (progress === 1 && !state.finished) {
      state.finished = true;
      onActionComplete(action);
    }
  });

  return null;
}
