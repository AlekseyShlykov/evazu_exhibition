export type Vector3Tuple = readonly [number, number, number];

export interface Artwork {
  id: string;
  slug: string;
  title: string;
  description: string;
  year: string;
  materials: string;
  dimensions: string;
  previewImage: string;
  fullImage: string;
  galleryPosition: Vector3Tuple;
  galleryRotation: Vector3Tuple;
  frameSize: readonly [number, number];
  merchandiseAvailable: boolean;
}
