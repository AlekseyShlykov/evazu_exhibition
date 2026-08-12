import type { Artwork } from "@/types/artwork";

const roomCenterZ = -2;
const roomRadius = 6;
export function gallerySpot(index: number, height = 1.8) {
  const angle = index * Math.PI * 2 / 7;
  return {
    position: [Math.sin(angle) * roomRadius, height, roomCenterZ + Math.cos(angle) * roomRadius] as const,
    rotation: [0, angle + Math.PI, 0] as const,
  };
}

export const artworks: readonly Artwork[] = [
  {
    id: "artwork-01",
    slug: "held-in-bloom",
    title: "Held in Bloom",
    description: "A tender assembly of fragments where botanical forms hold a private, suspended conversation.",
    year: "2024",
    materials: "Hand-cut paper collage",
    dimensions: "50 × 68 cm",
    previewImage: "/artworks/previews/1.jpg",
    fullImage: "/artworks/full/1.jpg",
    galleryPosition: gallerySpot(0).position,
    galleryRotation: gallerySpot(0).rotation,
    frameSize: [1.36, 1.85],
    merchandiseAvailable: true
  },
  {
    id: "artwork-02",
    slug: "between-two-skies",
    title: "Between Two Skies",
    description: "Architecture, memory and landscape meet in an improbable horizon assembled by hand.",
    year: "2024",
    materials: "Paper collage on board",
    dimensions: "68 × 50 cm",
    previewImage: "/artworks/previews/2.jpg",
    fullImage: "/artworks/full/2.jpg",
    galleryPosition: gallerySpot(1, 1.75).position,
    galleryRotation: gallerySpot(1).rotation,
    frameSize: [2, 1.48],
    merchandiseAvailable: true
  },
  {
    id: "artwork-03",
    slug: "quiet-orbit",
    title: "Quiet Orbit",
    description: "A dreamlike orbit of found images, balanced between domestic scale and cosmic distance.",
    year: "2023",
    materials: "Vintage paper collage",
    dimensions: "70 × 50 cm",
    previewImage: "/artworks/previews/3.jpg",
    fullImage: "/artworks/full/3.jpg",
    galleryPosition: gallerySpot(2).position,
    galleryRotation: gallerySpot(2).rotation,
    frameSize: [2.1, 1.27],
    merchandiseAvailable: true
  },
  {
    id: "artwork-04",
    slug: "after-the-rain",
    title: "After the Rain",
    description: "A tender assembly of fragments where botanical forms hold a private, suspended conversation.",
    year: "2024", materials: "Hand-cut paper collage", dimensions: "50 × 68 cm",
    previewImage: "/artworks/previews/4.jpg", fullImage: "/artworks/full/4.jpg",
    galleryPosition: gallerySpot(3).position, galleryRotation: gallerySpot(3).rotation, frameSize: [1.5, 1.85], merchandiseAvailable: true
  },
  {
    id: "artwork-05",
    slug: "soft-geometry",
    title: "Soft Geometry",
    description: "Architecture, memory and landscape meet in an improbable horizon assembled by hand.",
    year: "2024", materials: "Paper collage on board", dimensions: "68 × 50 cm",
    previewImage: "/artworks/previews/5.jpg", fullImage: "/artworks/full/5.jpg",
    galleryPosition: gallerySpot(4, 1.75).position, galleryRotation: gallerySpot(4).rotation, frameSize: [2, 1.48], merchandiseAvailable: true
  },
  { id: "artwork-06", slug: "distant-garden", title: "Distant Garden", description: "A dreamlike orbit of found images, balanced between domestic scale and cosmic distance.", year: "2023", materials: "Vintage paper collage", dimensions: "70 × 50 cm", previewImage: "/artworks/previews/6.jpg", fullImage: "/artworks/full/6.jpg", galleryPosition: gallerySpot(0).position, galleryRotation: gallerySpot(0).rotation, frameSize: [1.53, 1.85], merchandiseAvailable: true },
  { id: "artwork-07", slug: "collected-light", title: "Collected Light", description: "A tender assembly of fragments where botanical forms hold a private, suspended conversation.", year: "2024", materials: "Hand-cut paper collage", dimensions: "50 × 68 cm", previewImage: "/artworks/previews/7.jpg", fullImage: "/artworks/full/7.jpg", galleryPosition: gallerySpot(1).position, galleryRotation: gallerySpot(1).rotation, frameSize: [1.48, 1.85], merchandiseAvailable: true },
  { id: "artwork-08", slug: "borrowed-horizon", title: "Borrowed Horizon", description: "Architecture, memory and landscape meet in an improbable horizon assembled by hand.", year: "2024", materials: "Paper collage on board", dimensions: "68 × 50 cm", previewImage: "/artworks/previews/8.jpg", fullImage: "/artworks/full/8.jpg", galleryPosition: gallerySpot(2, 1.75).position, galleryRotation: gallerySpot(2).rotation, frameSize: [2.05, 1.48], merchandiseAvailable: true },
  { id: "artwork-09", slug: "still-satellite", title: "Still Satellite", description: "A dreamlike orbit of found images, balanced between domestic scale and cosmic distance.", year: "2023", materials: "Vintage paper collage", dimensions: "70 × 50 cm", previewImage: "/artworks/previews/9.jpg", fullImage: "/artworks/full/9.jpg", galleryPosition: gallerySpot(3).position, galleryRotation: gallerySpot(3).rotation, frameSize: [1.85, 1.57], merchandiseAvailable: true }
] as const;

export const camelArtwork: Artwork = {
  id: "easter-egg-camel",
  slug: "camel-on-the-ceiling",
  title: "Camel",
  description: "A small hidden collage discovered above the second hall.",
  year: "2026",
  materials: "Digital collage",
  dimensions: "Hidden miniature",
  previewImage: "/artworks/camel.jpg",
  fullImage: "/artworks/camel.jpg",
  galleryPosition: [.7, 4.09, -2.35],
  galleryRotation: [Math.PI / 2, 0, -.18],
  frameSize: [.58, .64],
  merchandiseAvailable: true,
};

export function getArtworkBySlug(slug: string | null): Artwork | undefined {
  return artworks.find((artwork) => artwork.slug === slug) ?? (slug === camelArtwork.slug ? camelArtwork : undefined);
}
